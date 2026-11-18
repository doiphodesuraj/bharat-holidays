# Changelog

## 0.4.0 (2026-11-18)

Thanks to a reader of the Medium write-up who pointed out both issues.

### Fixed
- **`Date` inputs are now read as the calendar date in India (IST).** Before, a `Date` was read in the time zone of the machine running the code. On a UTC server, which is most cloud hosting, 00:30 IST on Holi (4 Mar 2026) was checked as 3 March, so `isBankHoliday(…, 'DL')` wrongly returned `false`. Results are now the same in every time zone. `YYYY-MM-DD` strings were never affected.

### Changed
- **State parameters are typed as `SupportedStateCode`** (`'DL' | 'KA' | 'KL' | 'MH' | 'TN' | 'WB'`) instead of all 36 `StateCode`s, so passing a state without data (e.g. `'GJ'`) is a TypeScript error. The runtime `RangeError` stays for JavaScript callers.
- `toISODate` now throws a clear `TypeError` for values that are neither a string nor a `Date`.

### Added
- `SupportedStateCode` type and `isSupportedState()` type guard.
- Tests that run the date checks under six server time zones (UTC, IST, New York, Berlin, UTC+14, UTC−11), and compile-time tests for the state types. `npm test` now type-checks the tests too.

### Upgrading
- If you pass `Date` objects created in a time zone east of India (e.g. local midnight in Japan or Australia), they may now resolve to the previous day, which is the correct date in India. Pass `YYYY-MM-DD` strings to be explicit.
- TypeScript: a variable typed as `StateCode` must be narrowed with `isSupportedState()` before calling bank functions.

## 0.3.1 (2026-11-17)
- Added `repository`, `homepage` and `bugs` links to `package.json`. No code or data changes.

## 0.3.0 (2026-11-16)
- 2026 bank holidays verified against the RBI holiday matrix for DL, KA, KL, MH, TN and WB.
- 2027 data from the DoPT order of 16 Jul 2026; 2027 bank states provisional.
- New holiday type `bank-closing` (1 April account closing).
