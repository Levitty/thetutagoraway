// Every grade's families, in one list. Each file exports FAMILIES, an array.
import { FAMILIES as G9_NUM_ALG } from './g9_num_alg.js';
import { FAMILIES as G9_MEASURE } from './g9_measure.js';
import { FAMILIES as G9_GEO_DATA } from './g9_geo_data.js';
import { FAMILIES as G8_NUM_ALG } from './g8_num_alg.js';
import { FAMILIES as G8_MEASURE_GEO } from './g8_measure_geo.js';
import { FAMILIES as G7_NUM_ALG } from './g7_num_alg.js';
import { FAMILIES as G7_MEASURE } from './g7_measure.js';
import { FAMILIES as G7_GEO_DATA } from './g7_geo_data.js';

export const GRADE_FAMILIES = [...G9_NUM_ALG, ...G9_MEASURE, ...G9_GEO_DATA, ...G8_NUM_ALG, ...G8_MEASURE_GEO, ...G7_NUM_ALG, ...G7_MEASURE, ...G7_GEO_DATA];
