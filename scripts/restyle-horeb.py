"""One-off restyle: move the old green (emerald) screens onto HOREB's design.

Applies docs/design-system.md's colour rules to the className strings inside the
named components (App.jsx) and whole files. Icons, Lottie animations and layout
are untouched. Usage:  python3 scripts/restyle-horeb.py [--dry]
"""
import re, sys

APP_COMPONENTS = [
    'Nav', 'AuthModal', 'StudentDashboard', 'StudentProgressModal', 'ReviewModal',
    'StudentProfileEditor', 'AccountSettings', 'TutorsPage', 'TutorProfileView',
    'PrivacyBanner', 'MomentumChipView', 'LoadingSpinner',
]
WHOLE_FILES = ['src/PaymentModal.jsx']

INDIGO, INDIGO_SOFT, INDIGO_LINE = '#6d6fcb', '#ecedfa', '#d5d6f3'
SAGE_SOFT, SAGE_LINE, SAGE_INK = '#eef4e7', '#cfe0bd', '#4f7233'


def restyle(cls: str) -> str:
    s = cls
    # Green gradient banners become HOREB's white card; their text goes dark.
    if 'from-emerald-500' in s:
        s = re.sub(r'bg-gradient-to-r from-emerald-500 to-emerald-600', 'bg-white border border-slate-200 shadow-sm', s)
        s = re.sub(r'(?<![\w/-])text-white(?![\w/-])', 'text-slate-900', s)
    # A white button that sat on a green banner becomes the amber primary button.
    s = re.sub(r'bg-white text-emerald-700', 'bg-amber-400 text-slate-900', s)
    # Primary buttons: green → amber with dark text.
    if re.search(r'(?<![\w:/-])bg-emerald-(500|600)(?![\w/-])', s):
        s = re.sub(r'(?<![\w:/-])bg-emerald-(500|600)(?![\w/-])', 'bg-amber-400', s)
        s = re.sub(r'(?<![\w/-])text-white(?![\w/-])', 'text-slate-900', s)
    s = re.sub(r'hover:bg-emerald-(500|600|700)', 'hover:bg-amber-300', s)
    # Success badges stay green, in HOREB's sage.
    badge = 'bg-emerald-50' in s or 'bg-emerald-100' in s
    s = re.sub(r'(?<![\w:-])bg-emerald-(50|100)(?![\w-])', f'bg-[{SAGE_SOFT}]', s)
    s = re.sub(r'border-emerald-(100|200|300)', f'border-[{SAGE_LINE}]', s)
    s = re.sub(r'hover:bg-emerald-(50|100)', f'hover:bg-[{INDIGO_SOFT}]', s)
    s = re.sub(r'hover:text-emerald-(600|700|800)', 'hover:text-[#5658b8]', s)
    s = re.sub(r'(?<![\w:-])text-emerald-(600|700|800)', f'text-[{SAGE_INK}]' if badge else f'text-[{INDIGO}]', s)
    s = re.sub(r'(?<![\w:-])text-emerald-(400|500)', 'text-[#5a7a3a]', s)
    s = re.sub(r'(?<![\w:-])text-emerald-100', 'text-slate-500', s)
    s = re.sub(r'focus:ring-emerald-500', f'focus:ring-[{INDIGO}]/30', s)
    s = re.sub(r'focus:border-emerald-500', f'focus:border-[{INDIGO}]', s)
    s = re.sub(r'(?<![\w:-])border-emerald-500', f'border-[{INDIGO}]', s)
    # On a (former) green banner.
    s = s.replace('bg-white/15', 'bg-[#eef0f2]').replace('bg-white/20', f'bg-[{INDIGO_SOFT}] text-[{INDIGO}]')
    # Blue and purple tags → HOREB indigo.
    s = re.sub(r'(?<![\w:-])bg-(blue|purple)-(50|100)(?![\w-])', f'bg-[{INDIGO_SOFT}]', s)
    s = re.sub(r'(?<![\w:-])text-(blue|purple)-(600|700)', f'text-[{INDIGO}]', s)
    s = re.sub(r'border-(blue|purple)-(100|200)', f'border-[{INDIGO_LINE}]', s)
    # Page ground and corners.
    if 'min-h-screen' in s:
        s = re.sub(r'(?<![\w:-])bg-slate-50(?![\w-])', 'bg-[#eef0f2]', s)
    s = re.sub(r'(?<![\w-])rounded-lg(?![\w-])', 'rounded-xl', s)
    # Cards: white, bordered, padded → HOREB card (rounded-2xl + soft shadow).
    if ('bg-white' in s and 'border' in s and re.search(r'(?<![\w-])p-[4-6](?![\w-])', s)
            and 'focus:' not in s and 'rounded-full' not in s):
        s = re.sub(r'(?<![\w-])rounded-xl(?![\w-])', 'rounded-2xl', s)
        if 'shadow' not in s:
            if s.startswith('"'):
                s = s[:-1] + ' shadow-sm"'
            elif s.startswith('{`'):
                s = s[:-2] + ' shadow-sm`}'
    # Headings: HOREB titles are extrabold and slightly tight.
    s = re.sub(r'(text-(?:xl|2xl|3xl)) font-bold', r'\1 font-extrabold tracking-tight', s)
    return s


CLASS_RE = re.compile(r'className=(\"[^\"]*\"|\{`[^`]*`\})')


def restyle_block(text: str) -> str:
    return CLASS_RE.sub(lambda m: 'className=' + restyle(m.group(1)), text)


def main(dry=False):
    changed = 0
    src = open('src/App.jsx', encoding='utf-8').read().split('\n')
    starts = [(i, m.group(1)) for i, l in enumerate(src) if (m := re.match(r'^(?:const|function) ([A-Z]\w+)', l))]
    starts.append((len(src), 'END'))
    for (a, name), (b, _) in zip(starts, starts[1:]):
        if name in APP_COMPONENTS:
            before = '\n'.join(src[a:b])
            after = restyle_block(before)
            if after != before:
                changed += 1
                src[a:b] = after.split('\n')
                print(f'restyled {name}')
    if not dry:
        open('src/App.jsx', 'w', encoding='utf-8').write('\n'.join(src))
    for f in WHOLE_FILES:
        t = open(f, encoding='utf-8').read()
        n = restyle_block(t)
        if n != t:
            changed += 1
            print(f'restyled {f}')
            if not dry:
                open(f, 'w', encoding='utf-8').write(n)
    print(f'{changed} blocks changed')


if __name__ == '__main__':
    main(dry='--dry' in sys.argv)
