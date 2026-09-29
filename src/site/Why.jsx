// "Why Tutagora": the founder's vision, in the founder's own words.
//
// Until the words arrive the page shows marked placeholders (VISION.draft),
// so the layout can be previewed without inventing anyone's story. To
// publish: fill in VISION below and set draft to false.
import React from 'react';
import { SiteNav, SiteFooter, SiteIcon } from './ui.jsx';

const VISION = {
  draft: true,
  headline: 'Your headline: one line that sums up why Tutagora exists.',
  intro: 'Your opening: two or three sentences a parent reads first.',
  sections: [
    { h: 'Why I started Tutagora', p: 'What you saw happening to children and families that made you start.' },
    { h: "What's broken today", p: 'How children in Kenya get help with learning now, and what goes wrong.' },
    { h: 'What we are building', p: 'Where Tutagora is going: practice that starts with maths and writing and grows, tutors, schools.' },
    { h: 'Our promise to your family', p: 'What every family can count on from Tutagora.' },
  ],
  quote: 'A line you want every parent to remember.',
  name: 'Your name',
  role: 'Founder, Tutagora',
  photo: null, // e.g. '/images/founder.jpg'
};

// What exists today and what comes next (facts, not placeholders).
const NOW = ['Free maths check', 'Daily maths practice', 'Composition and insha', 'Live tutors', 'Tutagora for schools'];
const NEXT = ['More subjects', 'More ways to practise'];

const Text = ({ children, as: Tag = 'p', className = '' }) => (
  <Tag className={`${className} ${VISION.draft ? 'ph' : ''}`}>{children}</Tag>
);

export default function Why({ onNavigate, onSignIn, user }) {
  return (
    <div className="tg vision">
      <header className="vhero">
        <SiteNav onNavigate={onNavigate} onSignIn={onSignIn} user={user} current="why" />
        <div className="in">
          {VISION.draft && <div className="draftnote">Preview: the grey boxes are where your words go.</div>}
          <div className="kicker">Why Tutagora</div>
          <Text as="h1" className="display">{VISION.headline}</Text>
          <Text className="lead">{VISION.intro}</Text>
        </div>
      </header>

      <section className="sec"><div className="in vbody">
        {VISION.sections.slice(0, 2).map(s => (
          <div key={s.h} className="vpart"><h2 className="display">{s.h}</h2><Text>{s.p}</Text></div>
        ))}

        <blockquote className="vquote"><Text as="span">{VISION.quote}</Text></blockquote>

        {VISION.sections.slice(2).map(s => (
          <div key={s.h} className="vpart"><h2 className="display">{s.h}</h2><Text>{s.p}</Text></div>
        ))}

        <div className="vnow">
          <div><div className="kicker">On Tutagora today</div><ul>{NOW.map(x => <li key={x}><SiteIcon name="check" />{x}</li>)}</ul></div>
          <div><div className="kicker">Coming next</div><ul className="next">{NEXT.map(x => <li key={x}><SiteIcon name="arrow" />{x}</li>)}</ul></div>
        </div>

        <div className="vsign">
          <div className={`vphoto ${VISION.photo ? '' : 'ph'}`}>{VISION.photo ? <img src={VISION.photo} alt={VISION.name} /> : 'Photo'}</div>
          <div><Text as="b">{VISION.name}</Text><span>{VISION.role}</span></div>
        </div>
      </div></section>

      <section className="sec tight"><div className="in vcta">
        <h2 className="display">See where your child should start.</h2>
        <div className="row">
          <button type="button" className="btn" onClick={() => onNavigate('check')}>Take the free check <SiteIcon name="arrow" /></button>
          <button type="button" className="btn line" onClick={() => onNavigate('tutors')}>Find a tutor</button>
        </div>
      </div></section>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
