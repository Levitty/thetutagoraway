#!/usr/bin/env python3
"""
Adds KICD's Suggested Assessment Rubrics to HOREB's curriculum maps (curriculum/<subject>/g<N>.json), copied as read from the
designs' own text (no AI), and links each official outcome to the rubric indicator that covers it.

    python3 scripts/build-curriculum-rubrics.py <drafts out/ folder> [<another out/ folder> ...] [--maths-g5 <asm2_g5.json>]
    python3 scripts/build-curriculum-rubrics.py --check          # read-only: verifies what is in curriculum/

The KICD rubric is per STRAND INDICATOR, not per outcome ("Ability to listen actively to a variety of oral texts" covers thirteen
Listening and Speaking sub-strands), with four descriptors: Exceeds, Meets, Approaches, Below expectations = EE, ME, AE, BE.
What is written, per file:
  rubrics: [{code, heading, strand, covers: [sub-strand codes], page, indicators: [{code, indicator, levels: {EE, ME, AE, BE}, page, status}]}]
  sub_strands[].rubric_indicators: [indicator codes that cover the sub-strand]
  sub_strands[].outcomes[].indicator: the one indicator an outcome is judged against (see below), absent when none fits.
Linking an outcome to an indicator: the only indicator of the sub-strand's rubric (match 'only'), else the indicator whose words
share most with the outcome and the sub-strand's title (match 'words', needs two shared word stems and a clear winner). An outcome
no indicator fits is left without one: a report card then shows no descriptor, never a wrong one. Counts only are printed.
Grade 5 Mathematics carries its rubric per sub-strand (asm2_g5.json, read earlier). Not loaded on the owner's word (11 Nov 2026):
Islamic and Hindu Religious Education (ire, hre).
"""
import json, re, sys, pathlib

SKIP = {'ire', 'hre'}
LV = (('exceeds', 'EE'), ('meets', 'ME'), ('approaches', 'AE'), ('below', 'BE'))
DST = pathlib.Path(__file__).resolve().parent.parent / 'curriculum'
STOP = set('the a an and or of to in on for with by at from as is are be can that this these those it its into their they them his her use using various variety different situations real life learner learners ability able appreciate state outline describe explain identify discuss demonstrate determine give list name show make apply carry out examine analyse assess evaluate recommend establish create design develop importance ways possible solutions challenges facing main day daily should would also about how what why when which where more other some any each both such than then there here very well good using used uses kuweza kutambua kueleza kutumia kuelezea kutaja kujadili'.split())

def clean(t): return re.sub(r'\s+', ' ', str(t or '')).strip()
def stems(t): return {w[:5] for w in re.findall(r"[a-z]+", t.lower()) if len(w) > 2 and w not in STOP}

def load_files():
    return {f: json.loads(f.read_text()) for f in sorted(DST.glob('*/g*.json'))}

def nl_of(f): return '\n' if f.read_text().endswith('\n') else ''

def write(f, d, nl):
    f.write_text(json.dumps(d, ensure_ascii=False, indent=1) + nl)

def indicator(row, code, page=None):
    lv = {k: clean((row.get('levels') or row).get(n)) for n, k in LV}
    ver = (row.get('verification') or {}).get('status')
    return {'code': code, 'indicator': clean(row.get('indicator')), 'levels': lv, 'page': row.get('page') or (row.get('source') or {}).get('page') or page,
            'status': 'kicd_verified' if ver in (None, 'verified') else 'kicd_read'}

def link(d):
    """Sub-strand lists and outcome links from d['rubrics']; returns counts."""
    by = {}
    for r in d.get('rubrics', []):
        for c in r['covers']: by.setdefault(c, []).extend(r['indicators'])
    n = {'outcomes': 0, 'linked': 0, 'only': 0, 'words': 0}
    for s in d['sub_strands']:
        inds = by.get(s['code'], [])
        s.pop('rubric_indicators', None)
        if inds: s['rubric_indicators'] = [i['code'] for i in inds]
        title = stems(re.sub(r'\(Theme.*', '', s['sub_strand']))
        for o in s['outcomes']:
            o.pop('indicator', None); n['outcomes'] += 1
            if not inds: continue
            pick = how = None
            if len(inds) == 1: pick, how = inds[0], 'only'
            else:
                # Only a clear winner on content words (not the verbs every outcome and indicator share): at least three shared word
                # stems (two when the indicator's words are all in the outcome), and more than any other indicator of the sub-strand. Otherwise none: no descriptor beats a wrong one.
                ot = stems(o['text'])
                def score(i):
                    it = stems(i['indicator']); sh = len(ot & it)
                    return (sh if (sh >= 3 or (sh >= 2 and it <= ot)) else 0, len(title & it), i['code'])
                sc = sorted((score(i) for i in inds), reverse=True)
                if sc[0][0] and (len(sc) == 1 or sc[0][:2] > sc[1][:2]):
                    pick, how = next(i for i in inds if i['code'] == sc[0][2]), 'words'
            if pick: o['indicator'] = pick['code']; n['linked'] += 1; n[how] += 1
    return n

