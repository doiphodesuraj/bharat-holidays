/** ISO 3166-2:IN codes (without the `IN-` prefix) for all states and union territories. */
export const STATES = {
  AN: 'Andaman and Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CH: 'Chandigarh',
  CT: 'Chhattisgarh',
  DH: 'Dadra and Nagar Haveli and Daman and Diu',
  DL: 'Delhi',
  GA: 'Goa',
  GJ: 'Gujarat',
  HP: 'Himachal Pradesh',
  HR: 'Haryana',
  JH: 'Jharkhand',
  JK: 'Jammu and Kashmir',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MH: 'Maharashtra',
  ML: 'Meghalaya',
  MN: 'Manipur',
  MP: 'Madhya Pradesh',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PB: 'Punjab',
  PY: 'Puducherry',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TG: 'Telangana',
  TN: 'Tamil Nadu',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UT: 'Uttarakhand',
  WB: 'West Bengal',
} as const;

export type StateCode = keyof typeof STATES;

/** States whose state-wise holiday and bank holiday data is curated in this release. */
export const SUPPORTED_STATES = ['DL', 'KA', 'KL', 'MH', 'TN', 'WB'] as const satisfies readonly StateCode[];

/**
 * A state code this release has bank holiday data for. Functions that take a state use
 * this type, so passing e.g. `'GJ'` is a TypeScript error instead of a runtime one.
 * Widens automatically as states are added to `SUPPORTED_STATES`.
 */
export type SupportedStateCode = (typeof SUPPORTED_STATES)[number];

export function isSupportedState(value: string): value is SupportedStateCode {
  return (SUPPORTED_STATES as readonly string[]).includes(value);
}

export function isStateCode(value: string): value is StateCode {
  return Object.prototype.hasOwnProperty.call(STATES, value);
}
