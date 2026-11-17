import type { Holiday } from '../types.ts';

/*
 * 2026 holiday data. VERIFIED on 16 Nov 2026.
 *
 * Bank holidays (`bank`): copied from the official RBI holiday matrix
 *   https://www.rbi.org.in/Scripts/HolidayMatrixDisplay.aspx (year 2026, all months)
 *   for the regional offices: Mumbai (MH), New Delhi (DL), Bengaluru (KA), Chennai (TN),
 *   Kochi + Thiruvananthapuram (KL) and Kolkata (WB).
 *   City-only closures are not modelled: Thiruvananthapuram also closed on 3 Mar (Attukal Pongala).
 *
 * Gazetted holidays: DoPT O.M. 12/2/2023-JCA dated 3 Jul 2025 (17 holidays).
 *   Id-ul-Zuha was notified for 27 May but observed on 28 May after moon sighting
 *   (RBI matrix and CGEWCC Chennai list), so it is stored on 28 May.
 *
 * Restricted / festival-only entries (no `bank` field) come from the DoPT restricted list.
 */

const CENTRAL = 'DoPT O.M. 12/2/2023-JCA (3 Jul 2025)';
const RBI = 'RBI holiday matrix 2026';
const BOTH = `${CENTRAL}; ${RBI}`;

const ALL6 = 'ALL' as const;

