// ============================================================================
// WHO SEES WHAT. One function decides every person's menu; the frame only draws
// it. Pure, so the rules can be tested: a tutor is never offered Find a tutor,
// a child's handed-over device never gets a menu at all (see App.jsx).
//
// An item: { id, label, short, icon, page, section, locked, action }
//   page + section say where it goes; action is 'settings' or 'signout'.
// A menu: { sections: [{ label, items }], foot: [items], bar: [ids] }
//   bar names the items on the phone bar. Anything else goes under More.
// Hiding a menu item never changes access: routes keep their own checks.
// ============================================================================
const item = (id, label, icon, page, section = null, extra = {}) => ({ id, label, short: extra.short || label, icon, page, section, ...extra });

const SETTINGS = { id: 'settings', label: 'Settings', short: 'Settings', icon: 'settings', action: 'settings' };
const SIGN_OUT = { id: 'signout', label: 'Sign out', short: 'Sign out', icon: 'logout', action: 'signout' };
const ADMIN = item('admin', 'Admin', 'shield', 'admin');

/** The teaching section: the same for a tutor and for anyone who runs classes. */
export const teachingSection = () => ({
  label: 'Teaching',
  items: [
    item('classes', 'Classes', 'users', 'classroom'),
    item('practice', 'Set practice', 'list', 'classroom', 'practice', { short: 'Practice' }),
    item('rocket', 'Rocket Challenge', 'rocket', 'rocket', null, { short: 'Rocket' }),
  ],
});

/** Signed out, on the teacher demo: the teaching screens and nothing else. */
export const teachingMenu = () => ({ sections: [teachingSection()], foot: [], bar: ['classes', 'practice', 'rocket'] });

/**
 * @param {object} who
 *   kind: 'tutor' | 'learner' | 'parent' (from the account, see personKind)
 *   approved: tutor has passed review; the tutoring sections stay locked until then
 *   hasClasses: this account runs at least one class
 *   isAdmin, native: as named
 */
export function menuFor({ kind, approved = false, hasClasses = false, isAdmin = false, native = false } = {}) {
  const foot = [...(isAdmin ? [ADMIN] : []), SETTINGS, SIGN_OUT];

  if (kind === 'tutor') {
    const locked = !approved;
    return {
      sections: [
        { items: [item('overview', 'Home', 'home', 'dashboard', 'overview')] },
        {
          label: 'Tutoring',
          items: [
            item('schedule', 'Schedule', 'cal', 'dashboard', 'schedule', { locked }),
            item('students', 'Students', 'student', 'dashboard', 'students', { locked }),
            item('groupClasses', 'Group classes', 'users', 'dashboard', 'groupClasses', { locked, short: 'Groups' }),
            item('earnings', 'Earnings', 'wallet', 'dashboard', 'earnings', { locked }),
          ],
        },
        teachingSection(),
        {
          label: 'Mine',
          items: [
            item('profile', 'Profile', 'user', 'dashboard', 'profile'),
            item('spreadsheet', 'Spreadsheet', 'table', 'spreadsheet'),
          ],
        },
      ],
      foot,
      bar: ['overview', 'schedule', 'classes', 'earnings'],
    };
  }

  const teaching = hasClasses ? [teachingSection()] : [];

  if (kind === 'learner') {
    return {
      sections: [
        { items: [
          item('overview', 'Home', 'home', 'ai', 'overview'),
          item('lessons', 'Lessons', 'book', 'dashboard', 'lessons'),
          item('writing', 'Writing', 'pen', 'writing'),
          item('rocket', 'Rocket Challenge', 'rocket', 'rocket', null, { short: 'Rocket' }),
        ] },
        { label: 'Find', items: [
          item('tutors', 'Find a tutor', 'search', 'tutors', null, { short: 'Tutors' }),
          item('clubs', 'Clubs', 'heart', 'clubs'),
        ] },
        ...teaching,
      ],
      foot,
      bar: ['overview', 'lessons', 'writing', 'tutors'],
    };
  }

  // A parent, or an account that has not said which it is.
  return {
    sections: [
      { items: [
        item('home', 'Home', 'home', native ? 'native-home' : 'dashboard'),
        item('family', 'Goals and reports', 'target', 'family', null, { short: 'Family' }),
        item('tutors', 'Find a tutor', 'search', 'tutors', null, { short: 'Tutors' }),
        item('clubs', 'Clubs', 'heart', 'clubs'),
      ] },
      ...teaching,
    ],
    foot,
    bar: ['home', 'family', 'tutors', 'clubs'],
  };
}

/** Which menu an account gets. A tutor is a tutor; `student` is the learner's own account. */
export function personKind(profile, accountType) {
  if (profile?.role === 'tutor') return 'tutor';
  if (accountType === 'student') return 'learner';
  return 'parent';
}

/** Flat list of a menu's items, in order. */
export const allItems = (menu) => [...menu.sections.flatMap(s => s.items), ...(menu.foot || [])];

/** The phone bar: the named items, then More if anything is left over. */
export function barItems(menu) {
  const all = allItems(menu);
  const named = (menu.bar || []).map(id => all.find(i => i.id === id)).filter(Boolean);
  const rest = all.filter(i => !named.includes(i));
  return { named, rest };
}
