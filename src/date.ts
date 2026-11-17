import type { DateInput } from './types.ts';

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Normalises input to `YYYY-MM-DD`.
 * Strings must be ISO dates. `Date` objects are read in the runtime's local time zone,
 * so `new Date(2026, 0, 26)` is 26 January wherever the code runs.
 */
export function toISODate(input: DateInput): string {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) throw new TypeError('Invalid Date');
    return format(input.getFullYear(), input.getMonth() + 1, input.getDate());
  }
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
