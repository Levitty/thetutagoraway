// "Why Tutagora": the founder's vision, in the founder's own words.
//
// Until the words arrive the page shows marked placeholders (VISION.draft),
// so the layout can be previewed without inventing anyone's story. To
// publish: fill in VISION below and set draft to false.
import React from 'react';
import { SiteNav, SiteFooter, SiteIcon } from './ui.jsx';

const VISION = {
  draft: false,
  headline: 'Every great mind started with a spark.',
  intro: 'Many of the innovators and builders of our generation began with a spark: one moment that lit something in them and made all the difference.',
  sections: [
    { h: 'Every child shines differently', p: 'Not every student is gifted in the same way, and that is not a weakness. It means no two children need exactly the same help.' },
    { h: 'We meet every child where they are', p: "Tutagora starts by finding each child's level of need, then gives them a plan made for them alone.",
      points: [
        { b: 'Ready to race ahead?', t: 'Accelerated learning, and expert tutors to make that spark burn brighter.' },
        { b: 'Missing a foundation?', t: 'We build it with the same enthusiasm, and celebrate it just as loudly.' },
      ] },
  ],
  quote: 'We want to be that spark, so every child can go as far as their curiosity takes them.',
  name: null,        // your name, e.g. 'Jane Doe'
  role: 'Founder, Tutagora',
  photo: null,       // e.g. '/images/founder.jpg'
};

// What exists today and what comes next (facts, not placeholders).
const NOW = ['Free maths check', 'Daily maths practice', 'Composition and insha', 'Live tutors', 'Tutagora for schools'];
const NEXT = ['More subjects', 'More ways to practise'];

const Text = ({ children, as: Tag = 'p', className = '' }) => (
  <Tag className={`${className} ${VISION.draft ? 'ph' : ''}`}>{children}</Tag>
);

const Part = ({ s }) => (
  <div className="vpart">
    <h2 className="display">{s.h}</h2>
    <Text>{s.p}</Text>
    {s.points && <div className="vpoints">{s.points.map(x => <div key={x.b}><b>{x.b}</b><span>{x.t}</span></div>)}</div>}
  </div>
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
        {VISION.sections.slice(0, 1).map(s => <Part key={s.h} s={s} />)}

        <blockquote className="vquote"><Text as="span">{VISION.quote}</Text></blockquote>

        {VISION.sections.slice(1).map(s => <Part key={s.h} s={s} />)}

        <div className="vnow">
          <div><div className="kicker">On Tutagora today</div><ul>{NOW.map(x => <li key={x}><SiteIcon name="check" />{x}</li>)}</ul></div>
          <div><div className="kicker">Coming next</div><ul className="next">{NEXT.map(x => <li key={x}><SiteIcon name="arrow" />{x}</li>)}</ul></div>
        </div>

        <div className="vsign">
          <div className={`vphoto ${VISION.photo ? '' : 'ph'}`}>{VISION.photo ? <img src={VISION.photo} alt={VISION.name} /> : 'Photo'}</div>
          <div>{VISION.name ? <b>{VISION.name}</b> : <b className="ph">Your name</b>}<span>{VISION.role}</span></div>
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