export const holidays2026: readonly Holiday[] = [
  { date: '2026-01-01', name: "New Year's Day", types: ['restricted', 'festival', 'regional'], states: ['TN', 'WB'], bank: ['TN', 'WB'], tentative: false, source: RBI },
  { date: '2026-01-02', name: 'Mannam Jayanti', types: ['regional'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-01-12', name: 'Swami Vivekananda Jayanti', types: ['regional'], states: ['WB'], bank: ['WB'], tentative: false, source: RBI },
  { date: '2026-01-13', name: 'Lohri', localName: 'लोहड़ी', types: ['restricted', 'festival'], states: [], tentative: false, source: CENTRAL },
  { date: '2026-01-14', name: 'Makar Sankranti', localName: 'मकर संक्रांति', types: ['restricted', 'festival'], states: [], tentative: false, source: CENTRAL },
  { date: '2026-01-15', name: 'Makara Sankranti', localName: 'ಮಕರ ಸಂಕ್ರಾಂತಿ', types: ['regional', 'festival'], states: ['KA'], bank: ['KA'], tentative: false, source: RBI },
  { date: '2026-01-15', name: 'Pongal', localName: 'பொங்கல்', types: ['regional', 'festival'], states: ['TN'], bank: ['TN'], tentative: false, source: RBI },
  { date: '2026-01-15', name: 'Municipal Corporation Elections', types: ['regional'], states: ['MH'], bank: ['MH'], tentative: false, source: RBI },
  { date: '2026-01-16', name: 'Thiruvalluvar Day', localName: 'திருவள்ளுவர் தினம்', types: ['regional'], states: ['TN'], bank: ['TN'], tentative: false, source: RBI },
  { date: '2026-01-17', name: 'Uzhavar Thirunal', localName: 'உழவர் திருநாள்', types: ['regional'], states: ['TN'], bank: ['TN'], tentative: false, source: RBI },
  { date: '2026-01-23', name: 'Netaji Subhas Chandra Bose Jayanti / Saraswati Puja', types: ['regional', 'festival'], states: ['WB'], bank: ['WB'], tentative: false, source: RBI },
  { date: '2026-01-26', name: 'Republic Day', localName: 'गणतंत्र दिवस', types: ['national', 'gazetted'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2026-02-15', name: 'Maha Shivaratri', localName: 'महाशिवरात्रि', types: ['restricted', 'festival', 'regional'], states: ['KA', 'KL', 'MH'], tentative: false, source: CENTRAL },
  { date: '2026-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti', localName: 'छत्रपती शिवाजी महाराज जयंती', types: ['regional'], states: ['MH'], bank: ['MH'], tentative: false, source: RBI },
  { date: '2026-03-03', name: 'Holi (Dhulivandan) / Doljatra', localName: 'धुलिवंदन / দোলযাত্রা', types: ['regional', 'festival'], states: ['MH', 'WB'], bank: ['MH', 'WB'], tentative: false, source: RBI },
  { date: '2026-03-04', name: 'Holi', localName: 'होली', types: ['gazetted', 'festival'], states: ['DL'], bank: ['DL'], tentative: false, source: BOTH },
  { date: '2026-03-19', name: 'Gudi Padwa / Ugadi / Telugu New Year', localName: 'गुढीपाडवा / ಯುಗಾದಿ', types: ['restricted', 'regional', 'festival'], states: ['KA', 'MH', 'TN'], bank: ['KA', 'MH', 'TN'], tentative: false, source: RBI },
  { date: '2026-03-20', name: 'Id-ul-Fitr (Kerala)', localName: 'ഈദുൽ ഫിത്ർ', types: ['regional', 'festival'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-03-21', name: 'Id-ul-Fitr', localName: 'ईद-उल-फ़ितर', types: ['gazetted', 'festival'], states: ['DL', 'KA', 'MH', 'TN', 'WB'], bank: ['DL', 'KA', 'MH', 'TN', 'WB'], tentative: false, source: BOTH },
  { date: '2026-03-26', name: 'Ram Navami', localName: 'राम नवमी', types: ['gazetted', 'festival'], states: ['DL', 'MH', 'WB'], bank: ['MH', 'WB'], tentative: false, source: BOTH },
  { date: '2026-03-30', name: 'Mahavir Jayanti (Karnataka)', types: ['regional'], states: ['KA'], bank: ['KA'], tentative: false, source: RBI },
  { date: '2026-03-31', name: 'Mahavir Jayanti', localName: 'महावीर जयंती', types: ['gazetted'], states: ['DL', 'MH', 'TN', 'WB'], bank: ['DL', 'MH', 'TN', 'WB'], tentative: false, source: BOTH },
  { date: '2026-04-01', name: 'Annual closing of bank accounts', types: ['bank-closing'], states: [], bank: ALL6, tentative: false, source: RBI },
  { date: '2026-04-02', name: 'Maundy Thursday', types: ['regional'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-04-03', name: 'Good Friday', types: ['gazetted'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2026-04-09', name: 'Kerala Legislative Assembly Election', types: ['regional'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', localName: 'आंबेडकर जयंती', types: ['regional'], states: ALL6, bank: ALL6, tentative: false, source: RBI },
  { date: '2026-04-14', name: 'Tamil New Year', localName: 'தமிழ்ப் புத்தாண்டு', types: ['regional', 'festival'], states: ['TN'], bank: ['TN'], tentative: false, source: RBI },
  { date: '2026-04-15', name: 'Vishu', localName: 'വിഷു', types: ['regional', 'festival'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-04-15', name: 'Bengali New Year (Poila Boishakh)', localName: 'পয়লা বৈশাখ', types: ['regional', 'festival'], states: ['WB'], bank: ['WB'], tentative: false, source: RBI },
  { date: '2026-04-20', name: 'Basava Jayanti / Akshaya Tritiya', localName: 'ಬಸವ ಜಯಂತಿ', types: ['regional', 'festival'], states: ['KA'], bank: ['KA'], tentative: false, source: RBI },
  { date: '2026-04-23', name: 'Tamil Nadu Legislative Assembly Election', types: ['regional'], states: ['TN'], bank: ['TN'], tentative: false, source: RBI },
  { date: '2026-04-29', name: 'West Bengal Legislative Assembly Election', types: ['regional'], states: ['WB'], bank: ['WB'], tentative: false, source: RBI },
  { date: '2026-05-01', name: 'Buddha Purnima', localName: 'बुद्ध पूर्णिमा', types: ['gazetted', 'festival'], states: ['DL', 'MH', 'WB'], bank: ['DL', 'MH', 'WB'], tentative: false, source: BOTH },
  { date: '2026-05-01', name: 'Maharashtra Day', localName: 'महाराष्ट्र दिन', types: ['regional'], states: ['MH'], bank: ['MH'], tentative: false, source: RBI },
  { date: '2026-05-01', name: 'May Day (Labour Day)', types: ['regional'], states: ['KA', 'KL', 'TN', 'WB'], bank: ['KA', 'KL', 'TN', 'WB'], tentative: false, source: RBI },
  { date: '2026-05-09', name: 'Rabindranath Tagore Jayanti', localName: 'রবীন্দ্র জয়ন্তী', types: ['restricted', 'regional'], states: ['WB'], bank: ['WB'], tentative: false, source: RBI },
  { date: '2026-05-27', name: 'Id-ul-Zuha (Bakrid) (Kerala)', types: ['regional', 'festival'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-05-28', name: 'Id-ul-Zuha (Bakrid)', localName: 'ईद-उल-अज़हा', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: false, source: `${BOTH} (moved from 27 May after moon sighting)` },
  { date: '2026-06-26', name: 'Muharram', localName: 'मुहर्रम', types: ['gazetted'], states: ['DL', 'KA', 'MH', 'TN', 'WB'], bank: ['DL', 'KA', 'MH', 'TN', 'WB'], tentative: false, source: BOTH },
  { date: '2026-07-06', name: 'Dr. Syama Prasad Mookerjee Jayanti', types: ['regional'], states: ['WB'], bank: ['WB'], tentative: false, source: RBI },
  { date: '2026-08-15', name: 'Independence Day', localName: 'स्वतंत्रता दिवस', types: ['national', 'gazetted'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2026-08-25', name: 'First Onam', localName: 'ഒന്നാം ഓണം', types: ['regional', 'festival'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-08-26', name: 'Milad-un-Nabi', localName: 'मिलाद-उन-नबी', types: ['gazetted'], states: ['DL', 'KA', 'KL', 'MH', 'TN'], bank: ['DL', 'KA', 'KL', 'MH', 'TN'], tentative: false, source: BOTH },
  { date: '2026-08-26', name: 'Thiruvonam (Onam)', localName: 'തിരുവോണം', types: ['regional', 'festival'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-08-28', name: 'Sree Narayana Guru Jayanti / Ayyankali Jayanti', types: ['regional'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-08-28', name: 'Raksha Bandhan', localName: 'रक्षा बंधन', types: ['restricted', 'festival'], states: [], tentative: false, source: CENTRAL },
  { date: '2026-09-04', name: 'Janmashtami', localName: 'जन्माष्टमी', types: ['gazetted', 'festival'], states: ['DL', 'KL', 'TN', 'WB'], bank: ['KL', 'TN', 'WB'], tentative: false, source: BOTH },
  { date: '2026-09-14', name: 'Ganesh Chaturthi', localName: 'गणेश चतुर्थी', types: ['restricted', 'festival', 'regional'], states: ['KA', 'MH', 'TN'], bank: ['KA', 'MH', 'TN'], tentative: false, source: RBI },
  { date: '2026-09-21', name: 'Sree Narayana Guru Samadhi', types: ['regional'], states: ['KL'], bank: ['KL'], tentative: false, source: RBI },
  { date: '2026-10-02', name: 'Gandhi Jayanti', localName: 'गांधी जयंती', types: ['national', 'gazetted'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2026-10-10', name: 'Mahalaya Amavasya', localName: 'মহালয়া', types: ['regional', 'festival'], states: ['KA', 'WB'], bank: ['KA', 'WB'], tentative: false, source: RBI },
  { date: '2026-10-18', name: 'Durga Puja (Maha Saptami)', localName: 'মহা সপ্তমী', types: ['regional', 'festival'], states: ['WB'], tentative: false, source: 'West Bengal (falls on a Sunday)' },
  { date: '2026-10-19', name: 'Maha Ashtami / Ayudha Puja', localName: 'মহা অষ্টমী / ஆயுத பூஜை', types: ['regional', 'festival'], states: ['KL', 'TN', 'WB'], bank: ['KL', 'TN', 'WB'], tentative: false, source: RBI },
  { date: '2026-10-20', name: 'Dussehra (Vijaya Dashami) / Maha Navami', localName: 'दशहरा', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
  { date: '2026-10-21', name: 'Vijaya Dashami (Maha Dashami)', types: ['regional', 'festival'], states: ['KA', 'KL', 'WB'], bank: ['KA', 'KL', 'WB'], tentative: false, source: RBI },
  { date: '2026-10-26', name: 'Maharishi Valmiki Jayanti', types: ['restricted', 'regional'], states: ['KA'], bank: ['KA'], tentative: false, source: RBI },
  { date: '2026-11-01', name: 'Kannada Rajyotsava', localName: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ', types: ['regional'], states: ['KA'], tentative: false, source: 'Karnataka (falls on a Sunday)' },
  { date: '2026-11-08', name: 'Diwali (Deepavali)', localName: 'दीपावली', types: ['gazetted', 'festival'], states: ALL6, tentative: false, source: `${CENTRAL} (falls on a Sunday)` },
  { date: '2026-11-10', name: 'Diwali (Bali Pratipada) / Govardhan Puja', localName: 'बलिप्रतिपदा / ಬಲಿಪಾಡ್ಯಮಿ', types: ['regional', 'festival'], states: ['KA', 'MH'], bank: ['KA', 'MH'], tentative: false, source: RBI },
  { date: '2026-11-11', name: 'Bhai Phonta (Bhratridwitiya)', localName: 'ভাইফোঁটা', types: ['regional', 'festival'], states: ['WB'], bank: ['WB'], tentative: false, source: RBI },
  { date: '2026-11-24', name: 'Guru Nanak Jayanti', localName: 'गुरु नानक जयंती', types: ['gazetted', 'festival'], states: ['DL', 'MH', 'WB'], bank: ['DL', 'MH', 'WB'], tentative: false, source: BOTH },
  { date: '2026-11-27', name: 'Kanakadasa Jayanti', localName: 'ಕನಕದಾಸ ಜಯಂತಿ', types: ['regional'], states: ['KA'], bank: ['KA'], tentative: false, source: RBI },
  { date: '2026-12-25', name: 'Christmas', types: ['gazetted', 'festival'], states: ALL6, bank: ALL6, tentative: false, source: BOTH },
];
