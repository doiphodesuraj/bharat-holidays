import type { StateCode } from './states.ts';

export type HolidayType =
  /** National holidays: Republic Day, Independence Day, Gandhi Jayanti. */
  | 'national'
  /** Compulsory Central Government (gazetted) holiday. */
  | 'gazetted'
  /** Restricted / optional holiday. */
  | 'restricted'
  /** Festival day (may or may not be an official holiday). */
  | 'festival'
  /** State-specific public holiday (including polling days). */
  | 'regional'
  /** Banks closed to the public only, e.g. 1 April annual closing of accounts. */
  | 'bank-closing';

/** `'ALL'` means every state/UT, or every supported state for bank data. */
export type StateScope = 'ALL' | readonly StateCode[];

export interface Holiday {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  name: string;
  /** Name in Hindi or the main regional language, when useful. */
  localName?: string;
  types: readonly HolidayType[];
  /** Where it's an official public holiday. */
  states: StateScope;
  /**
   * States where the RBI lists this day as a Negotiable Instruments Act holiday.
   * The RBI leaves out holidays that fall on a Sunday (banks are shut anyway), so
   * a holiday on a Sunday has no `bank` field. Omitted = not a bank holiday.
   */
  bank?: StateScope;
  /** `true` when the date depends on moon sighting or isn't officially notified yet. */
  tentative: boolean;
  /** Where the entry comes from. */
  source: string;
}

export type DateInput = string | Date;

export interface HolidayQuery {
  /** Only holidays observed in this state (all-India ones are always included). */
  state?: StateCode;
  /** Only holidays carrying at least one of these types. */
  type?: HolidayType | readonly HolidayType[];
  /** Only holidays that are bank holidays (in `state`, if given). */
  bankOnly?: boolean;
}

export type BankClosureReason =
  | { kind: 'sunday' }
  | { kind: 'second-saturday' }
  | { kind: 'fourth-saturday' }
  | { kind: 'holiday'; holidays: Holiday[] };
