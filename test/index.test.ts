import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORTED_STATES,
  STATES,
  addBusinessDays,
  countWorkingDays,
  getBankClosureReason,
  getHolidays,
  getHolidaysOn,
  isBankHoliday,
  isHoliday,
  isWorkingDay,
  nextWorkingDay,
  previousWorkingDay,
  upcomingHolidays,
} from '../src/index.ts';
import { holidays2026 } from '../src/data/2026.ts';
import { holidays2027 } from '../src/data/2027.ts';

for (const [year, data] of [[2026, holidays2026], [2027, holidays2027]] as const) test(`${year} dataset is sorted, valid and uses known state codes`, () => {
  const dates = data.map((h) => h.date);
  assert.deepEqual(dates, [...dates].sort());
  for (const h of data) {
    assert.match(h.date, new RegExp(`^${year}-\\d{2}-\\d{2}$`));
    assert.doesNotThrow(() => isHoliday(h.date), `${h.name}: invalid date ${h.date}`);
    assert.ok(h.types.length > 0, `${h.name} has no types`);
    assert.ok(h.source.length > 0);
    for (const scope of [h.states, h.bank]) {
      if (scope && scope !== 'ALL') for (const s of scope) assert.ok(s in STATES, `${h.name}: bad state ${s}`);
    }
  }
});

test('national holidays are bank holidays in every supported state', () => {
  for (const state of SUPPORTED_STATES) {
    for (const d of ['2026-01-26', '2026-08-15', '2026-10-02']) {
      assert.equal(isBankHoliday(d, state), true, `${d} in ${state}`);
    }
  }
});

test('state-specific holidays only apply to their state', () => {
  assert.equal(isBankHoliday('2026-02-19', 'MH'), true); // Shivaji Jayanti (Thursday)
  assert.equal(isBankHoliday('2026-02-19', 'KA'), false);
  assert.equal(isHoliday('2026-11-01', { state: 'KA' }), true); // Kannada Rajyotsava
  assert.equal(isHoliday('2026-11-01', { state: 'TN' }), false);
});

test('Sundays and 2nd/4th Saturdays are bank holidays', () => {
  assert.deepEqual(getBankClosureReason('2026-11-15', 'DL'), { kind: 'sunday' });
  assert.deepEqual(getBankClosureReason('2026-11-14', 'DL'), { kind: 'second-saturday' });
  assert.deepEqual(getBankClosureReason('2026-11-28', 'DL'), { kind: 'fourth-saturday' });
  assert.equal(getBankClosureReason('2026-11-21', 'DL'), null); // 3rd Saturday
  assert.equal(getBankClosureReason('2026-11-07', 'DL'), null); // 1st Saturday
  assert.equal(isWorkingDay('2026-11-16', 'DL'), true); // Monday
});

test('a holiday on a 3rd Saturday closes banks', () => {
  const r = getBankClosureReason('2026-03-21', 'MH'); // Id-ul-Fitr
  assert.equal(r?.kind, 'holiday');
});

test('Date objects are read as the calendar date in India', () => {
  // Explicit offsets keep this test independent of the machine's time zone
  // (test/timezone.test.ts runs these checks under several server time zones).
  assert.equal(isBankHoliday(new Date('2026-01-26T10:00:00+05:30'), 'TN'), true);
  assert.equal(isBankHoliday(new Date('2026-01-26T00:15:00+05:30'), 'TN'), true);
});

test('next / previous working day skip weekends and holidays', () => {
  // Fri 2 Oct (Gandhi Jayanti) → Sat 3 Oct is a 1st Saturday, so banks open.
  assert.equal(nextWorkingDay('2026-10-01', 'MH'), '2026-10-03');
  // Thu 24 Dec → Fri 25 Christmas, Sat 26 4th Saturday, Sun 27 → Mon 28.
  assert.equal(nextWorkingDay('2026-12-24', 'KA'), '2026-12-28');
  assert.equal(previousWorkingDay('2026-12-28', 'KA'), '2026-12-24');
});

test('addBusinessDays works both directions', () => {
  assert.equal(addBusinessDays('2026-11-16', 5, 'DL'), '2026-11-21'); // Mon → 3rd Sat counts
  assert.equal(addBusinessDays('2026-11-21', -5, 'DL'), '2026-11-16');
  assert.equal(addBusinessDays('2026-11-15', 0, 'DL'), '2026-11-16');
  assert.equal(countWorkingDays('2026-11-16', '2026-11-22', 'DL'), 6);
});

