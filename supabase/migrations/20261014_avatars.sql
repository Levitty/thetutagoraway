-- Sign-up avatars: the figure a learner picks for themselves.
--
-- This deliberately does NOT reuse profiles.avatar_url. That column holds a real
-- uploaded photograph, and a dozen places render it straight into <img src>; a
-- preset id parked there would be requested as a URL and show a broken image on
-- every tutor card, review and message thread. So the pick gets its own column
-- and the two can coexist: an uploaded photo still wins, the preset is what a
-- learner who never uploads one sees, and initials remain the last resort.
--
-- Free text rather than an enum or a CHECK against the known ids: the set of
-- avatars is drawn in the app (src/avatars/Avatars.jsx) and will grow, and a
-- constraint here would mean a migration every time an illustration is added,
-- with old rows failing validation if one is ever retired. The app treats an
-- unknown id as "no pick" and falls back, so a stale value is harmless.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Each child on a parent's roster picks their own. HOREB is used BY the child,
-- so this is the avatar that actually shows up in a lesson; the parent's own
-- pick on profiles is for the account that books and pays.
ALTER TABLE children ADD COLUMN IF NOT EXISTS avatar TEXT;

COMMENT ON COLUMN profiles.avatar IS
  'Preset avatar id from src/avatars/Avatars.jsx (e.g. b1, g2). An uploaded avatar_url takes precedence.';
COMMENT ON COLUMN children.avatar IS
  'Preset avatar id from src/avatars/Avatars.jsx (e.g. b1, g2), chosen by the learner.';

-- No RLS changes are needed. profiles and children already carry policies that
-- scope a row to its owner, and adding a column does not widen them.
