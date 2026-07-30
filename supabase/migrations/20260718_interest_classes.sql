-- ============================================================================
-- Interest-led classes ("clubs") — recess-style group classes organised by
-- interest area rather than school subject. A group class is now either:
--   class_type = 'academic'  → tied to a school subject (existing behaviour)
--   class_type = 'interest'  → a club in a `category` (chess, coding, art…)
-- `recurring` flags weekly clubs so the UI can say "every week".
-- ============================================================================

ALTER TABLE group_classes ADD COLUMN IF NOT EXISTS class_type TEXT NOT NULL DEFAULT 'academic';
ALTER TABLE group_classes ADD COLUMN IF NOT EXISTS category   TEXT;
ALTER TABLE group_classes ADD COLUMN IF NOT EXISTS age_range  TEXT;
ALTER TABLE group_classes ADD COLUMN IF NOT EXISTS recurring  BOOLEAN NOT NULL DEFAULT false;

-- Keep the type/category honest: interest classes must name a category;
-- academic classes must not.
ALTER TABLE group_classes DROP CONSTRAINT IF EXISTS group_classes_type_category_ck;
ALTER TABLE group_classes ADD CONSTRAINT group_classes_type_category_ck CHECK (
  (class_type = 'academic' AND category IS NULL) OR
  (class_type = 'interest' AND category IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_group_classes_category ON group_classes(category) WHERE class_type = 'interest';
