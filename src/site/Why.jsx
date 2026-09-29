// "Why Tutagora": the vision, in the founder's words. One paragraph, the
// Tutagora promise, and a sign-off from the team.
import React from 'react';
import { SiteNav, SiteFooter, SiteIcon } from './ui.jsx';

const VISION = {
  headline: 'Every great mind started with a spark.',
  paragraph: "Many of the innovators and builders of our generation began with a spark: one moment that lit something in them and made all the difference. Tutagora wants to be that spark, so every child can go as far as their curiosity takes them. Every child's strengths look different, and that is never a weakness. So we meet each child at their own level of need and give them a plan made for them: learning that races ahead where they are ready, expert tutors to make that spark burn brighter, and, where the foundations need building, help given with the same enthusiasm and celebrated just as loudly.",
  promise: 'To challenge every child in the right way for their level, and to light matches we hope never go out.',
  signOff: "Here's to every spark,",
  from: 'The Tutagora team',
};

export default function Why({ onNavigate, onSignIn, user }) {
  return (
    <div className="tg vision">
      <header className="vhero">
        <SiteNav onNavigate={onNavigate} onSignIn={onSignIn} user={user} current="why" />
        <div className="in">
          <div className="kicker">Why Tutagora</div>
          <h1 className="display">{VISION.headline}</h1>
        </div>
      </header>

      <section className="sec"><div className="in vbody">
        <p className="vpara">{VISION.paragraph}</p>

        <div className="vpromise">
          <div className="kicker">The Tutagora promise</div>
          <p>{VISION.promise}</p>
        </div>

        <div className="vsignoff">
          <span>{VISION.signOff}</span>
          <b>{VISION.from}</b>
        </div>
      </div></section>

      <section className="sec tight"><div className="in vcta">
        <div className="row">
          <button type="button" className="btn" onClick={() => onNavigate('check')}>Take the free check <SiteIcon name="arrow" /></button>
          <button type="button" className="btn line" onClick={() => onNavigate('tutors')}>Find a tutor</button>
        </div>
      </div></section>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
