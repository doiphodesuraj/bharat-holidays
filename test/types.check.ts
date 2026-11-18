/*
 * Compile-time checks. This file is never run: `npm test` type-checks it with
 * `tsc -p tsconfig.test.json`, and the build fails if any line marked
 * `@ts-expect-error` stops being an error (or any other line becomes one).
 */
import {
  getHolidays,
  isBankHoliday,
  isSupportedState,
  nextWorkingDay,
  type StateCode,
  type SupportedStateCode,
} from '../src/index.ts';

// Supported states compile.
isBankHoliday('2026-03-04', 'DL');
nextWorkingDay('2026-03-04', 'WB');
getHolidays(2026, { state: 'KL', bankOnly: true });

// @ts-expect-error  Gujarat is a real state, but has no bank data yet: rejected at compile time.
isBankHoliday('2026-03-04', 'GJ');

// @ts-expect-error  Unknown codes are rejected too.
nextWorkingDay('2026-03-04', 'XX');

// @ts-expect-error  Same for the state filter in queries.
getHolidays(2026, { state: 'GJ' });

// A general StateCode (e.g. from user input) must be narrowed before use.
declare const fromUser: StateCode;
// @ts-expect-error  Not every StateCode is supported.
isBankHoliday('2026-03-04', fromUser);
if (isSupportedState(fromUser)) {
  isBankHoliday('2026-03-04', fromUser); // OK after narrowing
}

// The supported union is exactly the six curated states.
const all: SupportedStateCode[] = ['DL', 'KA', 'KL', 'MH', 'TN', 'WB'];
void all;
