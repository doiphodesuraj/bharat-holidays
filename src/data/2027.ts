import type { Holiday } from '../types.ts';

/*
 * 2027 holiday data.
 *
 * Dates: DoPT O.M. F.No. 12/2/2023-JCA dated 16 July 2026 (Annexure I gazetted,
 * Annexure II restricted). Per para 5 of that O.M., Id-ul-Fitr, Id-ul-Zuha, Muharram
 * and Milad-un-Nabi may move with moon sighting, so they are `tentative: true`.
 *
 * Bank holidays (`bank`): the RBI had NOT published its 2027 list as of 16 Nov 2026
 * (the RBI holiday matrix only offers years up to 2026). The states below follow the
 * pattern of the official RBI 2026 list for the same festivals. Replace them with the
 * RBI 2027 matrix once it is out. Holidays falling on a Sunday have no `bank` field,
 * matching how the RBI publishes its list.
 */

const CENTRAL = 'DoPT O.M. 12/2/2023-JCA (16 Jul 2026), Annexure I';
const RESTRICTED = 'DoPT O.M. 12/2/2023-JCA (16 Jul 2026), Annexure II';
const PATTERN = 'bank states follow RBI 2026 pattern; RBI 2027 list pending';
const BOTH = `${CENTRAL}; ${PATTERN}`;
const R_PAT = `${RESTRICTED}; ${PATTERN}`;
const STATE = `State holiday; ${PATTERN}`;

const ALL6 = 'ALL' as const;

