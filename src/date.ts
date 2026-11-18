import type { DateInput } from './types.ts';

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** India Standard Time is UTC+05:30 all year (no daylight saving). */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * Normalises input to `YYYY-MM-DD`.
 *
 * - Strings must be ISO dates and are used as-is. This is the recommended input.
 * - `Date` objects are an instant in time, so they are converted to the calendar date
 *   **in India (IST)** at that instant, whatever time zone the code runs in. Banks in
 *   India open or close by Indian date, so 00:30 IST on 4 March is 4 March even on a
 *   UTC server, where `toISOString()` would say 3 March.
 */
export function toISODate(input: DateInput): string {
  if (input instanceof Date) {
    const t = input.getTime();
    if (Number.isNaN(t)) throw new TypeError('Invalid Date');
    const ist = new Date(t + IST_OFFSET_MS);
    return format(ist.getUTCFullYear(), ist.getUTCMonth() + 1, ist.getUTCDate());
  }
  if (typeof input !== 'string') throw new TypeError(`Expected a YYYY-MM-DD string or a Date, got ${typeof input}`);
  const m = ISO.exec(input);
  if (!m) throw new TypeError(`Expected a YYYY-MM-DD string, got "${input}"`);
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const check = new Date(Date.UTC(y, mo - 1, d));
  if (check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) {
    throw new RangeError(`Not a real calendar date: "${input}"`);
  }
  return input;
}

function format(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parts(iso: string): [number, number, number] {
  return [Number(iso.slice(0, 4)), Number(iso.slice(5, 7)), Number(iso.slice(8, 10))];
}

export function yearOf(iso: string): number {
  return Number(iso.slice(0, 4));
}

/** 0 = Sunday … 6 = Saturday. */
export function dayOfWeek(iso: string): number {
  const [y, m, d] = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function dayOfMonth(iso: string): number {
  return Number(iso.slice(8, 10));
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = parts(iso);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return format(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}
