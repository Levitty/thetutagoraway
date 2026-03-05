import React, { useState, useEffect, useMemo } from 'react';

// ============================================================================
// TUTAGORA ADAPTIVE AI TUTOR - COMPLETE COMPONENT
// ============================================================================

// ==================== SKILLS DATA ====================

const SKILLS = {
  G6_PLACE_VALUE: { id: 'G6_PLACE_VALUE', name: 'Place Value (Millions)', grade: 6, strand: 'Numbers', prerequisites: [], minProblems: 5, masteryThreshold: 0.85, weight: 3 },
  G6_OPERATIONS: { id: 'G6_OPERATIONS', name: 'Basic BODMAS', grade: 6, strand: 'Numbers', prerequisites: [], minProblems: 6, masteryThreshold: 0.85, weight: 4 },
  G6_FRACTIONS: { id: 'G6_FRACTIONS', name: 'Fractions (Add/Subtract)', grade: 6, strand: 'Numbers', prerequisites: [], minProblems: 6, masteryThreshold: 0.85, weight: 4 },
  G6_DECIMALS: { id: 'G6_DECIMALS', name: 'Decimals (Add/Subtract)', grade: 6, strand: 'Numbers', prerequisites: [], minProblems: 5, masteryThreshold: 0.85, weight: 3 },
  G6_SQUARES: { id: 'G6_SQUARES', name: 'Squares (up to 100)', grade: 6, strand: 'Numbers', prerequisites: [], minProblems: 5, masteryThreshold: 0.90, weight: 2 },
  M7_001: { id: 'M7_001', name: 'Place Value (Hundred Millions)', grade: 7, strand: 'Numbers', prerequisites: ['G6_PLACE_VALUE'], minProblems: 5, masteryThreshold: 0.85, weight: 2 },
  M7_005: { id: 'M7_005', name: 'Prime vs Composite', grade: 7, strand: 'Numbers', prerequisites: [], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_006: { id: 'M7_006', name: 'BODMAS (Advanced)', grade: 7, strand: 'Numbers', prerequisites: ['G6_OPERATIONS'], minProblems: 6, masteryThreshold: 0.85, weight: 4, critical: true },
  M7_009: { id: 'M7_009', name: 'Divisibility Tests', grade: 7, strand: 'Numbers', prerequisites: ['M7_005'], minProblems: 8, masteryThreshold: 0.85, weight: 4 },
  M7_010: { id: 'M7_010', name: 'Prime Factorization', grade: 7, strand: 'Numbers', prerequisites: ['M7_009'], minProblems: 6, masteryThreshold: 0.85, weight: 5, critical: true },
  M7_011: { id: 'M7_011', name: 'GCD', grade: 7, strand: 'Numbers', prerequisites: ['M7_010'], minProblems: 6, masteryThreshold: 0.85, weight: 4 },
  M7_012: { id: 'M7_012', name: 'LCM', grade: 7, strand: 'Numbers', prerequisites: ['M7_010'], minProblems: 6, masteryThreshold: 0.85, weight: 4 },
  M7_014: { id: 'M7_014', name: 'Comparing Fractions', grade: 7, strand: 'Numbers', prerequisites: ['G6_FRACTIONS'], minProblems: 5, masteryThreshold: 0.85, weight: 3 },
  M7_015: { id: 'M7_015', name: 'Adding Fractions (Unlike)', grade: 7, strand: 'Numbers', prerequisites: ['M7_014', 'M7_012'], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_017: { id: 'M7_017', name: 'Multiplying Fractions', grade: 7, strand: 'Numbers', prerequisites: ['M7_014'], minProblems: 6, masteryThreshold: 0.85, weight: 4, critical: true },
  M7_018: { id: 'M7_018', name: 'Reciprocals', grade: 7, strand: 'Numbers', prerequisites: ['M7_017'], minProblems: 5, masteryThreshold: 0.90, weight: 2 },
  M7_019: { id: 'M7_019', name: 'Dividing Fractions', grade: 7, strand: 'Numbers', prerequisites: ['M7_017', 'M7_018'], minProblems: 6, masteryThreshold: 0.85, weight: 4, critical: true },
  M7_021: { id: 'M7_021', name: 'Decimal Place Value', grade: 7, strand: 'Numbers', prerequisites: ['G6_DECIMALS'], minProblems: 5, masteryThreshold: 0.85, weight: 2 },
  M7_022: { id: 'M7_022', name: 'Multiplying Decimals', grade: 7, strand: 'Numbers', prerequisites: ['M7_021'], minProblems: 6, masteryThreshold: 0.85, weight: 4, critical: true },
  M7_023: { id: 'M7_023', name: 'Dividing Decimals', grade: 7, strand: 'Numbers', prerequisites: ['M7_022'], minProblems: 6, masteryThreshold: 0.85, weight: 4 },
  M7_024: { id: 'M7_024', name: 'Squares (Extended)', grade: 7, strand: 'Numbers', prerequisites: ['G6_SQUARES', 'M7_017', 'M7_022'], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_025: { id: 'M7_025', name: 'Square Roots', grade: 7, strand: 'Numbers', prerequisites: ['M7_024', 'M7_010'], minProblems: 6, masteryThreshold: 0.85, weight: 4, critical: true },
  M7_026: { id: 'M7_026', name: 'Forming Expressions', grade: 7, strand: 'Algebra', prerequisites: ['M7_006'], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_027: { id: 'M7_027', name: 'Simplifying Expressions', grade: 7, strand: 'Algebra', prerequisites: ['M7_026'], minProblems: 6, masteryThreshold: 0.85, weight: 4 },
  M7_028: { id: 'M7_028', name: 'Forming Equations', grade: 7, strand: 'Algebra', prerequisites: ['M7_027'], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_029: { id: 'M7_029', name: 'Solving Equations', grade: 7, strand: 'Algebra', prerequisites: ['M7_028'], minProblems: 8, masteryThreshold: 0.85, weight: 5, critical: true },
  M7_034: { id: 'M7_034', name: 'Pythagorean Theorem', grade: 7, strand: 'Measurements', prerequisites: ['M7_024', 'M7_025'], minProblems: 6, masteryThreshold: 0.85, weight: 5, critical: true },
  M7_035: { id: 'M7_035', name: 'Length Conversions', grade: 7, strand: 'Measurements', prerequisites: [], minProblems: 6, masteryThreshold: 0.85, weight: 2 },
  M7_036: { id: 'M7_036', name: 'Perimeter', grade: 7, strand: 'Measurements', prerequisites: ['M7_035'], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_037: { id: 'M7_037', name: 'Circumference', grade: 7, strand: 'Measurements', prerequisites: ['M7_022', 'M7_036'], minProblems: 6, masteryThreshold: 0.85, weight: 4, critical: true },
  M7_039: { id: 'M7_039', name: 'Area of Rectangles', grade: 7, strand: 'Measurements', prerequisites: ['M7_022'], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_040: { id: 'M7_040', name: 'Area of Circles', grade: 7, strand: 'Measurements', prerequisites: ['M7_037', 'M7_024'], minProblems: 6, masteryThreshold: 0.85, weight: 4, critical: true },
  M7_043: { id: 'M7_043', name: 'Volume of Cuboids', grade: 7, strand: 'Measurements', prerequisites: ['M7_039'], minProblems: 6, masteryThreshold: 0.85, weight: 3 },
  M7_044: { id: 'M7_044', name: 'Volume of Cylinders', grade: 7, strand: 'Measurements', prerequisites: ['M7_040', 'M7_043'], minProblems: 6, masteryThreshold: 0.85, weight: 4 },
  M7_046: { id: 'M7_046', name: 'Speed, Distance, Time', grade: 7, strand: 'Measurements', prerequisites: ['M7_035', 'M7_023'], minProblems: 6, masteryThreshold: 0.85, weight: 5, critical: true },
};

// ==================== HELPERS ====================

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const primeFactorize = n => { const f = []; let d = 2; while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; } return f; };

// ==================== PROBLEM GENERATORS ====================

const generateProblem = (skillId) => {
  const G = {
    G6_PLACE_VALUE: () => {
      const num = rand(1000000, 9999999);
      const pos = ['millions', 'hundred thousands', 'ten thousands'][rand(0, 2)];
      const mults = { millions: 1000000, 'hundred thousands': 100000, 'ten thousands': 10000 };
      const digit = Math.floor(num / mults[pos]) % 10;
      return { question: `What digit is in the ${pos} place of ${num.toLocaleString()}?`, answer: digit.toString() };
    },
    G6_OPERATIONS: () => {
      const t = [
        () => { const a = rand(5, 15), b = rand(2, 8), c = rand(2, 5); return { q: `${a} + ${b} × ${c}`, a: a + b * c }; },
        () => { const a = rand(20, 40), b = rand(2, 5), c = rand(2, 5); return { q: `${a} - ${b} × ${c}`, a: a - b * c }; },
        () => { const a = rand(3, 10), b = rand(2, 8), c = rand(2, 4); return { q: `(${a} + ${b}) × ${c}`, a: (a + b) * c }; },
      ][rand(0, 2)]();
      return { question: `Calculate: ${t.q}`, answer: t.a.toString() };
    },
    G6_FRACTIONS: () => {
      const d = [2, 3, 4, 5, 6][rand(0, 4)], n1 = rand(1, d - 1), n2 = rand(1, d - 1);
      const sum = n1 + n2, g = gcd(sum, d);
      const ans = sum >= d ? (sum % d === 0 ? `${sum / d}` : `${Math.floor(sum / d)} ${(sum % d) / gcd(sum % d, d)}/${d / gcd(sum % d, d)}`) : `${sum / g}/${d / g}`;
      return { question: `${n1}/${d} + ${n2}/${d} = ?`, answer: ans, accepts: [ans, `${sum}/${d}`] };
    },
    G6_DECIMALS: () => {
      const a = (rand(10, 99) / 10).toFixed(1), b = (rand(10, 50) / 10).toFixed(1);
      return { question: `${a} + ${b} = ?`, answer: (parseFloat(a) + parseFloat(b)).toFixed(1) };
    },
    G6_SQUARES: () => { const n = rand(2, 12); return { question: `${n}² = ?`, answer: (n * n).toString() }; },
    M7_001: () => {
      const num = rand(100000000, 999999999);
      const pos = ['hundred millions', 'ten millions'][rand(0, 1)];
      const mult = pos === 'hundred millions' ? 100000000 : 10000000;
      return { question: `What digit is in the ${pos} place of ${num.toLocaleString()}?`, answer: (Math.floor(num / mult) % 10).toString() };
    },
    M7_005: () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
      const isPrime = Math.random() > 0.5;
      const n = isPrime ? primes[rand(0, primes.length - 1)] : composites[rand(0, composites.length - 1)];
      return { question: `Is ${n} prime? (yes/no)`, answer: isPrime ? 'yes' : 'no' };
    },
    M7_006: () => {
      const t = [
        () => { const a = rand(2, 10), b = rand(2, 8), c = rand(2, 5); return { q: `${a} + ${b} × ${c}`, a: a + b * c }; },
        () => { const a = rand(10, 30), b = rand(2, 5), c = rand(2, 4); return { q: `(${a} - ${b}) × ${c}`, a: (a - b) * c }; },
        () => { const a = rand(2, 5), b = rand(2, 4), c = [12, 18, 24, 36][rand(0, 3)], d = [2, 3, 4, 6][rand(0, 3)]; return { q: `${a} × ${b} + ${c} ÷ ${d}`, a: a * b + c / d }; },
      ][rand(0, 2)]();
      return { question: `Calculate: ${t.q}`, answer: Number.isInteger(t.a) ? t.a.toString() : t.a.toFixed(1) };
    },
    M7_009: () => {
      const divisors = [2, 3, 5, 9, 10], d = divisors[rand(0, 4)], base = rand(10, 50);
      const isDivisible = Math.random() > 0.4, num = isDivisible ? d * base : d * base + rand(1, d - 1);
      const hints = { 2: 'Ends 0,2,4,6,8', 3: 'Digit sum ÷3', 5: 'Ends 0 or 5', 9: 'Digit sum ÷9', 10: 'Ends in 0' };
      return { question: `Is ${num} divisible by ${d}? (yes/no)`, answer: num % d === 0 ? 'yes' : 'no', hint: hints[d] };
    },
    M7_010: () => {
      const nums = [12, 18, 24, 30, 36, 40, 42, 48, 54, 60, 72, 84], n = nums[rand(0, nums.length - 1)];
      const f = primeFactorize(n);
      return { question: `Write ${n} as product of primes (use ×)`, answer: f.join('×'), accepts: [f.join('×'), f.join('*'), f.join(' × ')] };
    },
    M7_011: () => { const pairs = [[12, 18], [24, 36], [15, 25], [18, 24], [20, 30]], [a, b] = pairs[rand(0, 4)]; return { question: `GCD of ${a} and ${b}?`, answer: gcd(a, b).toString() }; },
    M7_012: () => { const pairs = [[4, 6], [3, 5], [6, 8], [4, 10], [6, 9]], [a, b] = pairs[rand(0, 4)]; return { question: `LCM of ${a} and ${b}?`, answer: lcm(a, b).toString() }; },
    M7_014: () => {
      const d1 = rand(2, 6), d2 = rand(2, 6), n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
      const v1 = n1 / d1, v2 = n2 / d2;
      return { question: `Which is larger: ${n1}/${d1} or ${n2}/${d2}?`, answer: v1 > v2 ? `${n1}/${d1}` : v2 > v1 ? `${n2}/${d2}` : 'equal' };
    },
    M7_015: () => {
      const d = [2, 3, 4, 5][rand(0, 3)], n1 = rand(1, d - 1), n2 = rand(1, d - 1);
      const sum = n1 + n2, g = gcd(sum, d);
      const ans = sum >= d ? (sum % d === 0 ? `${sum / d}` : `${Math.floor(sum / d)} ${(sum % d) / gcd(sum % d, d)}/${d / gcd(sum % d, d)}`) : `${sum / g}/${d / g}`;
      return { question: `${n1}/${d} + ${n2}/${d} = ?`, answer: ans };
    },
    M7_017: () => {
      const n1 = rand(1, 4), d1 = rand(2, 5), n2 = rand(1, 4), d2 = rand(2, 5);
      const numAns = n1 * n2, denAns = d1 * d2, g = gcd(numAns, denAns);
      return { question: `${n1}/${d1} × ${n2}/${d2} = ?`, answer: `${numAns / g}/${denAns / g}`, hint: 'Multiply tops, multiply bottoms' };
    },
    M7_018: () => { const n = rand(2, 9), d = rand(2, 9); return { question: `Reciprocal of ${n}/${d}?`, answer: `${d}/${n}` }; },
    M7_019: () => {
      const n1 = rand(1, 4), d1 = rand(2, 5), n2 = rand(1, 3), d2 = rand(2, 4);
      const numAns = n1 * d2, denAns = d1 * n2, g = gcd(numAns, denAns);
      return { question: `${n1}/${d1} ÷ ${n2}/${d2} = ?`, answer: `${numAns / g}/${denAns / g}`, hint: 'Keep, Change, Flip' };
    },
    M7_021: () => {
      const num = (rand(1, 999) / 100).toFixed(2), pos = ['tenths', 'hundredths'][rand(0, 1)];
      return { question: `${pos} digit of ${num}?`, answer: pos === 'tenths' ? num[2] : num[4] };
    },
    M7_022: () => {
      const a = (rand(11, 99) / 10).toFixed(1), b = (rand(11, 49) / 10).toFixed(1);
      return { question: `${a} × ${b} = ?`, answer: parseFloat((parseFloat(a) * parseFloat(b)).toFixed(2)).toString() };
    },
    M7_023: () => {
      const divisor = [2, 4, 5][rand(0, 2)], result = (rand(10, 50) / 10).toFixed(1);
      return { question: `${(parseFloat(result) * divisor).toFixed(1)} ÷ ${divisor} = ?`, answer: result };
    },
    M7_024: () => { const n = rand(2, 15); return { question: `${n}² = ?`, answer: (n * n).toString() }; },
    M7_025: () => { const sq = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144][rand(0, 10)]; return { question: `√${sq} = ?`, answer: Math.sqrt(sq).toString() }; },
    M7_026: () => {
      const s = [{ q: "x mangoes, give 4 away. Remaining?", a: "x-4" }, { q: "Pen costs y. Cost of 5 pens?", a: "5y" }][rand(0, 1)];
      return { question: s.q, answer: s.a, accepts: [s.a, s.a.replace('-', ' - ')] };
    },
    M7_027: () => { const a = rand(2, 6), b = rand(1, 5), c = rand(1, 5); return { question: `Simplify: ${a}x + ${b} + ${c}x`, answer: `${a + c}x + ${b}` }; },
    M7_028: () => { const x = rand(2, 10), a = rand(2, 5); return { question: `Number × ${a} = ${a * x}. Write equation.`, answer: `${a}x=${a * x}` }; },
    M7_029: () => { const x = rand(2, 10), a = rand(2, 5), b = rand(2, 10); return { question: `Solve: ${a}x + ${b} = ${a * x + b}`, answer: x.toString(), hint: `Subtract ${b}, divide by ${a}` }; },
    M7_034: () => {
      const t = [[3, 4, 5], [5, 12, 13], [6, 8, 10]][rand(0, 2)], [a, b, c] = t;
      return Math.random() > 0.5 ? { question: `Legs ${a}, ${b}. Hypotenuse?`, answer: c.toString(), hint: 'c² = a² + b²' } : { question: `Hypotenuse ${c}, leg ${a}. Other leg?`, answer: b.toString() };
    },
    M7_035: () => { const c = [{ q: 'cm in 2.5 m?', a: '250' }, { q: 'm in 450 cm?', a: '4.5' }][rand(0, 1)]; return { question: c.q, answer: c.a }; },
    M7_036: () => { const l = rand(5, 15), w = rand(3, 10); return { question: `Perimeter of ${l}×${w} rectangle?`, answer: (2 * (l + w)).toString() }; },
    M7_037: () => { const r = rand(3, 10); return { question: `Circumference, r=${r}? (π=3.14)`, answer: (2 * 3.14 * r).toFixed(2), hint: 'C = 2πr' }; },
    M7_039: () => { const l = rand(5, 15), w = rand(3, 10); return { question: `Area of ${l}×${w} rectangle?`, answer: (l * w).toString() }; },
    M7_040: () => { const r = rand(2, 8); return { question: `Circle area, r=${r}? (π=3.14)`, answer: (3.14 * r * r).toFixed(2), hint: 'A = πr²' }; },
    M7_043: () => { const l = rand(3, 10), w = rand(2, 8), h = rand(2, 6); return { question: `Volume of ${l}×${w}×${h} cuboid?`, answer: (l * w * h).toString() }; },
    M7_044: () => { const r = rand(2, 6), h = rand(5, 12); return { question: `Cylinder: r=${r}, h=${h}. Volume? (π=3.14)`, answer: (3.14 * r * r * h).toFixed(2) }; },
    M7_046: () => {
      const type = rand(0, 2);
      if (type === 0) { const d = rand(50, 200), t = rand(2, 5); return { question: `${d} km in ${t} hours. Speed?`, answer: (d / t).toString() }; }
      if (type === 1) { const s = rand(40, 80), t = rand(2, 5); return { question: `${s} km/h for ${t} hours. Distance?`, answer: (s * t).toString() }; }
      const s = rand(40, 100), d = s * rand(2, 5); return { question: `${d} km at ${s} km/h. Time?`, answer: (d / s).toString() };
    },
  };
  return G[skillId]?.() || { question: `Practice: ${SKILLS[skillId]?.name}`, answer: '1' };
};

// ==================== ADAPTIVE ENGINE ====================

const useAdaptiveEngine = (progress) => {
  return useMemo(() => {
    const skillList = Object.values(SKILLS);
    
    const prereqsMet = (skillId) => {
      const skill = SKILLS[skillId];
      if (!skill || skill.prerequisites.length === 0) return true;
      return skill.prerequisites.every(pid => progress.skills[pid]?.mastered || progress.skills[pid]?.passed);
    };
    
    const getStatus = (skillId) => {
      const sp = progress.skills[skillId];
      if (sp?.mastered) return 'mastered';
      if (sp?.attempts > 0) return 'in_progress';
      return prereqsMet(skillId) ? 'available' : 'locked';
    };
    
    const findGaps = () => {
      const gaps = [];
      for (const skill of skillList) {
        const sp = progress.skills[skill.id];
        if (sp && sp.attempts >= 3 && (sp.correct / sp.attempts) < 0.6) {
          for (const pid of skill.prerequisites) {
            const pp = progress.skills[pid];
            if (!pp?.mastered) {
              const existing = gaps.find(g => g.id === pid);
              if (existing) existing.priority++;
              else gaps.push({ ...SKILLS[pid], priority: SKILLS[pid].critical ? 10 : 5, reason: `Needed for ${skill.name}`, type: 'gap' });
            }
          }
        }
      }
      return gaps.sort((a, b) => b.priority - a.priority);
    };
    
    const getReviews = () => {
      const now = Date.now(), reviews = [];
      for (const skill of skillList) {
        const sp = progress.skills[skill.id];
        if (!sp?.mastered || !sp.lastPractice) continue;
        const days = (now - new Date(sp.lastPractice).getTime()) / 86400000;
        const interval = [1, 3, 7, 14, 30][Math.min(sp.reviewCount || 0, 4)];
        if (days >= interval) reviews.push({ ...skill, daysSince: Math.round(days), type: 'review' });
      }
      return reviews;
    };
    
    const getNextToLearn = () => {
      return skillList
        .filter(s => !progress.skills[s.id]?.mastered && prereqsMet(s.id))
        .map(s => {
          const dependents = skillList.filter(x => x.prerequisites.includes(s.id)).length;
          return { ...s, priority: (s.critical ? 10 : 0) + dependents * 2 + (progress.skills[s.id]?.attempts > 0 ? 5 : 0), type: 'learn' };
        })
        .sort((a, b) => b.priority - a.priority);
    };
    
    const getRecommendedPath = () => {
      const path = [], seen = new Set();
      for (const g of findGaps().slice(0, 2)) { if (!seen.has(g.id)) { path.push(g); seen.add(g.id); } }
      for (const r of getReviews().slice(0, 1)) { if (!seen.has(r.id)) { path.push(r); seen.add(r.id); } }
      for (const n of getNextToLearn()) { if (path.length >= 5 || seen.has(n.id)) continue; path.push(n); seen.add(n.id); }
      return path;
    };
    
    const getDiagnosticSkills = () => {
      const easy = skillList.filter(s => s.weight <= 2);
      const med = skillList.filter(s => s.weight > 2 && s.weight <= 4);
      const hard = skillList.filter(s => s.weight > 4);
      return shuffle([...shuffle(easy).slice(0, 4), ...shuffle(med).slice(0, 8), ...shuffle(hard).slice(0, 4)]);
    };
    
    const getStats = () => {
      let mastered = 0, total = skillList.length, correct = 0, attempts = 0;
      for (const s of skillList) {
        if (progress.skills[s.id]?.mastered) mastered++;
        correct += progress.skills[s.id]?.correct || 0;
        attempts += progress.skills[s.id]?.attempts || 0;
      }
      return { mastered, total, percent: Math.round((mastered / total) * 100), accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0 };
    };
    
    const getStrandStats = () => {
      const strands = {};
      for (const s of skillList) {
        if (!strands[s.strand]) strands[s.strand] = { total: 0, mastered: 0, correct: 0, attempts: 0 };
        strands[s.strand].total++;
        const sp = progress.skills[s.id];
        if (sp?.mastered) strands[s.strand].mastered++;
        strands[s.strand].correct += sp?.correct || 0;
        strands[s.strand].attempts += sp?.attempts || 0;
      }
      return Object.entries(strands).map(([name, d]) => ({ name, ...d, percent: Math.round((d.mastered / d.total) * 100), accuracy: d.attempts > 0 ? Math.round((d.correct / d.attempts) * 100) : null }));
    };
    
    return { prereqsMet, getStatus, findGaps, getReviews, getNextToLearn, getRecommendedPath, getDiagnosticSkills, getStats, getStrandStats };
  }, [progress]);
};

// ==================== STORAGE ====================

const STORAGE_KEY = 'tutagora_adaptive_v2';
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { skills: {}, diagnosed: false }; } catch { return { skills: {}, diagnosed: false }; } };
const save = (p) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {} };

// ==================== ICONS ====================

const Icon = ({ name, className = "w-5 h-5" }) => {
  const paths = {
    check: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    play: <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    back: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22v-5" /><path d="M14 22v-5" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />,
    brain: <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" /></>,
    alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
    up: <polyline points="18 15 12 9 6 15" />,
    down: <polyline points="6 9 12 15 18 9" />,
    trend: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

// ==================== MAIN COMPONENT ====================

export function AIMastery({ onBack }) {
  const [progress, setProgress] = useState(load);
  const [view, setView] = useState(progress.diagnosed ? 'home' : 'welcome');
  const [activeSkill, setActiveSkill] = useState(null);
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [session, setSession] = useState({ correct: 0, total: 0, streak: 0 });
  const [diagnosticState, setDiagnosticState] = useState({ skills: [], index: 0, results: {} });
  const [expanded, setExpanded] = useState('Numbers');

  const engine = useAdaptiveEngine(progress);

  useEffect(() => { save(progress); }, [progress]);

  // ==================== DIAGNOSTIC ====================

  const startDiagnostic = () => {
    const skills = engine.getDiagnosticSkills();
    setDiagnosticState({ skills, index: 0, results: {} });
    setView('diagnostic');
    setProblem(generateProblem(skills[0].id));
    setAnswer('');
    setFeedback(null);
  };

  const handleDiagnosticAnswer = () => {
    const { skills, index, results } = diagnosticState;
    const skill = skills[index];
    const clean = answer.trim().toLowerCase().replace(/\s+/g, '');
    const accepts = problem.accepts || [problem.answer];
    const correct = accepts.some(a => clean === a.toString().toLowerCase().replace(/\s+/g, ''));
    
    const newResults = { ...results, [skill.id]: { ...(results[skill.id] || { correct: 0, total: 0 }), correct: (results[skill.id]?.correct || 0) + (correct ? 1 : 0), total: (results[skill.id]?.total || 0) + 1 } };
    
    setFeedback(correct ? 'correct' : 'incorrect');
    
    setTimeout(() => {
      if (index < skills.length - 1) {
        const next = index + 1;
        setDiagnosticState({ skills, index: next, results: newResults });
        setProblem(generateProblem(skills[next].id));
        setAnswer('');
        setFeedback(null);
      } else {
        // Finish diagnostic
        const skillUpdates = {};
        for (const [sid, r] of Object.entries(newResults)) {
          const acc = r.correct / r.total;
          skillUpdates[sid] = { attempts: r.total, correct: r.correct, mastered: acc >= (SKILLS[sid].masteryThreshold || 0.85), passed: acc >= 0.6, fromDiagnostic: true, lastPractice: new Date().toISOString() };
        }
        setProgress(p => ({ ...p, skills: { ...p.skills, ...skillUpdates }, diagnosed: true }));
        setView('home');
      }
    }, 1000);
  };

  // ==================== PRACTICE ====================

  const startSkill = (skillId) => {
    setActiveSkill(skillId);
    setSession({ correct: 0, total: 0, streak: 0 });
    setProblem(generateProblem(skillId));
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setView('practice');
  };

  const checkAnswer = () => {
    if (!answer.trim()) return;
    const clean = answer.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '');
    const accepts = problem.accepts || [problem.answer];
    const correct = accepts.some(a => clean === a.toString().toLowerCase().replace(/\s+/g, '').replace(/,/g, ''));
    
    setFeedback(correct ? 'correct' : 'incorrect');
    const newSession = { correct: session.correct + (correct ? 1 : 0), total: session.total + 1, streak: correct ? session.streak + 1 : 0 };
    setSession(newSession);
    
    const skill = SKILLS[activeSkill];
    const sp = progress.skills[activeSkill] || { attempts: 0, correct: 0, mastered: false };
    const newCorrect = sp.correct + (correct ? 1 : 0);
    const newAttempts = sp.attempts + 1;
    const shouldMaster = newAttempts >= skill.minProblems && (newCorrect / newAttempts) >= skill.masteryThreshold;
    
    setProgress(p => ({
      ...p,
      skills: { ...p.skills, [activeSkill]: { ...sp, attempts: newAttempts, correct: newCorrect, mastered: sp.mastered || shouldMaster, lastPractice: new Date().toISOString(), reviewCount: shouldMaster && !sp.mastered ? 0 : sp.reviewCount } }
    }));
  };

  const nextProblem = () => {
    setProblem(generateProblem(activeSkill));
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  const exitPractice = () => { setActiveSkill(null); setView('home'); };

  const resetAll = () => { if (confirm('Reset ALL progress?')) { const fresh = { skills: {}, diagnosed: false }; setProgress(fresh); save(fresh); setView('welcome'); } };

  // ==================== RENDER: WELCOME ====================

  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="text-3xl font-bold mb-4">Tutagora AI Tutor</h1>
          <p className="text-slate-400 mb-8">Let's find out what you already know, so I can help you learn what you don't.</p>
          <p className="text-slate-500 text-sm mb-6">You'll answer about 16 quick questions. It takes about 10 minutes.</p>
          <button onClick={startDiagnostic} className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-4 font-semibold text-lg">Start Diagnostic Test</button>
          <button onClick={() => { setProgress(p => ({ ...p, diagnosed: true })); setView('home'); }} className="mt-4 text-slate-500 hover:text-slate-300 text-sm">Skip (start from scratch)</button>
        </div>
      </div>
    );
  }

  // ==================== RENDER: DIAGNOSTIC ====================

  if (view === 'diagnostic') {
    const { skills, index } = diagnosticState;
    const skill = skills[index];
    const pct = Math.round(((index + 1) / skills.length) * 100);
    
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-sm text-slate-400 mb-2">Diagnostic Test • Question {index + 1} of {skills.length}</div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div>
          </div>
          
          <div className="text-xs text-slate-500 mb-2">{skill.strand} • {skill.name}</div>
          
          <div className="bg-slate-800 rounded-2xl p-6 mb-4">
            <div className="text-lg mb-6">{problem.question}</div>
            <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && handleDiagnosticAnswer()} disabled={!!feedback} className="w-full bg-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50" autoFocus placeholder="Your answer..." />
          </div>
          
          {feedback && (
            <div className={`rounded-xl p-4 mb-4 ${feedback === 'correct' ? 'bg-emerald-900/50 border border-emerald-500' : 'bg-red-900/50 border border-red-500'}`}>
              {feedback === 'correct' ? <span className="text-emerald-400">✓ Correct!</span> : <span className="text-red-400">✗ Answer: {problem.answer}</span>}
            </div>
          )}
          
          {!feedback && <button onClick={handleDiagnosticAnswer} disabled={!answer.trim()} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 rounded-xl py-4 font-semibold">Check</button>}
        </div>
      </div>
    );
  }

  // ==================== RENDER: PRACTICE ====================

  if (view === 'practice' && activeSkill && problem) {
    const skill = SKILLS[activeSkill];
    const sp = progress.skills[activeSkill] || { attempts: 0, correct: 0, mastered: false };
    const min = skill.minProblems;
    const pct = Math.min(100, (session.correct / min) * 100);
    
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={exitPractice} className="text-slate-400 hover:text-white flex items-center gap-1"><Icon name="back" className="w-4 h-4" /> Exit</button>
            <div className="text-center flex-1">
              <div className="text-xs text-slate-500">{skill.strand}</div>
              <div className="font-semibold">{skill.name}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold">{session.correct}/{min}</div>
              <div className="text-xs text-slate-400">to master</div>
            </div>
          </div>
          
          <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div>
          
          {session.streak >= 3 && <div className="bg-amber-900/30 border border-amber-600 rounded-lg p-2 mb-4 text-center text-amber-400">🔥 {session.streak} streak!</div>}
          
          <div className="bg-slate-800 rounded-2xl p-6 mb-4">
            <div className="text-lg mb-6">{problem.question}</div>
            <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && checkAnswer()} disabled={!!feedback} className="w-full bg-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50" autoFocus placeholder="Your answer..." />
            {problem.hint && !feedback && <button onClick={() => setShowHint(!showHint)} className="mt-3 text-sm text-amber-400">{showHint ? '🙈 Hide hint' : '💡 Show hint'}</button>}
            {showHint && problem.hint && <div className="mt-2 p-3 bg-amber-900/30 rounded-lg text-amber-200 text-sm">💡 {problem.hint}</div>}
          </div>
          
          {feedback && (
            <div className={`rounded-xl p-4 mb-4 ${feedback === 'correct' ? 'bg-emerald-900/50 border border-emerald-500' : 'bg-red-900/50 border border-red-500'}`}>
              {feedback === 'correct' ? <span className="text-emerald-400 font-semibold">✓ Correct! +10 XP</span> : <div><span className="text-red-400 font-semibold">✗ Not quite</span><div className="text-slate-300 mt-1">Answer: <span className="font-mono">{problem.answer}</span></div></div>}
            </div>
          )}
          
          {!feedback ? <button onClick={checkAnswer} disabled={!answer.trim()} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 rounded-xl py-4 font-semibold">Check Answer</button> : <button onClick={nextProblem} className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 font-semibold flex items-center justify-center gap-2">Next <Icon name="arrow" className="w-5 h-5" /></button>}
          
          {sp.mastered && !sp.celebrationShown && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-3xl p-8 text-center max-w-sm">
                <Icon name="trophy" className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Skill Mastered! 🎉</h2>
                <p className="text-slate-400 mb-6">{skill.name}</p>
                <button onClick={() => { setProgress(p => ({ ...p, skills: { ...p.skills, [activeSkill]: { ...p.skills[activeSkill], celebrationShown: true } } })); exitPractice(); }} className="bg-emerald-600 hover:bg-emerald-500 rounded-xl px-8 py-3 font-semibold">Continue</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== RENDER: HOME ====================

  const stats = engine.getStats();
  const path = engine.getRecommendedPath();
  const gaps = engine.findGaps();
  const strandStats = engine.getStrandStats();
  const skillList = Object.values(SKILLS);
  const strands = { Numbers: [], Algebra: [], Measurements: [] };
  skillList.forEach(s => strands[s.strand]?.push(s));

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="text-slate-400 hover:text-white"><Icon name="back" /></button>}
            <div>
              <h1 className="text-2xl font-bold text-emerald-400">AI Tutor</h1>
              <p className="text-sm text-slate-400">Adaptive Math Learning</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-amber-400 font-bold flex items-center gap-1"><Icon name="star" className="w-4 h-4" /> {Object.values(progress.skills).reduce((s, p) => s + (p.correct || 0) * 10, 0)} XP</div>
              <div className="text-xs text-slate-400">{stats.mastered}/{stats.total} mastered</div>
            </div>
            <button onClick={resetAll} className="text-slate-500 hover:text-slate-300"><Icon name="refresh" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Recommended Path */}
        {path.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Icon name="target" className="w-5 h-5 text-emerald-400" /> Your Learning Path</h2>
            <div className="space-y-2">
              {path.slice(0, 4).map((s, i) => (
                <button key={s.id} onClick={() => startSkill(s.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${s.type === 'gap' ? 'bg-red-900/20 border border-red-700 hover:bg-red-900/30' : s.type === 'review' ? 'bg-amber-900/20 border border-amber-700 hover:bg-amber-900/30' : 'bg-slate-800 hover:bg-slate-700'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${s.type === 'gap' ? 'bg-red-600' : s.type === 'review' ? 'bg-amber-600' : 'bg-emerald-600'}`}>{i + 1}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center gap-2">{s.name}{s.critical && <Icon name="zap" className="w-4 h-4 text-amber-400" />}</div>
                    <div className="text-xs text-slate-400">{s.type === 'gap' ? `⚠️ ${s.reason}` : s.type === 'review' ? `🔄 Review (${s.daysSince}d ago)` : s.strand}</div>
                  </div>
                  <Icon name="arrow" className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gaps Alert */}
        {gaps.length > 0 && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400 font-semibold mb-2"><Icon name="alert" className="w-5 h-5" /> Foundation Gaps Detected</div>
            <p className="text-sm text-slate-300 mb-3">You're struggling with some skills because these prerequisites need work:</p>
            <div className="flex flex-wrap gap-2">
              {gaps.slice(0, 3).map(g => <span key={g.id} className="px-2 py-1 bg-red-900/30 rounded text-sm text-red-300">{g.name}</span>)}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300">Overall Mastery</span>
            <span className="text-emerald-400 font-bold">{stats.percent}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${stats.percent}%` }} /></div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            {strandStats.map(s => (
              <div key={s.name} className="bg-slate-700/50 rounded-lg p-2">
                <div className="text-slate-400">{s.name}</div>
                <div className="font-bold text-white">{s.percent}%</div>
                {s.accuracy !== null && s.accuracy < 70 && <div className="text-xs text-red-400">⚠️ {s.accuracy}% accuracy</div>}
              </div>
            ))}
          </div>
        </div>

        {/* All Skills */}
        <h2 className="text-lg font-semibold mb-3">All Skills</h2>
        <div className="space-y-3">
          {Object.entries(strands).map(([strand, skills]) => {
            const isExp = expanded === strand;
            const masteredInStrand = skills.filter(s => progress.skills[s.id]?.mastered).length;
            return (
              <div key={strand}>
                <button onClick={() => setExpanded(isExp ? null : strand)} className="w-full flex items-center justify-between bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${strand === 'Numbers' ? 'bg-blue-600' : strand === 'Algebra' ? 'bg-purple-600' : 'bg-amber-600'}`}>{strand === 'Numbers' ? '#' : strand === 'Algebra' ? 'x' : '📏'}</div>
                    <div className="text-left">
                      <div className="font-semibold">{strand}</div>
                      <div className="text-sm text-slate-400">{masteredInStrand}/{skills.length} mastered</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(masteredInStrand / skills.length) * 100}%` }} /></div>
                    <Icon name={isExp ? 'up' : 'down'} className="w-5 h-5" />
                  </div>
                </button>
                {isExp && (
                  <div className="mt-2 space-y-1 pl-2">
                    {skills.map(skill => {
                      const status = engine.getStatus(skill.id);
                      const sp = progress.skills[skill.id];
                      return (
                        <button key={skill.id} onClick={() => status !== 'locked' && startSkill(skill.id)} disabled={status === 'locked'} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${status === 'locked' ? 'bg-slate-800/50 opacity-50 cursor-not-allowed' : status === 'mastered' ? 'bg-emerald-900/30 border border-emerald-700' : status === 'in_progress' ? 'bg-blue-900/20 border border-blue-800' : 'bg-slate-800 hover:bg-slate-700'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status === 'locked' ? 'bg-slate-700' : status === 'mastered' ? 'bg-emerald-600' : status === 'in_progress' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                            {status === 'locked' ? <Icon name="lock" className="w-4 h-4" /> : status === 'mastered' ? <Icon name="check" className="w-4 h-4" /> : status === 'in_progress' ? <Icon name="trend" className="w-4 h-4" /> : <Icon name="play" className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium flex items-center gap-2">{skill.name}{skill.critical && <Icon name="zap" className="w-4 h-4 text-amber-400" />}</div>
                            <div className="text-xs text-slate-400">{sp?.attempts > 0 && `${sp.correct}/${sp.attempts} (${Math.round((sp.correct / sp.attempts) * 100)}%)`}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm space-y-1">
          <p>🎯 Learning path adapts to your gaps</p>
          <p>🔄 Mastered skills come back for review</p>
          <button onClick={startDiagnostic} className="text-emerald-500 hover:text-emerald-400 mt-2">Retake diagnostic test</button>
        </div>
      </div>
    </div>
  );
}

export default AIMastery;
