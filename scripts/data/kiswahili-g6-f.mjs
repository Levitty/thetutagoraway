// KISWAHILI GRADE 6, part F: Kuandika (the recognition outcomes a question can test). Draft, written offline by Claude (13 Nov 2026).
import { S, M, G5, INTERFERENCE } from './kiswahili-g6-lib.mjs';
import { MIS as MIS5 } from './kiswahili-g5-skills.mjs';

export const SKILLS = [
  S('KUANDI.T5_INSHA_ZA_MAELEZO', 'AINA_ZA_INSHA', 'Tambua insha ya wasifu, masimulizi na maelezo', ['a'],
    'Tells a short text that describes a person (wasifu), one that tells events in order (masimulizi) and one that explains how something is done or what it is (maelezo), in 8 of 10 new short texts.',
    ['choose the kind of text', 'fill the gap', 'spot the mistake'], [G5('KUANDI.T1_INSHA_YA_WASIFU.a')], ['recall']),
  S('KUANDI.T6_INSHA_YA_WASIFU', 'MUUNDO_WASIFU', 'Tambua sehemu za insha ya wasifu', ['a'],
    'Names the parts of an insha (kichwa, utangulizi, mwili, hitimisho) and puts a sentence in the right part of a wasifu, in 8 of 10 new items. Writing the insha (outcomes b and c) is composition marking.',
    ['choose the part', 'fill the gap', 'spot the mistake', 'choose the sentence'], [G5('KUANDI.T1_INSHA_YA_WASIFU.a')], ['recall']),
  S('KUANDI.T4_BARUA_RASMI', 'BARUA_RASMI', 'Tambua muundo na vipengele vya barua rasmi', ['a', 'b'],
    'Names the parts of a barua rasmi (anwani ya mwandikaji kulia, tarehe, anwani ya mwandikiwa kushoto, salamu, kichwa, mwili, mwisho "Wako mwaminifu", sahihi na jina) and tells it from a friendly letter, in 8 of 10 new items. Writing the letter (outcome c) is composition marking.',
    ['choose the part', 'fill the gap', 'spot the mistake', 'choose the right wording'], [G5('KUANDI.T4_BARUAPEPE.a')], ['recall']),
  S('KUANDI.T3_KUANDIKA_KWA_TARAKIL', 'MAANDISHI_TARAKILISHI', 'Tambua mitindo ya maandishi ya tarakilishi', ['a'],
    'Names the styles of computer writing (herufi nzito, mlazo, saizi) and the actions kuhifadhi and kuchapisha, and does not take herufi kubwa for herufi nzito, in 8 of 10 new items. Typing a short text (outcome b) is a practical task.',
    ['choose the style', 'fill the gap', 'spot the mistake'], [G5('KUANDI.T3_KUANDIKA_KWA_TARAKIL.a')], ['recall']),
];

export const ALSO = {};

export const MIS = [
  ...MIS5.filter(m => m.skill === 'KUANDI.T1_INSHA_YA_WASIFU.AINA_ZA_INSHA').map(m => ({ ...m, skill: 'KUANDI.T5_INSHA_ZA_MAELEZO.AINA_ZA_INSHA' })),
  M('KUANDI.T6_INSHA_YA_WASIFU.MUUNDO_WASIFU', 'M_INS6_PART', 'Names the wrong part of the insha (puts the ending in the introduction).',
    'Sehemu ya mwisho ya insha huitwa ___.', 'utangulizi', 'hitimisho', 'The child knows the names of the parts but not their order.',
    'A part asked by its place (first, middle, last) with all the names among the options.', 'Insha ina kichwa juu, kisha utangulizi (mwanzo), mwili (katikati) na hitimisho (mwisho).'),
  M('KUANDI.T4_BARUA_RASMI.BARUA_RASMI', 'M_BAR6_PART', 'Puts a part of the letter in the wrong place (salamu for kichwa, tarehe for jina).',
    'Mada ya barua rasmi huandikwa katika ___ cha barua.', 'mwili', 'kichwa', 'The child has met the parts but not what each holds.',
    'Parts asked by what they hold.', 'Kichwa hutaja mada, salamu humwamkia mwandikiwa, mwili una ujumbe, na mwisho una sahihi na jina.'),
  M('KUANDI.T4_BARUA_RASMI.BARUA_RASMI', 'M_BAR6_POSITION', 'Puts the sender\'s address on the left and the receiver\'s on the right.',
    'Anwani ya mwandikaji wa barua rasmi huandikwa upande wa ___ juu ya karatasi.', 'kushoto', 'kulia', 'The child swaps the two addresses.',
    'Left and right among the options.', 'Anwani ya mwandikaji iko juu kulia. Anwani ya mwandikiwa iko kushoto, chini ya tarehe.'),
  M('KUANDI.T4_BARUA_RASMI.BARUA_RASMI', 'M_BAR6_FRIENDLY', 'Uses the greeting, ending or words of a friendly letter in a formal one.',
    'Mwisho wa barua rasmi huwa "Wako ___,".', 'mpenzi', 'mwaminifu', 'The child writes to a headteacher as to a friend.',
    'A formal and a friendly ending among the options.', 'Barua rasmi hutumia lugha na maneno ya heshima, kama "Wako mwaminifu,".'),
  M('KUANDI.T4_BARUA_RASMI.BARUA_RASMI', 'M_BAR6_ORDER', 'Puts the parts of the letter in the wrong order.',
    'Ni mpangilio upi sahihi wa sehemu za barua rasmi?', 'Salamu, mwili, anwani, kichwa, tarehe, mwisho', 'Anwani, tarehe, salamu, kichwa, mwili, mwisho', 'The child does not picture the page from top to bottom.',
    'Two orderings among the options.', 'Barua huanza na anwani na tarehe juu, kisha salamu, kichwa, mwili na mwisho chini.'),
  M('KUANDI.T3_KUANDIKA_KWA_TARAKIL.MAANDISHI_TARAKILISHI', 'M_TAR6_MIX', 'Mixes herufi nzito, mlazo, saizi and rangi.',
    'Herufi zinazoegemea upande huitwa herufi ___.', 'nzito', 'mlazo', 'The child has used the buttons but does not know their names.',
    'Style names among the options.', 'Herufi nzito zimenenepeshwa, herufi mlazo huegemea upande, saizi ni ukubwa wa herufi.'),
  M('KUANDI.T3_KUANDIKA_KWA_TARAKIL.MAANDISHI_TARAKILISHI', 'M_TAR6_CAPS', 'Takes herufi kubwa or ndogo (capital or small letters) for a style such as herufi nzito.',
    'Herufi zilizonenepeshwa huitwa herufi ___.', 'kubwa', 'nzito', 'The child thinks big and bold are the same.',
    'Kubwa among the options.', 'Herufi kubwa ni za mwanzo wa sentensi na majina. Herufi nzito ni zilizonenepeshwa, zinaweza kuwa ndogo au kubwa.'),
  M('KUANDI.T3_KUANDIKA_KWA_TARAKIL.MAANDISHI_TARAKILISHI', 'M_TAR6_ICON', 'Mixes the actions kuhifadhi (save), kuchapisha (print), kufuta (delete) and kufunga (close).',
    'Kuweka kazi yako salama katika tarakilishi huitwa ___.', 'kuchapisha', 'kuhifadhi', 'The child does not know what each button does.',
    'Several actions among the options.', 'Kuhifadhi ni kuweka kazi salama. Kuchapisha ni kutoa karatasi. Kufuta huondoa kazi.'),
];
