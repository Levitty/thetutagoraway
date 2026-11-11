#!/usr/bin/env python3
"""
Loads the CBC designs already read from KICD's own text (Tutagora/Build/curriculum-four-subjects-working/out,
read, checked and repaired 6 Nov 2026) into HOREB's curriculum format, outcomes only: curriculum/<subject>/g<N>.json.
No AI: the official text is copied as read. Skills, prerequisites and misconceptions come later, per subject
(Tuta Workspace/CURRICULUM_OTHER_SUBJECTS_PLAN.md, step 5); until then a sub-strand is taught by its outcomes.

    python3 scripts/build-curriculum-outcomes.py <drafts out/ folder> [<another out/ folder> ...]

The only change to KICD's wording: the list punctuation the design ends each outcome with ("...plants," / "...; and")
is dropped, as in the Grade 5 Mathematics map. A sub-strand whose second read left a question for a person keeps its
outcomes, marked 'kicd_read' instead of 'kicd_verified', with the question in design_notes.
"""
import json, re, sys, pathlib

# Learning areas the owner chose not to load (11 Nov 2026: "dont do islamic and hindu"): read, but never built here.
SKIP = {'ire', 'hre'}
SRCS = [pathlib.Path(a) for a in (sys.argv[1:] or ['out'])]
DST = pathlib.Path(__file__).resolve().parent.parent / 'curriculum'

def clean_outcome(t: str) -> str:
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'[\s,;.:]+(and|or)?[\s,;.:]*$', '', t, flags=re.I).strip()
    return t

def words(xs):
    return [re.sub(r'\s+', ' ', str(x)).strip() for x in (xs or []) if str(x).strip()]

total = {'files': 0, 'sub_strands': 0, 'outcomes': 0, 'kicd_read': 0}
for f in sorted(x for src in SRCS for x in src.glob('*/g*.json') if x.parent.name not in SKIP):
    d = json.loads(f.read_text())
    subs = []; place = {}
    for s in d['sub_strands']:
        status = 'kicd_verified' if s.get('verification', {}).get('status') == 'verified' else 'kicd_read'
        strand_no = int(float(s['strand_number']))
        # The design's own order within the strand (a numbered alternative such as "2.11.1 Swimming" or "Kenyan Indigenous
        # Games" shares its number, so the number alone is not unique).
        place[strand_no] = sub_no = place.get(strand_no, 0) + 1
        # A language design is taught theme by theme (English: each theme has a Listening, Reading, Grammar and Writing
        # block), so its order is the theme's, then the strand's; the theme is named in the topic.
        theme = s.get('theme') if isinstance(s.get('theme'), dict) else None
        if theme: place[('t', theme['number'], strand_no)] = t_no = place.get(('t', theme['number'], strand_no), 0) + 1
        notes = list(s.get('notes') or [])
        if status == 'kicd_read':
            total['kicd_read'] += 1
            notes += ['Second read left this for a person to confirm: ' + '; '.join(s['verification'].get('notes') or ['see the design']) + '.']
        # An optional sub-strand that offers two activities (Creative Arts: swimming or indigenous games) lists both sets of
        # outcomes, lettered a, b, c each time: the second set gets its own codes (".a_2").
        outs, used = [], {}
        for o in s['outcomes']:
            if not clean_outcome(o.get('text') or ''): continue   # a blank line read as an outcome (Creative Activities G2)
            code = o['code']
            used[code] = used.get(code, 0) + 1
            if used[code] > 1: code = code.rstrip('_') + '_' + str(used[code])
            # An outcome the word-for-word check could not match (a page break, a lost line position) is 'kicd_read' too.
            ost = 'kicd_read' if (o.get('verification') or {}).get('status') == 'needs_person' else status
            # A line the design prints without its letter (English G7 Spelling) takes the next letter, read, not verified.
            letter = o.get('letter') or ''
            if not re.match(r'^[a-z]$', letter):
                letter = chr(ord(outs[-1]['letter']) + 1) if outs else 'a'; ost = 'kicd_read'
            outs.append({'code': code, 'letter': letter, 'text': clean_outcome(o['text']), 'status': ost})
        subs.append({
            'code': s['code'], 'number': s['number'], 'strand': s['strand'],
            'sub_strand': s['title'] + (' (Theme ' + str(theme['number']) + ': ' + str(theme['title']).strip().capitalize() + ')' if theme else ''),
            'sequence': (int(theme['number']) * 100 + strand_no * 10 + min(t_no, 9)) if theme else strand_no * 100 + sub_no, 'lessons': s.get('lessons') or s.get('lessons_in_summary') or 0,
            'optional': bool(s.get('optional')),
            'content_topics': words(s.get('content')), 'learning_experiences': words(s.get('experiences')),
            'key_inquiry_questions': words(s.get('key_inquiry_questions')),
            'core_competences': '\n'.join(words(s.get('core_competencies'))), 'values': '\n'.join(words(s.get('values'))),
            'pcis': '\n'.join(words(s.get('pcis'))), 'links': '\n'.join(words(s.get('links_to_other_subjects'))),
            'design_notes': '\n'.join(words(notes)),
            'source': {k: s['source'].get(k) for k in ('grade_page', 'design', 'version', 'pages') if k in s.get('source', {})},
            'outcomes': outs, 'skills': [], 'misconceptions': [],
        })
        total['sub_strands'] += 1; total['outcomes'] += len(outs)
    design = d.get('design', {})
    out = {'framework': d.get('framework', 'cbc'), 'subject_key': d['subject_key'], 'grade': d['grade'],
           'source': 'KICD ' + str(design.get('title') or design.get('name') or f"Grade {d['grade']} {d['subject_key']}") + ', ' + str(design.get('version') or 'revised 2024') + ' (text layer)',
           'status': 'outcomes from KICD\'s text, word for word; skills, prerequisites and misconceptions not yet mapped',
           'totals': {'strands': len(d.get('strands', [])), 'sub_strands': len(subs), 'outcomes': sum(len(x['outcomes']) for x in subs),
                      'lessons': sum(x['lessons'] for x in subs), 'skills': 0, 'prerequisites': 0, 'misconceptions': 0},
           'sub_strands': subs}
    p = DST / d['subject_key'] / f"g{d['grade']}.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
    total['files'] += 1
print(json.dumps(total))
