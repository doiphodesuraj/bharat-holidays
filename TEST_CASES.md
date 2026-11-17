# bharat-holidays: test cases

**Run:** `npm test`, or `npm test -- --experimental-test-coverage` for coverage.
**Last result:** 37 / 37 passed · Node 24.21, Windows 11 · 16 Nov 2026 (v0.3.0)

| Suite | File | Tests |
|---|---|---|
| A. Data integrity | `test/index.test.ts`, `test/edge-cases.test.ts` | 5 |
| B. Bank holiday rules | both | 8 |
| C. Working-day maths | both | 7 |
| D. Holiday queries | both | 6 |
| E. Input validation and errors | both | 5 |
| **G. Official RBI 2026 match** | `test/rbi-2026.test.ts` | 6 |
| F. Package install check (manual) | outside the repo | 4 checks |

---

## A. Data integrity: is the holiday data itself well-formed?

| ID | Test case | Input / method | Expected | Result |
|---|---|---|---|---|
| A1 | 2026 dataset is valid | Every 2026 entry | Sorted by date, real calendar dates, at least one type, non-empty `source`, only known state codes | ✅ |
| A2 | 2027 dataset is valid | Every 2027 entry | Same as A1 | ✅ |
| A3 | 2027 weekdays match DoPT | Weekday of each of the 17 gazetted dates, compared with the weekday printed in the DoPT O.M. (16 Jul 2026) | All 17 match, which catches date typos against an independent source | ✅ |
| A4 | Only moon-sighting dates are tentative | 2027 gazetted entries with `tentative: true` | Exactly Id-ul-Fitr, Id-ul-Zuha, Muharram, Milad-un-Nabi (DoPT para 5.1) | ✅ |
| A5 | State code table is complete | `STATES`, `isStateCode()` | 36 states and UTs; `'MH'` valid; `'mh'` and `'toString'` rejected | ✅ |

## B. Bank holiday rules: are banks open or closed on the right days?

| ID | Test case | Input | Expected | Result |
|---|---|---|---|---|
| B1 | National holidays close banks everywhere | 26 Jan, 15 Aug, 2 Oct 2026 × all 6 states | `true` | ✅ |
| B2 | State holidays stay in their state | Shivaji Jayanti 19 Feb 2026: MH vs KA. Kannada Rajyotsava 1 Nov: KA vs TN | MH `true`, KA `false`; KA `true`, TN `false` | ✅ |
| B3 | Weekend rule, sample days | 15 Nov 2026 Sun · 14 Nov 2nd Sat · 28 Nov 4th Sat · 21 Nov 3rd Sat · 7 Nov 1st Sat | `sunday`, `second-saturday`, `fourth-saturday`, open, open | ✅ |
| B4 | Weekend rule, every day of 2026–27 | All 730 days × 6 states, checked with a separate calculation | Every Sunday and every 2nd/4th Saturday closed | ✅ |
| B5 | 1st, 3rd and 5th Saturdays | All such Saturdays × 6 states | Open, unless a holiday falls on them | ✅ |
| B6 | Holiday on an open Saturday | Id-ul-Fitr 21 Mar 2026 (3rd Sat), MH | Closed, reason `holiday` | ✅ |
| B7 | Holiday on a closed Saturday or a Sunday | Mahalaya 10 Oct 2026 (2nd Sat), WB; Diwali 8 Nov 2026 (Sun), DL | Mahalaya reason names the holiday; Diwali reason is `sunday`, because the RBI omits Sunday holidays | ✅ |
| B8 | 2027 state rules | Diwali 29 Oct TN · Gudi Padwa 7 Apr MH vs DL · Ganesh Chaturthi 4 Sep MH vs KL | closed · closed / open · closed / open | ✅ |

## C. Working-day maths: next, previous, add, count