def build(srcs, maths):
    files = load_files(); seen = set(); skipped = []; tot = {'files': 0, 'tables': 0, 'indicators': 0, 'outcomes': 0, 'linked': 0, 'only': 0, 'words': 0}
    for src in srcs:
        for f in sorted(src.glob('*/g*.json')):
            if f.parent.name in SKIP: continue
            r = json.loads(f.read_text()); key = (r['subject_key'], int(r['grade']))
            dest = DST / key[0] / f'g{key[1]}.json'
            if dest not in files: print('no HOREB map for', key); continue
            assert key not in seen, ('two sources for', key); seen.add(key)
            d = files[dest]; codes = {s['code'] for s in d['sub_strands']}
            tables = []
            for t in r.get('rubrics') or []:
                inds = []
                for x in t['rows']:
                    i = indicator(x, x['code'], t.get('page'))
                    # a parser row the design's table did not fill in all four columns (a header line, a split cell) is not a rubric row
                    if i['indicator'] and all(i['levels'].values()): inds.append(i)
                    else: skipped.append(x['code'])
                cov = [c for c in t['covers'] if c in codes]
                if inds and cov: tables.append({'code': t['code'], 'heading': clean(t['heading']), 'strand': next((s['strand'] for s in d['sub_strands'] if s['code'] == cov[0]), ''), 'covers': cov, 'page': t.get('page'), 'indicators': inds})
            d['rubrics'] = tables
    if maths and DST.joinpath('mathematics/g5.json') in files:
        d = files[DST / 'mathematics/g5.json']; m = json.loads(pathlib.Path(maths).read_text()); tables = []
        norm = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())
        code_of = {norm(s['sub_strand']): s['code'] for s in d['sub_strands']}   # the map's own code (the design's title can differ in spelling)
        for s in m['subs']:
            s = dict(s, code='MATH.G5.' + s['code'].split('.', 2)[1] + '.' + s['code'].split('.', 2)[2])
            real = code_of.get(norm(s['sub_strand']))
            if not real: print('no map sub-strand for', s['sub_strand']); continue
            s['code'] = real
            inds = [indicator(x, f"MATH.G5.RUBRIC.{real.split('.', 2)[2]}.{i + 1}") for i, x in enumerate(s.get('rubric') or []) if clean(x.get('indicator'))]
            if inds: tables.append({'code': 'MATH.G5.RUBRIC.' + real.split('.', 2)[2], 'heading': 'Suggested Assessment Rubric: ' + s['sub_strand'], 'strand': s['strand'], 'covers': [real], 'page': inds[0]['page'], 'indicators': inds})
        d['rubrics'] = tables; seen.add(('mathematics', 5))
    for f, d in files.items():
        if not d.get('rubrics'):
            # a source with no rubric table for this file (Grades 1 to 3 English, Mathematics): no key, nothing to write
            if d.pop('rubrics', None) is not None: write(f, d, nl_of(f))
            continue
        n = link(d); tot['files'] += 1; tot['tables'] += len(d['rubrics']); tot['indicators'] += sum(len(t['indicators']) for t in d['rubrics'])
        for k in ('outcomes', 'linked', 'only', 'words'): tot[k] += n[k]
        write(f, d, nl_of(f))
    tot['rows_left_out'] = len(skipped)
    print(json.dumps(tot))

def check():
    bad = []; n = {'files': 0, 'indicators': 0, 'linked': 0, 'outcomes': 0, 'substrands_with': 0, 'substrands': 0}
    for f, d in load_files().items():
        subs = {s['code']: s for s in d['sub_strands']}; ind = {}
        n['substrands'] += len(subs)
        for t in d.get('rubrics', []):
            for c in t['covers']:
                if c not in subs: bad.append(f'{f.name}: {t["code"]} covers unknown {c}')
            for i in t['indicators']:
                n['indicators'] += 1
                if i['code'] in ind: bad.append(f'{f.parent.name}/{f.name}: duplicate indicator {i["code"]}')
                ind[i['code']] = i
                if not i['indicator']: bad.append(f'{i["code"]}: no indicator text')
                if set(i['levels']) != {'EE', 'ME', 'AE', 'BE'} or not all(i['levels'].values()): bad.append(f'{i["code"]}: a descriptor is empty')
                if i['status'] not in ('kicd_verified', 'kicd_read'): bad.append(f'{i["code"]}: status')
        if d.get('rubrics'): n['files'] += 1
        for s in subs.values():
            ri = s.get('rubric_indicators', [])
            if ri: n['substrands_with'] += 1
            for c in ri:
                if c not in ind: bad.append(f'{s["code"]}: rubric_indicators names unknown {c}')
            for o in s['outcomes']:
                n['outcomes'] += 1
                if 'indicator' in o:
                    n['linked'] += 1
                    if o['indicator'] not in ri: bad.append(f'{o["code"]}: indicator not one of its sub-strand\'s')
    print(json.dumps(n)); print('FAIL' if bad else 'PASS'); [print(' ', b) for b in bad[:40]]
    if bad: print(len(bad), 'problems'); sys.exit(1)

if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--check']: check()
    else:
        maths = a[a.index('--maths-g5') + 1] if '--maths-g5' in a else None
        if maths: del a[a.index('--maths-g5'):a.index('--maths-g5') + 2]
        build([pathlib.Path(x) for x in a], maths)
