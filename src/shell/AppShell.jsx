// ============================================================================
// THE FRAME. Every screen a signed-in person uses sits in this one component:
// one sidebar from 900px up, one plain solid bottom bar on a phone, one header.
// What differs between people is only the menu (menus.js).
//
// App.jsx provides the person through ShellContext. A child's handed-over device
// provides nothing, so no menu, no account and no way out can appear there.
// ============================================================================
import React, { createContext, useContext, useState } from 'react';
import { allItems, barItems } from './menus.js';
import { TIcon } from './icons.jsx';
import './shell.css';

export const ShellContext = createContext(null);
export const useShell = () => useContext(ShellContext);
/** True inside the frame: a screen drops its own header and page background. */
const InFrame = createContext(false);
export const useInFrame = () => useContext(InFrame);

const initials = (name) => String(name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
const dayLabel = (d = new Date()) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

const NavButton = ({ item, active, onPick }) => (
  <button type="button" className={`hb-nav${active ? ' hb-on' : ''}`} disabled={!!item.locked}
    title={item.locked ? 'Available after your profile is approved' : undefined}
    aria-current={active ? 'page' : undefined} onClick={() => onPick(item)}>
    <span className="hb-tile"><TIcon name={item.icon} /></span>{item.label}
    {item.count > 0 && <span className="hb-count">{item.count}</span>}
  </button>
);

/**
 * @param active   id of the selected menu item
 * @param title    the page's name in the header
 * @param menu     replaces the person's menu (a screen with its own sections, such as Admin)
 * @param onItem   a screen handling its own items: return true when handled
 * @param local    a section the screen adds on top ({ label, items }), such as a learner's tabs
 * @param extra    goes in the sidebar under the menu (My classes)
 * @param brand    replaces the H mark
 * @param tools    small controls: sidebar foot on a laptop, header on a phone
 * @param note     a pill in the header (demo data)
 * @param warm     the child's frame
 */
export function AppShell({ active, title, menu: own, onItem, local, extra, brand, tools, note, warm = false, onBack, children }) {
  const ctx = useShell();
  const [moreOpen, setMoreOpen] = useState(false);
  const base = own || ctx?.menu || { sections: [], foot: [], bar: [] };
  // A screen's own section takes the place of the same item in the person's menu.
  const localIds = new Set((local?.items || []).map(i => i.id));
  const menu = local ? {
    sections: [local, ...base.sections.map(s => ({ ...s, items: s.items.filter(i => !localIds.has(i.id)) })).filter(s => s.items.length)],
    foot: base.foot || [],
    bar: local.bar ? local.bar : base.bar,
  } : base;
  const pick = (it) => {
    setMoreOpen(false);
    if (onItem && onItem(it)) return;
    if (ctx) ctx.go(it);
  };
  const { named, rest } = barItems(menu);
  const activeInMore = rest.some(i => i.id === active);
  const person = ctx?.person;
  const homeItem = allItems(menu)[0];
  const mark = brand || <span className="hb-mk">H</span>;
  return (
    <InFrame.Provider value>
      <div className={`tt hb-shell app-shell${warm ? ' hb-warm' : ''}`}>
        <aside className="hb-side" aria-label="Menu">
          <button type="button" className="hb-brand" onClick={() => homeItem && pick(homeItem)}>{mark}HOREB</button>
          {menu.sections.map((s, i) => (
            <React.Fragment key={s.label || i}>
              {s.label && <div className="hb-lbl">{s.label}</div>}
              {s.items.map(it => <NavButton key={it.id} item={it} active={active === it.id} onPick={pick} />)}
            </React.Fragment>
          ))}
          {extra && <><hr />{extra}</>}
          <div className="hb-foot">
            {tools}
            {(menu.foot || []).map(it => <NavButton key={it.id} item={it} active={active === it.id} onPick={pick} />)}
          </div>
        </aside>
        <main className="hb-main app-scroll">
          <header className="hb-top">
            {onBack && <button type="button" className="hb-round" onClick={onBack} aria-label="Back"><TIcon name="left" /></button>}
            <span className="hb-brandm">{mark}</span>
            {title && <h1 className="hb-title">{title}</h1>}
            {note && <span className="tt-pill tt-am">{note}</span>}
            <div className="hb-right">
              <div className="hb-chip"><TIcon name="cal" />{dayLabel()}</div>
              {ctx?.headerEnd}
              {person && (
                <button type="button" className="hb-me" onClick={ctx.openSettings} aria-label="Settings">
                  <span className="hb-av">{person.avatar || initials(person.name)}</span>
                  <div><b>{person.name}</b>{person.line && <small>{person.line}</small>}</div>
                </button>
              )}
            </div>
          </header>
          {children}
        </main>
        {moreOpen && (
          <div className="hb-more">
            <h2>More</h2>
            <div className="hb-list">
              {rest.map(it => <NavButton key={it.id} item={it} active={active === it.id} onPick={pick} />)}
            </div>
            {tools && <div className="hb-list">{tools}</div>}
          </div>
        )}
        {named.length + rest.length > 0 && (
          <nav className="hb-tabbar" aria-label="Menu">
            {named.map(it => (
              <button key={it.id} type="button" disabled={!!it.locked} className={!moreOpen && active === it.id ? 'hb-on' : ''} aria-current={active === it.id ? 'page' : undefined} onClick={() => pick(it)}>
                <span className="hb-bar-tile"><TIcon name={it.icon} /></span>{it.short || it.label}
              </button>
            ))}
            {rest.length > 0 && (
              <button type="button" className={moreOpen || activeInMore ? 'hb-on' : ''} aria-expanded={moreOpen} onClick={() => setMoreOpen(o => !o)}>
                <span className="hb-bar-tile"><TIcon name="more" /></span>More
              </button>
            )}
          </nav>
        )}
      </div>
    </InFrame.Provider>
  );
}

/** A class in the sidebar's My classes list. */
export const ClassLink = ({ code, name, size, current, onClick }) => (
  <button type="button" className="hb-cls" onClick={onClick} aria-current={current ? 'page' : undefined}>
    <span className="hb-code">{code}</span>
    <span><b>{name}</b>{size != null && <small>{size} {size === 1 ? 'learner' : 'learners'}</small>}</span>
  </button>
);

/** The bar on its own, for the native app's screens that have no frame yet. */
export const TabBar = ({ items, active, onPick, native = false }) => (
  <nav className={`hb-tabbar${native ? ' hb-native' : ''}`} aria-label="Menu">
    {items.map(it => (
      <button key={it.id} type="button" className={active === it.id ? 'hb-on' : ''} aria-current={active === it.id ? 'page' : undefined} onClick={() => onPick(it)}>
        <span className="hb-bar-tile"><TIcon name={it.icon} /></span>{it.short || it.label}
      </button>
    ))}
  </nav>
);