| ID | Test case | Input | Expected | Result |
|---|---|---|---|---|
| C1 | Skip a holiday plus a weekend | `nextWorkingDay('2026-12-24','KA')`: Christmas, 4th Sat, Sun | `2026-12-28`; going back gives `2026-12-24` | ✅ |
| C2 | Day after a holiday can be open | `nextWorkingDay('2026-10-01','MH')`: Gandhi Jayanti, then 1st Sat | `2026-10-03` | ✅ |
| C3 | Add business days both ways | +5 from Mon 16 Nov 2026 DL; −5 back; +0 from a Sunday | `2026-11-21`; `2026-11-16`; `2026-11-16` | ✅ |
| C4 | Next/previous always lands on an open day | Every 3rd day of 2026 × 6 states | Result is strictly after/before the input and is a working day | ✅ |
| C5 | Add then subtract returns to the start | Every 5th working day × n = 1, 3, 10, 20 × 6 states | `add(add(d, n), −n) = d`, and `countWorkingDays` = n + 1 | ✅ |
| C6 | Full-year count is plausible | 1 Jan to 31 Dec 2026, each state | Equals days minus closures, between 260 and 285 | ✅ |
| C7 | Across the year boundary | 31 Dec 2026 → next; +5 from 24 Dec 2026 KA; Durga Puja 2027 WB | `2027-01-01`; `2027-01-01`; 5 Oct → `2027-10-11` | ✅ |

**Working days per year** (from C6, for reference):

| State | 2026 | 2027 |
|---|---|---|
| DL | 273 | 277 |
| KA | 267 | 271 |
| KL | 266 | 275 |
| MH | 267 | 270 |
| TN | 266 | 271 |
| WB | 263 | 267 |

2026 figures are from verified RBI data. 2027 figures are provisional.

## D. Holiday queries

| ID | Test case | Input | Expected | Result |
|---|---|---|---|---|
| D1 | Filter by type | `getHolidays(2026, {type:'national'})` | Exactly Republic Day, Independence Day, Gandhi Jayanti | ✅ |
| D2 | Several types plus a state | `{state:'MH', type:['national','regional']}` | Includes Maharashtra Day, excludes Kannada Rajyotsava | ✅ |
| D3 | Bank-only vs calendar view | KL 2026 with `bankOnly` vs without | Onam in both; Raksha Bandhan only in the calendar view | ✅ |
| D4 | Several holidays on one day | 1 May 2026, MH | Buddha Purnima and Maharashtra Day | ✅ |
| D5 | Results consistent | Every year × state | Sorted, and every bank-only result is in the full list | ✅ |
| D6 | Upcoming holidays | From 16 Nov 2026 DL; from 20 Dec 2026 MH; `limit: 0`; after the end of the data | `24 Nov, 25 Dec`; `25 Dec 2026, 26 Jan 2027`; `[]`; `[]` | ✅ (found bug 1) |

## E. Input validation: does it refuse to guess?

| ID | Test case | Input | Expected | Result |
|---|---|---|---|---|
| E1 | Unsupported year | `2025`, `2028`; `nextWorkingDay('2027-12-31')` | `RangeError: no data for …`, never a silent "open" | ✅ |
| E2 | Unsupported or unknown state | `'GJ'` (real, no data yet), `'XX'` | "no curated data yet" / "Unknown state code" | ✅ |
| E3 | Bad date strings | `'26-01-2026'`, `'2026-1-5'`, `'2026-02-30'`, `'2027-02-29'`, `'2026-13-01'` | Format or "Not a real calendar date" error | ✅ |
| E4 | Valid edge dates | `'2028-02-29'` (leap day); `new Date(2027,11,31,23,59)` | Accepted; read as `2027-12-31` in local time | ✅ |
| E5 | Bad arguments | `addBusinessDays(…, 1.5)`; `countWorkingDays` with from > to; `new Date('nope')` | Clear `TypeError` / `RangeError` | ✅ |

## G. Official RBI 2026 match: is the bank data actually correct?

