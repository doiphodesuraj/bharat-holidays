import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getHolidays, type SupportedStateCode } from '../src/index.ts';

/*
 * Official RBI 2026 NI Act holiday lists, copied on 16 Nov 2026 from
 * https://www.rbi.org.in/Scripts/HolidayMatrixDisplay.aspx (Year 2026, All Months).
 * MM-DD. The RBI omits holidays falling on Sundays.
 * KL = Kochi regional office (Thiruvananthapuram is identical except 03-03 Attukal Pongala).
 */
// Typed as Record<SupportedStateCode, …>: adding a state to the library without adding
// its RBI list here becomes a compile error.
const RBI_2026: Record<SupportedStateCode, string[]> = {
  MH: ['01-15', '01-26', '02-19', '03-03', '03-19', '03-21', '03-26', '03-31', '04-01', '04-03', '04-14', '05-01', '05-28', '06-26', '08-15', '08-26', '09-14', '10-02', '10-20', '11-10', '11-24', '12-25'],
  DL: ['01-26', '03-04', '03-21', '03-31', '04-01', '04-03', '04-14', '05-01', '05-28', '06-26', '08-15', '08-26', '10-02', '10-20', '11-24', '12-25'],
  KA: ['01-15', '01-26', '03-19', '03-21', '03-30', '04-01', '04-03', '04-14', '04-20', '05-01', '05-28', '06-26', '08-15', '08-26', '09-14', '10-02', '10-10', '10-20', '10-21', '10-26', '11-10', '11-27', '12-25'],
  TN: ['01-01', '01-15', '01-16', '01-17', '01-26', '03-19', '03-21', '03-31', '04-01', '04-03', '04-14', '04-23', '05-01', '05-28', '06-26', '08-15', '08-26', '09-04', '09-14', '10-02', '10-19', '10-20', '12-25'],
  KL: ['01-02', '01-26', '03-20', '04-01', '04-02', '04-03', '04-09', '04-14', '04-15', '05-01', '05-27', '05-28', '08-15', '08-25', '08-26', '08-28', '09-04', '09-21', '10-02', '10-19', '10-20', '10-21', '12-25'],
  WB: ['01-01', '01-12', '01-23', '01-26', '03-03', '03-21', '03-26', '03-31', '04-01', '04-03', '04-14', '04-15', '04-29', '05-01', '05-09', '05-28', '06-26', '07-06', '08-15', '09-04', '10-02', '10-10', '10-19', '10-20', '10-21', '11-11', '11-24', '12-25'],
};

for (const [state, expected] of Object.entries(RBI_2026) as [SupportedStateCode, string[]][]) {
  test(`2026 bank holidays in ${state} match the official RBI list exactly`, () => {
    const ours = [...new Set(getHolidays(2026, { state, bankOnly: true }).map((h) => h.date.slice(5)))];
    const missing = expected.filter((d) => !ours.includes(d));
    const extra = ours.filter((d) => !expected.includes(d));
    assert.deepEqual({ missing, extra }, { missing: [], extra: [] });
  });
}
