// ============================================================================
// FAIR KENYAN CONTEXTS for question families: names, believable prices, real
// places. A price comes from this table, so "a pencil costs 1422 shillings"
// cannot happen. Prices are rough 2026 shop prices, chosen to be believable
// rather than exact; a question that needs other numbers says so in its story.
// ============================================================================
import { pick, randInt } from '../schema.js';
import { commas } from './core.js';

const GIRLS = ['Wanjiru', 'Achieng', 'Amina', 'Nyambura', 'Halima', 'Chebet', 'Wambui', 'Akinyi', 'Njeri', 'Asha', 'Nyaboke', 'Zawadi', 'Muthoni', 'Naliaka', 'Cherono', 'Makena', 'Mwende', 'Nekesa', 'Fatuma'];
const BOYS = ['Juma', 'Kiprono', 'Otieno', 'Baraka', 'Mutua', 'Omondi', 'Kamau', 'Kioko', 'Mugambi', 'Wafula', 'Barasa', 'Kipchoge', 'Mwangi', 'Ochieng', 'Hassan', 'Karimi', 'Onyango', 'Musa'];
const asPerson = (name, girl) => ({ name, she: girl ? 'she' : 'he', her: girl ? 'her' : 'his', herObj: girl ? 'her' : 'him', She: girl ? 'She' : 'He', Her: girl ? 'Her' : 'His' });
export const person = () => (Math.random() < 0.5 ? asPerson(pick(GIRLS), true) : asPerson(pick(BOYS), false));
export const twoPeople = () => { const a = person(); let b = person(); while (b.name === a.name) b = person(); return [a, b]; };

// sh 1,250
export const sh = (n) => `sh ${commas(n)}`;

// item -> [lowest, highest, step] in shillings, per the unit named.
export const PRICES = {
  pencil: [10, 30, 5], pen: [20, 50, 5], rubber: [10, 30, 5], ruler: [30, 80, 10], 'exercise book': [40, 120, 10], 'geometry set': [150, 350, 50], 'school bag': [800, 2500, 100],
  mango: [20, 60, 5], orange: [10, 30, 5], banana: [10, 25, 5], egg: [15, 25, 5], mandazi: [10, 20, 5], chapati: [20, 40, 5], 'loaf of bread': [55, 75, 5], 'bottle of soda': [50, 80, 10],
  'kg of sugar': [150, 200, 10], 'kg of rice': [130, 220, 10], 'kg of maize flour': [90, 140, 10], 'kg of tomatoes': [80, 140, 10], 'kg of beans': [150, 220, 10], 'litre of milk': [60, 90, 5], 'litre of cooking oil': [300, 400, 10], 'litre of petrol': [170, 200, 5],
  'bag of maize': [3500, 5500, 100], 'sack of potatoes': [2500, 4500, 100], goat: [5000, 12000, 500], hen: [600, 1200, 50], 'bag of cement': [650, 900, 10],
  radio: [1500, 5000, 100], 'mobile phone': [6000, 25000, 500], bicycle: [8000, 20000, 500], 'sewing machine': [12000, 30000, 500], television: [18000, 45000, 500], fridge: [30000, 70000, 1000], 'solar panel': [8000, 25000, 500], motorcycle: [120000, 220000, 5000],
};
export const price = (item) => { const [lo, hi, step] = PRICES[item]; return lo + step * randInt(0, Math.floor((hi - lo) / step)); };

// [town, town, road km], rounded.
export const ROUTES = [['Nairobi', 'Nakuru', 160], ['Nairobi', 'Mombasa', 480], ['Nairobi', 'Kisumu', 350], ['Nairobi', 'Eldoret', 310], ['Nairobi', 'Thika', 45], ['Nairobi', 'Nyeri', 150], ['Nairobi', 'Machakos', 60], ['Nakuru', 'Kisumu', 185], ['Nakuru', 'Eldoret', 155], ['Mombasa', 'Malindi', 120], ['Nairobi', 'Meru', 225], ['Kisumu', 'Kakamega', 50], ['Nairobi', 'Garissa', 370], ['Eldoret', 'Kitale', 70]];
export const route = () => pick(ROUTES);
export const TOWNS = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Machakos', 'Kitale', 'Malindi', 'Garissa', 'Kakamega', 'Meru', 'Embu', 'Kericho'];

// Longitudes, rounded to whole degrees: positive east, negative west.
export const LONGITUDES = [['Nairobi', 37], ['Mombasa', 40], ['Kisumu', 35], ['Kampala', 33], ['Dar es Salaam', 39], ['Addis Ababa', 39], ['Kinshasa', 15], ['Lagos', 3], ['Dubai', 55], ['Delhi', 77], ['Beijing', 116], ['Tokyo', 140], ['London', 0], ['Accra', 0], ['New York', -74], ['Lima', -77]];
export const lonText = (l) => (l === 0 ? '0°' : l > 0 ? `${l}°E` : `${-l}°W`);

// Temperatures a Kenyan child can picture, in °C.
export const PLACES_TEMP = [['Lodwar', 28, 38], ['Mombasa', 24, 33], ['Nairobi', 12, 27], ['Eldoret', 10, 25], ['Nyeri', 9, 24], ['Kisumu', 18, 32], ['Garissa', 24, 38]];
