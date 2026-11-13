// ============================================================================
// KISWAHILI GRADE 8, UFAHAMU WA KUSOMA NA KUSIKILIZA kwa vifungu vya asili (kiswahili_g8_passages.js): familia za DRAFT.
// Familia mbili kwa kila stadi: ya kwanza huchota maswali kutoka kifungu cha kwanza, cha tatu (na kadhalika), ya pili kutoka vingine.
// Tatizo la kusoma hubeba `passage: { title, text }`; la kusikiliza hubeba `listening: { title, script }` na familia yake inahitaji sauti
// (needsAudio: true; matini husomwa kwa sauti na haionyeshwi kamwe). Zimezimwa kwa watoto (reviewed:false) hadi mwalimu wa Kiswahili mzawa azithibitishe.
// Swali lina majibu matatu yasiyo sahihi: jambo dogo (_DETAIL), kinyume (_OPPOSITE) na lisilomo kwenye matini (_NOTSAID).
// ============================================================================
import { fam, choose, pick } from './kiswahili_g8_lib.js';
import { PASSAGES, LISTENS } from './kiswahili_g8_passages.js';

const rowsFor = (src, types, half) => src.filter((_, i) => i % 2 === half).flatMap(p => types.flatMap(t => (p.q[t] || []).map(row => ({ p, row }))));
const mk = (id, src, types, half, h, listening) => () => {
  const { p, row } = pick(rowsFor(src, types, half));
  const [q, right, w1, w2, w3] = row;
  const wrongs = [[w1, `M_KS8_${id}_DETAIL`], [w2, `M_KS8_${id}_OPPOSITE`], [w3, `M_KS8_${id}_NOTSAID`]];
  const base = choose([[q, right, wrongs, 'Rudi kwenye matini na utafute sehemu inayojibu swali.']], { h, instruction: listening ? 'Sikiliza matini. Kisha chagua jibu bora.' : 'Soma kifungu. Kisha chagua jibu bora.', s1: listening ? 'Fikiria ulichosikia.' : 'Rudi kwenye kifungu.' })();
  if (!base) return null;
  return { ...base, ...(listening ? { listening: { title: p.title, script: p.script } } : { passage: { title: p.title, text: p.text } }) };
};
// R(tag, SKILL_ID, 'SUB.SKILL_ID', 'prose'|'listen', [types], [hint1, hint2], [oc first, oc second])
const R = (tag, id, cs, group, types, h, ocs) => [0, 1].map(half =>
  fam(`read.${tag}.${half ? 'b' : 'a'}`, cs, half ? 'word' : 'direct', half + 1, mk(id, group === 'listen' ? LISTENS : PASSAGES, types, half, h, group === 'listen'), ocs[half] || ocs[0], group === 'listen' ? { needsAudio: true } : undefined));
const HP = ['Rudi kwenye kifungu na utafute sentensi inayojibu swali.', 'Jibu liko kwenye kifungu; jambo dogo, kinyume au jambo jipya si sahihi.'];
const HL = ['Fikiria ulichosikia na utafute sehemu inayojibu swali.', 'Jibu lazima litokane na matini uliyosikia.'];
export const FAMILIES = [
  ...R('habari', 'RS_HABARI', 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_HABARI', 'prose', ['fact', 'order'], HP, ['a']),
  ...R('matukio', 'RS_MATUKIO', 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_MATUKIO', 'prose', ['order', 'fact'], ['Tafuta tukio la kwanza, kisha la pili, na kadhalika.', 'Tafuta maneno ya wakati kama kisha, baadaye na mwishowe.'], ['b']),
  ...R('utabiri', 'RS_UTABIRI', 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_UTABIRI', 'prose', ['predict', 'infer'], ['Utabiri mzuri unapatana na vidokezo vya kifungu.', 'Tazama sentensi za mwisho kwa kinachofuata.'], ['c']),
  ...R('msamiati', 'RS_MSAMIATI', 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_MSAMIATI', 'prose', ['ctx', 'infer'], ['Soma sentensi yenye neno hilo na zile zinazolizunguka.', 'Jaribu kila maana mahali pa neno.'], ['d']),
  ...R('ufahamu5', 'RS_UFAHAMU5', 'KUSOMA.T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5', 'prose', ['fact', 'summary', 'ctx'], HP, ['a', 'b']),
  ...R('ushawishi', 'RS_USHAWISHI', 'KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', 'prose', ['fact', 'predict', 'ctx', 'infer'], HP, ['a', 'b']),
  ...R('mjadala', 'RS_MJADALA', 'KUSOMA.T14_KUSOMA_KWA_UFAHAMU.RS_MJADALA', 'prose', ['fact', 'ctx', 'infer'], HP, ['a', 'b']),
  ...R('ujumbe', 'RS_UJUMBE', 'KUSOMA.T2_KUSOMA_KWA_MAPANA.RS_UJUMBE', 'prose', ['main', 'infer'], HP, ['a']),
  ...R('ufupisho', 'RS_UFUPISHO', 'KUSOMA.T15_UFUPISHO.RS_UFUPISHO', 'prose', ['summary', 'main'], ['Muhtasari huwa na mawazo makuu kwa mpangilio.', 'Jambo dogo halifai kwenye muhtasari.'], ['a', 'b']),
  ...R('sikiujumbe', 'LS_UJUMBE', 'KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_UJUMBE', 'listen', ['main', 'ctx'], HL, ['a', 'b']),
  ...R('sikihabari', 'LS_HABARI', 'KUSIKI.T12_KUSIKILIZA_KWA_MAKIN.LS_HABARI', 'listen', ['main', 'ctx', 'detail'], HL, ['a', 'b']),
  ...R('maagizo', 'LS_MAAGIZO', 'KUSIKI.T5_KUSIKILIZA_MAAGIZO.LS_MAAGIZO', 'listen', ['main', 'detail', 'ctx'], HL, ['b', 'c']),
];
