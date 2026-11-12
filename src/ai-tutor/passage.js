// The paragraphs of a comprehension passage: separated by a blank line. Plain JS so tests and the phone page share the rule.
export const passageParagraphs = (text) => String(text || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