The official lists were read from the [RBI holiday matrix](https://www.rbi.org.in/Scripts/HolidayMatrixDisplay.aspx) on 16 Nov 2026 (year 2026, all months, one regional office at a time) and copied into `test/rbi-2026.test.ts`. Each test compares every bank-holiday date in the library with the RBI list, in both directions: nothing missing, nothing extra.

| ID | State | RBI office | RBI dates | Result |
|---|---|---|---|---|
| G1 | Maharashtra | Mumbai | 22 | ✅ exact match |
| G2 | Delhi | New Delhi | 16 | ✅ exact match |
| G3 | Karnataka | Bengaluru | 23 | ✅ exact match |
| G4 | Tamil Nadu | Chennai | 23 | ✅ exact match |
| G5 | Kerala | Kochi (Thiruvananthapuram identical except 3 Mar) | 23 | ✅ exact match |
| G6 | West Bengal | Kolkata | 28 | ✅ exact match |

The 17 gazetted dates were also checked against two official CGEWCC copies of the DoPT 2026 order (Uttarakhand and Chennai). All 17 matched.

## F. Package install check (manual, run once before publishing)

The built package was packed with `npm pack`, installed into an empty project as a real dependency, and used from there.

| ID | Check | Result |
|---|---|---|
| F1 | ESM `import` from `bharat-holidays` | ✅ `isBankHoliday('2027-10-29','MH')` → `true` |
| F2 | CommonJS `require()` (Node ≥ 22) | ✅ works |
| F3 | TypeScript: types resolve, `Holiday`/`StateCode` usable, invalid state `'ZZ'` is a compile error | ✅ |
| F4 | Tarball contents | ✅ only `dist/`, `README.md`, `LICENSE`, `package.json` (15 files, no tests or sources) |

---

## Bugs found by testing

| # | Bug | Found by | Fix |
|---|---|---|---|
| 1 | `upcomingHolidays({ limit: 0 })` returned 1 holiday instead of none, because the limit was checked after adding an item | D6 | Check the limit before adding. Fixed in `src/index.ts` |

## Data corrections from the RBI check (v0.3.0)

The first version of the 2026 bank data was written from memory. Checking it against the RBI found these errors, all now fixed:

| Kind | Corrections |
|---|---|
| **Wrong date** | Bakrid 27→**28 May** (moon sighting) · Makara Sankranti (KA) 14→**15 Jan** · Holi (MH) 4→**3 Mar** · Mahavir Jayanti (KA) 31→**30 Mar** · Id-ul-Fitr (KL) **20 Mar**, not 21 · Durga Puja (WB) is **19–21 Oct**, not 17–20 |
| **Wrong states** | Janmashtami is a bank holiday in **KL, TN, WB**, not DL/MH · Ram Navami: **MH, WB**, not DL · Ambedkar Jayanti also in **KL** · Milad-un-Nabi not in **WB** · Mahavir Jayanti not in **KL** · Maha Navami/Ayudha Puja (19 Oct) is **KL, TN, WB**, not KA · Ugadi also in **TN** |
| **Missing holidays (24)** | 1 Apr annual account closing (all states) · state election days (MH 15 Jan, KL 9 Apr, TN 23 Apr, WB 29 Apr) · New Year (TN, WB) · Vivekananda Jayanti, Tagore Jayanti, S.P. Mookerjee Jayanti, Bhai Phonta (WB) · Uzhavar Thirunal (TN) · Basava Jayanti, Valmiki Jayanti, Bali Pratipada, Kanakadasa Jayanti (KA) · Bali Pratipada (MH) · Maundy Thursday, First Onam, Sree Narayana Guru Jayanti and Samadhi, second Bakrid day (KL) · Mahalaya (KA, WB) · Vijaya Dashami 21 Oct (KA, KL, WB) |
| **Removed** | Bank flags on holidays falling on a Sunday (Diwali, Kannada Rajyotsava, Maha Shivaratri), because the RBI doesn't list them · WB bank closure on 17 Oct (a 3rd Saturday, banks open) |

## What these tests do **not** prove

- **2027 bank holidays.** The RBI hadn't published 2027 as of 16 Nov 2026. 2027 bank states are inferred from the 2026 pattern and must be re-checked; adding a `test/rbi-2027.test.ts` will do that.
- **City-level closures** (e.g. Attukal Pongala in Thiruvananthapuram only) aren't modelled.
- **Islamic holiday dates for 2027** can still move by a day after moon sighting. They are flagged `tentative`.
- **Browsers** weren't tested. The code uses only standard `Date`, so it should work, but it hasn't been checked.
