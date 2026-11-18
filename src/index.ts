import { holidays2026 } from './data/2026.ts';
import { holidays2027 } from './data/2027.ts';
import { addDays, dayOfMonth, dayOfWeek, toISODate, yearOf } from './date.ts';
import { STATES, SUPPORTED_STATES, isSupportedState, type SupportedStateCode } from './states.ts';
import type { BankClosureReason, DateInput, Holiday, HolidayQuery, HolidayType, StateScope } from './types.ts';

export { STATES, SUPPORTED_STATES, isStateCode, isSupportedState } from './states.ts';
export type { StateCode, SupportedStateCode } from './states.ts';
export type { BankClosureReason, DateInput, Holiday, HolidayQuery, HolidayType, StateScope } from './types.ts';
export { toISODate } from './date.ts';

const DATA: Readonly<Record<number, readonly Holiday[]>> = {
  2026: holidays2026,
  2027: holidays2027,
};

/** Years with curated data. Calls for any other year throw instead of guessing. */
export const SUPPORTED_YEARS: readonly number[] = Object.keys(DATA).map(Number).sort((a, b) => a - b);

function dataFor(year: number): readonly Holiday[] {
  const list = DATA[year];
  if (!list) {
    throw new RangeError(
      `bharat-holidays has no data for ${year}. Supported years: ${SUPPORTED_YEARS.join(', ')}.`,
    );
  }
  return list;
}

// Still checked at runtime for JavaScript callers and values that bypass the types.
function assertSupportedState(state: string): asserts state is SupportedStateCode {
  if (!isSupportedState(state)) {
    const known = Object.prototype.hasOwnProperty.call(STATES, state);
    throw new RangeError(
      `${known ? `State "${state}" has no curated data yet` : `Unknown state code "${state}"`}. ` +
        `Supported: ${SUPPORTED_STATES.join(', ')}.`,
    );
  }
}

function inScope(scope: StateScope | undefined, state: SupportedStateCode): boolean {
  if (!scope) return false;
  return scope === 'ALL' || scope.includes(state);
}

function isEmptyScope(scope: StateScope | undefined): boolean {
  return !scope || (scope !== 'ALL' && scope.length === 0);
}

function matches(h: Holiday, q: HolidayQuery): boolean {
  // Festivals that are not an official holiday anywhere (states: []) show up for every state.
  if (q.state && !inScope(h.states, q.state) && !isEmptyScope(h.states)) return false;
  if (q.bankOnly && (q.state ? !inScope(h.bank, q.state) : isEmptyScope(h.bank))) return false;
  if (q.type) {
    const wanted: readonly HolidayType[] = typeof q.type === 'string' ? [q.type] : q.type;
    if (!h.types.some((t) => wanted.includes(t))) return false;
  }
  return true;
}

function validateQuery(q: HolidayQuery): void {
  if (q.state) assertSupportedState(q.state);
}

/** All holidays in `year` matching the query, sorted by date. */
export function getHolidays(year: number, query: HolidayQuery = {}): Holiday[] {
  validateQuery(query);
  return dataFor(year).filter((h) => matches(h, query));
}

/** Holidays falling on `date` (several can share a day). */
export function getHolidaysOn(date: DateInput, query: HolidayQuery = {}): Holiday[] {
  const iso = toISODate(date);
  return getHolidays(yearOf(iso), query).filter((h) => h.date === iso);
}

/** `true` if at least one holiday matching the query falls on `date`. */
export function isHoliday(date: DateInput, query: HolidayQuery = {}): boolean {
  return getHolidaysOn(date, query).length > 0;
}

/**
 * Why banks in `state` are closed on `date`, or `null` if they are open.
 * Covers Sundays, 2nd and 4th Saturdays (RBI rule since Sept 2015) and NI Act holidays.
 */
export function getBankClosureReason(date: DateInput, state: SupportedStateCode): BankClosureReason | null {
  assertSupportedState(state);
  const iso = toISODate(date);
  const holidays = dataFor(yearOf(iso)).filter((h) => h.date === iso && inScope(h.bank, state));
  if (holidays.length > 0) return { kind: 'holiday', holidays };
  const dow = dayOfWeek(iso);
  if (dow === 0) return { kind: 'sunday' };
  if (dow === 6) {
    const dom = dayOfMonth(iso);
    if (dom >= 8 && dom <= 14) return { kind: 'second-saturday' };
    if (dom >= 22 && dom <= 28) return { kind: 'fourth-saturday' };
  }
  return null;
}

/** `true` if banks in `state` are closed on `date`. */
export function isBankHoliday(date: DateInput, state: SupportedStateCode): boolean {
  return getBankClosureReason(date, state) !== null;
}

/** `true` if banks in `state` are open on `date`. */
export function isWorkingDay(date: DateInput, state: SupportedStateCode): boolean {
  return !isBankHoliday(date, state);
}

function step(date: DateInput, state: SupportedStateCode, dir: 1 | -1): string {
  let iso = toISODate(date);
  do {
    iso = addDays(iso, dir);
  } while (isBankHoliday(iso, state));
  return iso;
}

/** First bank working day strictly after `date`. */
export function nextWorkingDay(date: DateInput, state: SupportedStateCode): string {
  return step(date, state, 1);
}

/** Last bank working day strictly before `date`. */
export function previousWorkingDay(date: DateInput, state: SupportedStateCode): string {
  return step(date, state, -1);
}

/**
 * Moves `days` bank working days from `date` (negative goes backwards).
 * `addBusinessDays(d, 0, s)` returns `d` itself if it's a working day, else the next one.
 */
export function addBusinessDays(date: DateInput, days: number, state: SupportedStateCode): string {
  if (!Number.isInteger(days)) throw new TypeError('days must be an integer');
  const start = toISODate(date);
  if (days === 0) return isWorkingDay(start, state) ? start : nextWorkingDay(start, state);
  const dir = days > 0 ? 1 : -1;
  let iso = start;
  for (let i = 0; i < Math.abs(days); i++) iso = step(iso, state, dir);
  return iso;
}

/** Bank working days in the inclusive range `from`…`to`. */
export function countWorkingDays(from: DateInput, to: DateInput, state: SupportedStateCode): number {
  let iso = toISODate(from);
  const end = toISODate(to);
  if (iso > end) throw new RangeError('`from` must not be after `to`');
  let count = 0;
  for (; iso <= end; iso = addDays(iso, 1)) if (isWorkingDay(iso, state)) count++;
  return count;
}

/** Next holidays on or after `from` (default: today), across all supported years. */
export function upcomingHolidays(
  query: HolidayQuery & { from?: DateInput; limit?: number } = {},
): Holiday[] {
  const { from = new Date(), limit = 5, ...q } = query;
  const start = toISODate(from);
  const out: Holiday[] = [];
  for (const year of SUPPORTED_YEARS) {
    if (year < yearOf(start)) continue;
    for (const h of getHolidays(year, q)) {
      if (out.length >= limit) return out;
      if (h.date >= start) out.push(h);
    }
  }
  return out;
}
