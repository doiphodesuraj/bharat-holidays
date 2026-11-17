import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORTED_STATES,
  SUPPORTED_YEARS,
  addBusinessDays,
  countWorkingDays,
  getBankClosureReason,
  getHolidays,
  isBankHoliday,
  isWorkingDay,
  nextWorkingDay,
  previousWorkingDay,
  toISODate,
  upcomingHolidays,
} from '../src/index.ts';

/** Every date of a year, built independently of the library's date helpers. */
function allDays(year: number): { iso: string; dow: number; dom: number }[] {
  const out = [];
  for (let t = Date.UTC(year, 0, 1); new Date(t).getUTCFullYear() === year; t += 86_400_000) {
    const d = new Date(t);
    out.push({ iso: d.toISOString().slice(0, 10), dow: d.getUTCDay(), dom: d.getUTCDate() });
  }
  return out;
}

test('every Sunday and every 2nd/4th Saturday of 2026–2027 is closed in every state', () => {
  for (const year of SUPPORTED_YEARS) {
    for (const { iso, dow, dom } of allDays(year)) {
      const weekendRule = dow === 0 || (dow === 6 && (Math.ceil(dom / 7) === 2 || Math.ceil(dom / 7) === 4));
      for (const state of SUPPORTED_STATES) {
        if (weekendRule) assert.equal(isBankHoliday(iso, state), true, `${iso} ${state}`);
      }
    }
  }
});

test('1st, 3rd and 5th Saturdays are open unless a holiday falls on them', () => {
  for (const year of SUPPORTED_YEARS) {
    for (const { iso, dow, dom } of allDays(year)) {
      if (dow !== 6 || [2, 4].includes(Math.ceil(dom / 7))) continue;
      for (const state of SUPPORTED_STATES) {
        const reason = getBankClosureReason(iso, state);
        assert.ok(reason === null || reason.kind === 'holiday', `${iso} ${state}: ${JSON.stringify(reason)}`);
      }
    }
  }
});

test('a holiday takes priority over the Saturday rule; Sunday holidays follow the RBI list', () => {
  // Mahalaya 10 Oct 2026 is a 2nd Saturday, but the RBI lists it as a holiday, so the reason names it.
  const r = getBankClosureReason('2026-10-10', 'WB');
  assert.equal(r?.kind, 'holiday');
  assert.ok(r?.kind === 'holiday' && r.holidays.some((h) => h.name.startsWith('Mahalaya')));
  // Diwali 2026 falls on a Sunday. The RBI does not list it, so the reason is "sunday",
  // but it still appears as a holiday in the calendar view.
  assert.deepEqual(getBankClosureReason('2026-11-08', 'DL'), { kind: 'sunday' });
  assert.equal(isBankHoliday('2026-11-08', 'DL'), true);
});

