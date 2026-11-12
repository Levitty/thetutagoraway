// A short text to read before a comprehension question (English). The passage rides on the problem as
// { title, text }; paragraphs are separated by a blank line. It sits above the question, in HOREB's look: the
// pink tint behind it, a large readable size and generous line height for a phone, no figures or emojis.
import React from 'react';
import { passageParagraphs } from './passage.js';


export default function PassageCard({ passage }) {
  if (!passage?.text) return null;
  return (
    <section aria-label="Read this first" className="mb-5 rounded-2xl bg-[#fff4f7] border border-[#f6d5de] px-4 py-4 sm:px-5">
      <div className="text-[11px] font-bold tracking-[.08em] uppercase text-[#e8336d] mb-1.5">Read this first</div>
      {passage.title && <h3 className="text-[19px] font-extrabold text-slate-900 mb-2 leading-snug">{passage.title}</h3>}
      {passageParagraphs(passage.text).map((para, i) => (
        <p key={i} className="text-[17px] leading-[1.6] text-slate-800 mb-2.5 last:mb-0" style={{ overflowWrap: 'anywhere' }}>{para}</p>
      ))}
    </section>
  );
}
