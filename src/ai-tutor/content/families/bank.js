// Every grade's families, in one list. Each file exports FAMILIES, an array.
import { FAMILIES as GAPS } from './gaps.js';
import { FAMILIES as G1_3 } from './g1_3.js';
import { FAMILIES as G4 } from './g4.js';
import { FAMILIES as G5 } from './g5.js';
import { FAMILIES as G5C_WHOLE } from './g5c_whole.js';
import { FAMILIES as G5C_ADDSUB } from './g5c_addsub.js';
import { FAMILIES as G5C_MULDIV } from './g5c_muldiv.js';
import { FAMILIES as G5C_FRACDEC } from './g5c_fracdec.js';
import { FAMILIES as G5C_EQ } from './g5c_eq.js';
import { FAMILIES as G5C_UNITS } from './g5c_units.js';
import { FAMILIES as G5C_MEAS } from './g5c_meas.js';
import { FAMILIES as G5C_MONEY } from './g5c_money.js';
import { FAMILIES as G5C_GEOMDATA } from './g5c_geomdata.js';

// Grade 5 Mathematics written from the curriculum map (cskill on every one): see g5c_lib.js.
export const G5_CURRICULUM = [...G5C_WHOLE, ...G5C_ADDSUB, ...G5C_MULDIV, ...G5C_FRACDEC, ...G5C_EQ, ...G5C_UNITS, ...G5C_MEAS, ...G5C_MONEY, ...G5C_GEOMDATA];
import { FAMILIES as G6 } from './g6.js';
import { FAMILIES as G9_NUM_ALG } from './g9_num_alg.js';
import { FAMILIES as G9_MEASURE } from './g9_measure.js';
import { FAMILIES as G9_GEO_DATA } from './g9_geo_data.js';
import { FAMILIES as G8_NUM_ALG } from './g8_num_alg.js';
import { FAMILIES as G8_MEASURE_GEO } from './g8_measure_geo.js';
import { FAMILIES as G7_NUM_ALG } from './g7_num_alg.js';
import { FAMILIES as G7_MEASURE } from './g7_measure.js';
import { FAMILIES as G7_GEO_DATA } from './g7_geo_data.js';

export const GRADE_FAMILIES = [...G9_NUM_ALG, ...G9_MEASURE, ...G9_GEO_DATA, ...G8_NUM_ALG, ...G8_MEASURE_GEO, ...G7_NUM_ALG, ...G7_MEASURE, ...G7_GEO_DATA, ...G6, ...G5_CURRICULUM, ...G5, ...G4, ...G1_3, ...GAPS];
