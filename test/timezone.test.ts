import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { getHolidaysOn, isBankHoliday, nextWorkingDay, toISODate } from '../src/index.ts';

/*
 * A Date is an instant. Whether Indian banks are open depends on the date in India (IST,
 * UTC+05:30, no DST) at that instant, so results must be identical whatever time zone
 * the code runs in. Each case below is run under these server time zones:
 */
const SERVER_ZONES = [
  'UTC', // most cloud servers
  'Asia/Kolkata', // India
  'America/New_York', // behind UTC, with DST
  'Europe/Berlin', // ahead of UTC, with DST
  'Pacific/Kiritimati', // UTC+14, furthest ahead
  'Pacific/Pago_Pago', // UTC−11, furthest behind
];

const originalTZ = process.env.TZ;
after(() => {
  if (originalTZ === undefined) delete process.env.TZ;
  else process.env.TZ = originalTZ;
});

for (const zone of SERVER_ZONES) {
  test(`Date inputs resolve to the IST calendar date on a ${zone} server`, () => {
    process.env.TZ = zone;

    // The commenter's case: 00:30 IST on Holi (Wed 4 Mar 2026), a Delhi bank holiday.
    const holiNight = new Date('2026-03-04T00:30:00+05:30');
    assert.equal(toISODate(holiNight), '2026-03-04');
    assert.equal(isBankHoliday(holiNight, 'DL'), true);

    // Exact midnight boundary in IST: 18:29:59.999Z is still 3 March, 18:30:00Z is 4 March.
    assert.equal(toISODate(new Date('2026-03-03T18:29:59.999Z')), '2026-03-03');
    assert.equal(toISODate(new Date('2026-03-03T18:30:00.000Z')), '2026-03-04');
    assert.equal(isBankHoliday(new Date('2026-03-03T18:29:59.999Z'), 'DL'), false); // Tue 3 Mar, open in Delhi

    // Late evening in IST stays the same day: 23:59 IST on 31 Dec 2027.
    assert.equal(toISODate(new Date('2027-12-31T23:59:00+05:30')), '2027-12-31');

    // Year boundary: 00:00 IST on 1 Jan 2027 is still 31 Dec 2026 in UTC.
    assert.equal(toISODate(new Date('2027-01-01T00:00:00+05:30')), '2027-01-01');

    // Results built from Dates match results built from strings.
    assert.deepEqual(getHolidaysOn(new Date('2026-10-20T09:00:00+05:30'), { state: 'WB' }), getHolidaysOn('2026-10-20', { state: 'WB' }));
    assert.equal(nextWorkingDay(new Date('2026-12-24T23:00:00+05:30'), 'KA'), '2026-12-28');
  });
}

test('date strings are never shifted by the server time zone', () => {
  for (const zone of SERVER_ZONES) {
    process.env.TZ = zone;
    assert.equal(toISODate('2026-03-04'), '2026-03-04', zone);
    assert.equal(isBankHoliday('2026-03-04', 'DL'), true, zone);
  }
});