test('2027 weekdays match the weekdays printed in the DoPT order', () => {
  // Weekdays copied from Annexure I of DoPT O.M. dated 16 Jul 2026: an independent check on date typos.
  const dopt: Record<string, string> = {
    'Republic Day': 'Tue', 'Id-ul-Fitr': 'Wed', 'Holi': 'Tue', 'Good Friday': 'Fri',
    'Ram Navami': 'Thu', 'Mahavir Jayanti': 'Mon', 'Id-ul-Zuha (Bakrid)': 'Mon',
    'Buddha Purnima': 'Thu', 'Muharram': 'Wed', 'Independence Day': 'Sun',
    'Milad-un-Nabi': 'Sun', 'Janmashtami': 'Wed', 'Gandhi Jayanti': 'Sat',
    'Dussehra (Vijaya Dashami)': 'Sat', 'Diwali (Deepavali)': 'Fri',
    'Guru Nanak Jayanti': 'Sun', 'Christmas': 'Sat',
  };
  const gazetted = getHolidays(2027, { type: 'gazetted' });
  assert.equal(gazetted.length, Object.keys(dopt).length);
  for (const h of gazetted) {
    const day = new Date(`${h.date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    assert.equal(day, dopt[h.name], `${h.name} on ${h.date}`);
  }
});

test('only moon-sighting festivals are tentative among 2027 gazetted holidays', () => {
  const tentative = getHolidays(2027, { type: 'gazetted' }).filter((h) => h.tentative).map((h) => h.name);
  assert.deepEqual(tentative.sort(), ['Id-ul-Fitr', 'Id-ul-Zuha (Bakrid)', 'Milad-un-Nabi', 'Muharram']);
});

test('nextWorkingDay / previousWorkingDay always land on an open day, strictly after/before', () => {
  for (const state of SUPPORTED_STATES) {
    for (const { iso } of allDays(2026).filter((_, i) => i % 3 === 0)) {
      const next = nextWorkingDay(iso, state);
      assert.ok(next > iso && isWorkingDay(next, state), `${state} next(${iso}) = ${next}`);
      if (iso > '2026-01-10') {
        const prev = previousWorkingDay(iso, state);
        assert.ok(prev < iso && isWorkingDay(prev, state), `${state} prev(${iso}) = ${prev}`);
      }
    }
  }
});

test('addBusinessDays(+n) then (-n) returns to the start day', () => {
  for (const state of SUPPORTED_STATES) {
    for (const { iso } of allDays(2026).filter((d, i) => i % 5 === 0 && d.iso > '2026-02-01')) {
      if (!isWorkingDay(iso, state)) continue;
      for (const n of [1, 3, 10, 20]) {
        const forward = addBusinessDays(iso, n, state);
        assert.equal(addBusinessDays(forward, -n, state), iso, `${state} ${iso} ±${n}`);
        assert.equal(countWorkingDays(iso, forward, state), n + 1, `${state} count ${iso}..${forward}`);
      }
    }
  }
});

test('countWorkingDays across a full year equals days minus closures', () => {
  for (const state of SUPPORTED_STATES) {
    const days = allDays(2026);
    const closed = days.filter((d) => isBankHoliday(d.iso, state)).length;
    assert.equal(countWorkingDays('2026-01-01', '2026-12-31', state), days.length - closed);
    // Sanity range: 365 − 52 Sundays − 24 (2nd/4th Saturdays) = 289, minus ~10–25 weekday holidays.
    const open = days.length - closed;
    assert.ok(open >= 260 && open <= 285, `${state}: ${open} working days`);
  }
});

test('type filter accepts an array and combines with state', () => {
  const list = getHolidays(2026, { state: 'MH', type: ['national', 'regional'] });
  assert.ok(list.every((h) => h.types.includes('national') || h.types.includes('regional')));
  assert.ok(list.some((h) => h.name === 'Maharashtra Day'));
  assert.ok(!list.some((h) => h.name === 'Kannada Rajyotsava'));
});

test('getHolidays results are sorted and every bank entry is also in the state list', () => {
  for (const year of SUPPORTED_YEARS) {
    for (const state of SUPPORTED_STATES) {
      const all = getHolidays(year, { state });
      const bank = getHolidays(year, { state, bankOnly: true });
      assert.deepEqual(all.map((h) => h.date), all.map((h) => h.date).sort());
      for (const b of bank) assert.ok(all.includes(b), `${year} ${state}: ${b.name}`);
    }
  }
});

test('upcomingHolidays honours limit, including 0', () => {
  assert.equal(upcomingHolidays({ from: '2026-01-01', limit: 0 }).length, 0);
  assert.equal(upcomingHolidays({ from: '2026-01-01', limit: 3 }).length, 3);
  // Past the last supported date, nothing is returned rather than an error.
  assert.deepEqual(upcomingHolidays({ from: '2027-12-26' }), []);
});

test('toISODate accepts valid input and rejects invalid input', () => {
  assert.equal(toISODate('2028-02-29'), '2028-02-29'); // leap day is a real date
  assert.equal(toISODate(new Date(2027, 11, 31, 23, 59)), '2027-12-31');
  assert.throws(() => toISODate('2027-02-29'), /Not a real calendar date/);
  assert.throws(() => toISODate('2026-13-01'), /Not a real calendar date/);
  assert.throws(() => toISODate('2026-1-5'), /YYYY-MM-DD/);
  assert.throws(() => toISODate(new Date('nope')), /Invalid Date/);
});

test('invalid arguments throw clear errors', () => {
  assert.throws(() => addBusinessDays('2026-11-16', 1.5, 'DL'), /integer/);
  assert.throws(() => countWorkingDays('2026-11-20', '2026-11-16', 'DL'), /must not be after/);
  assert.throws(() => getHolidays(2026, { state: 'GJ' }), /no curated data yet/);
  assert.throws(() => getHolidays(2025), /no data for 2025/);
  // Running off the end of the data throws instead of silently treating 2028 as all working days.
  assert.throws(() => nextWorkingDay('2027-12-31', 'DL'), /no data for 2028/);
});

test('isStateCode and STATES cover all 36 states and union territories', async () => {
  const { STATES, isStateCode } = await import('../src/index.ts');
  assert.equal(Object.keys(STATES).length, 36);
  assert.equal(isStateCode('MH'), true);
  assert.equal(isStateCode('mh'), false);
  assert.equal(isStateCode('toString'), false); // not fooled by Object.prototype keys
});