export const holidays2027: readonly Holiday[] = [
  { date: '2027-01-01', name: "New Year's Day", types: ['restricted', 'festival', 'regional'], states: ['TN', 'WB'], bank: ['TN', 'WB'], tentative: false, source: R_PAT },
  { date: '2027-01-02', name: 'Mannam Jayanti', types: ['regional'], states: ['KL'], bank: ['KL'], tentative: false, source: STATE },
  { date: '2027-01-12', name: 'Swami Vivekananda Jayanti', types: ['regional'], states: ['WB'], bank: ['WB'], tentative: false, source: STATE },
  { date: '2027-01-14', name: 'Makar Sankranti', localName: 'मकर संक्रांति', types: ['restricted', 'festival', 'regional'], states: ['KA'], bank: ['KA'], tentative: false, source: R_PAT },
  { date: '2027-01-15', name: 'Pongal', localName: 'பொங்கல்', types: ['restricted', 'regional', 'festival'], states: ['TN'], bank: ['TN'], tentative: false, source: R_PAT },
  { date: '2027-01-16', name: 'Thiruvalluvar Day', localName: 'திருவள்ளுவர் தினம்', types: ['regional'], states: ['TN'], bank: ['TN'], tentative: true, source: STATE },
  { date: '2027-01-17', name: 'Uzhavar Thirunal', localName: 'உழவர் திருநாள்', types: ['regional'], states: ['TN'], tentative: true, source: 'Tamil Nadu (falls on a Sunday)' },
  { date: '2027-01-23', name: 'Netaji Subhas Chandra Bose Jayanti', types: ['regional'], states: ['WB'], bank: ['WB'], tentative: false, source: STATE },
  { date: '2027-01-26', name: 'Republic Day', localName: 'गणतंत्र दिवस', types: ['national', 'gazetted'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2027-02-11', name: 'Basant Panchami / Saraswati Puja', localName: 'बसंत पंचमी', types: ['restricted', 'festival', 'regional'], states: ['WB'], bank: ['WB'], tentative: false, source: R_PAT },
  { date: '2027-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti', localName: 'छत्रपती शिवाजी महाराज जयंती', types: ['restricted', 'regional'], states: ['MH'], bank: ['MH'], tentative: false, source: R_PAT },
  { date: '2027-03-06', name: 'Maha Shivaratri', localName: 'महाशिवरात्रि', types: ['restricted', 'festival', 'regional'], states: ['KA', 'KL', 'MH'], bank: ['KA', 'KL', 'MH'], tentative: false, source: R_PAT },
  { date: '2027-03-10', name: 'Id-ul-Fitr', localName: 'ईद-उल-फ़ितर', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: true, source: BOTH },
  { date: '2027-03-22', name: 'Holi (Dhulivandan) / Doljatra', localName: 'धुलिवंदन / দোলযাত্রা', types: ['restricted', 'regional', 'festival'], states: ['MH', 'WB'], bank: ['MH', 'WB'], tentative: true, source: R_PAT },
  { date: '2027-03-23', name: 'Holi', localName: 'होली', types: ['gazetted', 'festival'], states: ['DL'], bank: ['DL'], tentative: false, source: BOTH },
  { date: '2027-03-25', name: 'Maundy Thursday', types: ['regional'], states: ['KL'], bank: ['KL'], tentative: false, source: STATE },
  { date: '2027-03-26', name: 'Good Friday', types: ['gazetted'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2027-04-01', name: 'Annual closing of bank accounts', types: ['bank-closing'], states: [], bank: ALL6, tentative: false, source: PATTERN },
  { date: '2027-04-07', name: 'Gudi Padwa / Ugadi / Telugu New Year', localName: 'गुढीपाडवा / ಯುಗಾದಿ', types: ['restricted', 'regional', 'festival'], states: ['KA', 'MH', 'TN'], bank: ['KA', 'MH', 'TN'], tentative: false, source: R_PAT },
  { date: '2027-04-14', name: 'Dr. B.R. Ambedkar Jayanti', localName: 'आंबेडकर जयंती', types: ['regional'], states: ALL6, bank: ALL6, tentative: false, source: STATE },
  { date: '2027-04-14', name: 'Tamil New Year', localName: 'தமிழ்ப் புத்தாண்டு', types: ['restricted', 'regional', 'festival'], states: ['TN'], bank: ['TN'], tentative: false, source: R_PAT },
  { date: '2027-04-14', name: 'Vishu', localName: 'വിഷു', types: ['restricted', 'regional', 'festival'], states: ['KL'], bank: ['KL'], tentative: true, source: R_PAT },
  { date: '2027-04-15', name: 'Bengali New Year (Poila Boishakh)', localName: 'পয়লা বৈশাখ', types: ['restricted', 'regional', 'festival'], states: ['WB'], bank: ['WB'], tentative: false, source: R_PAT },
  { date: '2027-04-15', name: 'Ram Navami', localName: 'राम नवमी', types: ['gazetted', 'festival'], states: ['DL', 'MH', 'WB'], bank: ['MH', 'WB'], tentative: false, source: BOTH },
  { date: '2027-04-19', name: 'Mahavir Jayanti', localName: 'महावीर जयंती', types: ['gazetted'], states: ['DL', 'KA', 'MH', 'TN', 'WB'], bank: ['DL', 'KA', 'MH', 'TN', 'WB'], tentative: false, source: BOTH },
  { date: '2027-05-01', name: 'Maharashtra Day', localName: 'महाराष्ट्र दिन', types: ['regional'], states: ['MH'], bank: ['MH'], tentative: false, source: STATE },
  { date: '2027-05-01', name: 'May Day (Labour Day)', types: ['regional'], states: ['KA', 'KL', 'TN', 'WB'], bank: ['KA', 'KL', 'TN', 'WB'], tentative: false, source: STATE },
  { date: '2027-05-09', name: 'Rabindranath Tagore Jayanti', localName: 'রবীন্দ্র জয়ন্তী', types: ['restricted', 'regional'], states: ['WB'], tentative: false, source: `${RESTRICTED} (falls on a Sunday)` },
  { date: '2027-05-17', name: 'Id-ul-Zuha (Bakrid)', localName: 'ईद-उल-अज़हा', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: true, source: BOTH },
  { date: '2027-05-20', name: 'Buddha Purnima', localName: 'बुद्ध पूर्णिमा', types: ['gazetted', 'festival'], states: ['DL', 'MH', 'WB'], bank: ['DL', 'MH', 'WB'], tentative: false, source: BOTH },
  { date: '2027-06-16', name: 'Muharram', localName: 'मुहर्रम', types: ['gazetted'], states: ['DL', 'KA', 'MH', 'TN', 'WB'], bank: ['DL', 'KA', 'MH', 'TN', 'WB'], tentative: true, source: BOTH },
  { date: '2027-07-05', name: 'Rath Yatra', localName: 'रथ यात्रा', types: ['restricted', 'festival'], states: [], tentative: false, source: RESTRICTED },
  { date: '2027-07-06', name: 'Dr. Syama Prasad Mookerjee Jayanti', types: ['regional'], states: ['WB'], bank: ['WB'], tentative: false, source: STATE },
  { date: '2027-08-15', name: 'Independence Day', localName: 'स्वतंत्रता दिवस', types: ['national', 'gazetted'], states: ALL6, tentative: false, source: `${CENTRAL} (falls on a Sunday)` },
  { date: '2027-08-15', name: 'Milad-un-Nabi', localName: 'मिलाद-उन-नबी', types: ['gazetted'], states: ['DL', 'KA', 'KL', 'MH', 'TN'], tentative: true, source: `${CENTRAL} (falls on a Sunday)` },
  { date: '2027-08-15', name: 'Parsi New Year (Navroz)', types: ['restricted', 'festival'], states: [], tentative: false, source: RESTRICTED },
  { date: '2027-08-17', name: 'Raksha Bandhan', localName: 'रक्षा बंधन', types: ['restricted', 'festival'], states: [], tentative: false, source: RESTRICTED },
  { date: '2027-08-25', name: 'Janmashtami', localName: 'जन्माष्टमी', types: ['gazetted', 'festival'], states: ['DL', 'KL', 'TN', 'WB'], bank: ['KL', 'TN', 'WB'], tentative: false, source: BOTH },
  { date: '2027-09-04', name: 'Ganesh Chaturthi', localName: 'गणेश चतुर्थी', types: ['restricted', 'festival', 'regional'], states: ['KA', 'MH', 'TN'], bank: ['KA', 'MH', 'TN'], tentative: false, source: R_PAT },
  { date: '2027-09-11', name: 'First Onam', localName: 'ഒന്നാം ഓണം', types: ['regional', 'festival'], states: ['KL'], bank: ['KL'], tentative: true, source: STATE },
  { date: '2027-09-12', name: 'Thiruvonam (Onam)', localName: 'തിരുവോണം', types: ['restricted', 'regional', 'festival'], states: ['KL'], tentative: false, source: `${RESTRICTED} (falls on a Sunday)` },
  { date: '2027-10-02', name: 'Gandhi Jayanti', localName: 'गांधी जयंती', types: ['national', 'gazetted'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2027-10-06', name: 'Durga Puja (Maha Saptami)', localName: 'মহা সপ্তমী', types: ['restricted', 'regional', 'festival'], states: ['WB'], bank: ['WB'], tentative: true, source: R_PAT },
  { date: '2027-10-07', name: 'Durga Puja (Maha Ashtami)', localName: 'মহা অষ্টমী', types: ['restricted', 'regional', 'festival'], states: ['WB'], bank: ['WB'], tentative: false, source: R_PAT },
  { date: '2027-10-08', name: 'Maha Navami / Ayudha Puja', localName: 'মহা নবমী / ஆயுத பூஜை', types: ['restricted', 'regional', 'festival'], states: ['KL', 'TN', 'WB'], bank: ['KL', 'TN', 'WB'], tentative: false, source: R_PAT },
  { date: '2027-10-09', name: 'Dussehra (Vijaya Dashami)', localName: 'दशहरा', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2027-10-15', name: 'Maharishi Valmiki Jayanti', types: ['restricted', 'regional'], states: ['KA'], bank: ['KA'], tentative: false, source: R_PAT },
  { date: '2027-10-18', name: 'Karva Chauth', localName: 'करवा चौथ', types: ['restricted', 'festival'], states: [], tentative: false, source: RESTRICTED },
  { date: '2027-10-28', name: 'Naraka Chaturdashi', localName: 'नरक चतुर्दशी', types: ['restricted', 'festival'], states: [], tentative: false, source: RESTRICTED },
  { date: '2027-10-29', name: 'Diwali (Deepavali)', localName: 'दीपावली', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2027-10-30', name: 'Diwali (Bali Pratipada) / Govardhan Puja', localName: 'बलिप्रतिपदा / ಬಲಿಪಾಡ್ಯಮಿ', types: ['restricted', 'regional', 'festival'], states: ['KA', 'MH'], bank: ['KA', 'MH'], tentative: true, source: R_PAT },
  { date: '2027-10-31', name: 'Bhai Duj / Bhai Phonta', localName: 'भाई दूज / ভাইফোঁটা', types: ['restricted', 'festival', 'regional'], states: ['WB'], tentative: false, source: `${RESTRICTED} (falls on a Sunday)` },
  { date: '2027-11-01', name: 'Kannada Rajyotsava', localName: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ', types: ['regional'], states: ['KA'], bank: ['KA'], tentative: false, source: STATE },
  { date: '2027-11-04', name: 'Chhath Puja', localName: 'छठ पूजा', types: ['restricted', 'festival'], states: [], tentative: false, source: RESTRICTED },
  { date: '2027-11-14', name: 'Guru Nanak Jayanti', localName: 'गुरु नानक जयंती', types: ['gazetted', 'festival'], states: ['DL', 'MH', 'WB'], tentative: false, source: `${CENTRAL} (falls on a Sunday)` },
  { date: '2027-12-24', name: 'Christmas Eve', types: ['restricted', 'festival'], states: [], tentative: false, source: RESTRICTED },
  { date: '2027-12-25', name: 'Christmas', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
];