test('Durga Puja is a long bank break in West Bengal only (RBI 2026)', () => {
  // Sun 18 (Saptami), Mon 19 (Ashtami), Tue 20 (Navami/Dussehra), Wed 21 (Dashami).
  for (const d of ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21']) {
    assert.equal(isBankHoliday(d, 'WB'), true, d);
  }
  assert.equal(isBankHoliday('2026-10-17', 'WB'), false); // 3rd Saturday: RBI lists no holiday
  assert.equal(isBankHoliday('2026-10-21', 'DL'), false); // Dashami holiday is not in Delhi
  assert.equal(nextWorkingDay('2026-10-17', 'WB'), '2026-10-22');
});

test('filtering by type and bankOnly', () => {
  const national = getHolidays(2026, { type: 'national' }).map((h) => h.name);
  assert.deepEqual(national, ['Republic Day', 'Independence Day', 'Gandhi Jayanti']);
  const kl = getHolidays(2026, { state: 'KL', bankOnly: true });
  assert.ok(kl.some((h) => h.name === 'Thiruvonam (Onam)'));
  assert.ok(!kl.some((h) => h.name === 'Raksha Bandhan'));
  // Festivals with no official holiday still appear in a state's calendar view.
  assert.ok(getHolidays(2026, { state: 'KL' }).some((h) => h.name === 'Raksha Bandhan'));
});

test('several holidays on one day are all returned', () => {
  const names = getHolidaysOn('2026-05-01', { state: 'MH' }).map((h) => h.name);
  assert.deepEqual(names, ['Buddha Purnima', 'Maharashtra Day']);
});

test('upcomingHolidays', () => {
  const next = upcomingHolidays({ from: '2026-11-16', state: 'DL', bankOnly: true, limit: 2 });
  assert.deepEqual(next.map((h) => h.date), ['2026-11-24', '2026-12-25']);
});

test('refuses to guess for unsupported years, states and bad input', () => {
  assert.throws(() => isBankHoliday('2028-01-26', 'MH'), /no data for 2028/);
  // JavaScript callers have no types, so the runtime check must still work.
  // @ts-expect-error  'GJ' is rejected at compile time too (see types.check.ts).
  assert.throws(() => isBankHoliday('2026-01-26', 'GJ'), /no curated data yet/);
  assert.throws(() => isBankHoliday('2026-01-26', 'XX' as never), /Unknown state code/);
  assert.throws(() => isHoliday('26-01-2026'), /YYYY-MM-DD/);
  assert.throws(() => isHoliday('2026-02-30'), /Not a real calendar date/);
});

test('2027: DoPT gazetted dates', () => {
  const gazetted = getHolidays(2027, { type: 'gazetted' }).map((h) => `${h.date} ${h.name}`);
  assert.equal(gazetted.length, 17);
  for (const d of ['2027-03-10', '2027-03-23', '2027-05-17', '2027-10-09', '2027-10-29', '2027-12-25']) {
    assert.ok(gazetted.some((g) => g.startsWith(d)), d);
  }
});

test('2027: bank holidays and state rules', () => {
  assert.equal(isBankHoliday('2027-10-29', 'TN'), true); // Diwali, Friday
  assert.equal(isBankHoliday('2027-04-07', 'MH'), true); // Gudi Padwa
  assert.equal(isBankHoliday('2027-04-07', 'DL'), false);
  assert.equal(isBankHoliday('2027-09-04', 'KL'), false); // Ganesh Chaturthi not in Kerala; 1st Saturday
  assert.equal(isBankHoliday('2027-09-04', 'MH'), true);
  // Durga Puja: Wed–Sat closed in WB, then Sunday.
  assert.equal(nextWorkingDay('2027-10-05', 'WB'), '2027-10-11');
});

test('working-day maths crosses the 2026 → 2027 boundary', () => {
  assert.equal(nextWorkingDay('2026-12-31', 'DL'), '2027-01-01');
  assert.equal(previousWorkingDay('2027-01-01', 'DL'), '2026-12-31');
  assert.equal(addBusinessDays('2026-12-24', 5, 'KA'), '2027-01-01'); // 28, 29, 30, 31, 1 Jan
  const next = upcomingHolidays({ from: '2026-12-20', state: 'MH', bankOnly: true, limit: 2 });
  assert.deepEqual(next.map((h) => h.date), ['2026-12-25', '2027-01-26']);
});
