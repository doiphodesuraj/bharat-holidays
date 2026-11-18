# bharat-holidays

Indian public holidays, festivals and **state-wise bank holidays**, plus bank business-day maths. TypeScript, zero dependencies, ~7 kB.

```bash
npm install bharat-holidays
```

> **Status: 0.4.** 2026 bank holidays are **verified against the official RBI holiday matrix** for all six states. 2027 bank holidays are **provisional**: the RBI hadn't published its 2027 list as of 16 Nov 2026. Entries whose date may still move are flagged `tentative: true`.

## Usage

```ts
import {
  isBankHoliday,
  getBankClosureReason,
  nextWorkingDay,
  addBusinessDays,
  getHolidays,
  upcomingHolidays,
} from 'bharat-holidays';

isBankHoliday('2026-02-19', 'MH');        // true  – Chhatrapati Shivaji Maharaj Jayanti
isBankHoliday('2026-02-19', 'KA');        // false
isBankHoliday('2026-11-14', 'DL');        // true  – 2nd Saturday

getBankClosureReason('2026-11-28', 'DL'); // { kind: 'fourth-saturday' }

nextWorkingDay('2026-12-24', 'KA');       // '2026-12-28' (Christmas, 4th Sat, Sunday skipped)
addBusinessDays('2026-11-16', 5, 'DL');   // '2026-11-21'

getHolidays(2026, { state: 'WB', bankOnly: true });
getHolidays(2026, { type: 'national' });
upcomingHolidays({ state: 'TN', limit: 3 });
```

### Dates and time zones

Pass dates as **`YYYY-MM-DD` strings** where you can. They're used exactly as given, on any server. Functions always return `YYYY-MM-DD` strings.

You can also pass a `Date`. A `Date` is a moment in time, and Indian banks open or close by the **date in India**, so the library converts it to the calendar date in IST (UTC+05:30, no daylight saving), whatever time zone your code runs in:

```ts
const d = new Date('2026-03-04T00:30:00+05:30'); // 00:30 in India on Holi

d.toISOString().slice(0, 10);  // '2026-03-03'  ← UTC date, the wrong day for India
isBankHoliday(d, 'DL');        // true          ← checked as 4 March, also on a UTC server
```

To get "today in India" as a string yourself:

```ts
new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()); // 'YYYY-MM-DD'
```

### State codes are checked by TypeScript

Functions that take a state accept `SupportedStateCode`, the six states with data (`'DL' | 'KA' | 'KL' | 'MH' | 'TN' | 'WB'`). A state without data is a compile error, not a runtime surprise:

```ts
isBankHoliday('2026-03-04', 'GJ');
//                          ~~~~ error TS2345: Argument of type '"GJ"' is not assignable to
//                               parameter of type '"DL" | "KA" | "KL" | "MH" | "TN" | "WB"'.
```

For a code that comes from user input, narrow it first with `isSupportedState(code)`. JavaScript callers still get a clear `RangeError` at runtime.

## API

| Function | Returns |
|---|---|
| `getHolidays(year, query?)` | `Holiday[]` for the year |
| `getHolidaysOn(date, query?)` | `Holiday[]` on that date (several can share a day) |
| `isHoliday(date, query?)` | `boolean` |
| `isBankHoliday(date, state)` | `boolean`: Sundays, 2nd and 4th Saturdays, and NI Act holidays |
| `getBankClosureReason(date, state)` | `{ kind: 'sunday' \| 'second-saturday' \| 'fourth-saturday' \| 'holiday', ... }` or `null` |
| `isWorkingDay(date, state)` | `boolean` |
| `nextWorkingDay(date, state)` / `previousWorkingDay(date, state)` | ISO date |
| `addBusinessDays(date, n, state)` | ISO date (`n` may be negative) |
| `countWorkingDays(from, to, state)` | Working days in the inclusive range |
| `upcomingHolidays({ from?, limit?, ...query })` | Next `Holiday[]` |

`query` is `{ state?, type?, bankOnly? }`. `type` is one of, or an array of, `'national' | 'gazetted' | 'restricted' | 'festival' | 'regional' | 'bank-closing'`.

```ts
interface Holiday {
  date: string;              // '2026-10-20'
  name: string;              // 'Dussehra (Vijaya Dashami)'
  localName?: string;        // 'दशहरा'
  types: HolidayType[];
  states: 'ALL' | StateCode[];   // where it's a public holiday
  bank?: 'ALL' | StateCode[];    // where banks are closed
  tentative: boolean;
  source: string;
}
```

## Coverage

| Year | Central holiday dates | Bank holidays by state |
|---|---|---|
| 2026 | ✅ DoPT O.M. dated 3 Jul 2025 (17 gazetted). Bakrid stored on 28 May, the day it was actually observed | ✅ **Verified**: matches the RBI holiday matrix exactly for Mumbai, New Delhi, Bengaluru, Chennai, Kochi and Kolkata (checked by a test) |
| 2027 | ✅ DoPT O.M. dated 16 Jul 2026 (17 gazetted, 32 restricted) | ⚠️ **Provisional**: inferred from the RBI 2026 pattern. Update when the RBI publishes 2027 |

- `bank` follows the RBI's own convention: holidays that fall on a Sunday aren't listed (banks are shut anyway), so `getBankClosureReason` returns `sunday` for them.
- City-only closures aren't modelled. For example, Thiruvananthapuram also closed on 3 Mar 2026 for Attukal Pongala.
- **States with curated data:** Delhi (DL), Karnataka (KA), Kerala (KL), Maharashtra (MH), Tamil Nadu (TN), West Bengal (WB)
- `STATES` exports ISO 3166-2:IN codes for every state and union territory (`StateCode`). `SUPPORTED_STATES` and the `SupportedStateCode` type list the ones with data.

The library **throws instead of guessing**. A year or state without data raises a `RangeError`, so you never get a silent `false` for a day banks are actually closed.

## Contributing data

Holiday data lives in `src/data/<year>.ts`, one entry per holiday per date. Every entry needs a `source`. Bank holidays come from the [RBI holiday matrix](https://www.rbi.org.in/Scripts/HolidayMatrixDisplay.aspx): pick the regional office and "All Months". When the RBI publishes a new year, add its list to a `test/rbi-<year>.test.ts` like the 2026 one, so the data is checked against it automatically. Run `npm test` before you open it: it type-checks the code and tests, checks that dates are sorted and state codes are valid, and runs the date tests under several server time zones.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT
