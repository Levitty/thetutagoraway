// ============================================================================
// TUTAGORA AI MASTERY — Main Component
// Adaptive learning based on "The Math Academy Way" — supports multiple subjects
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SUBJECTS, SUBJECT_LIST, DEFAULT_SUBJECT } from './subjects.js';
import { getStatus, getRecommendedPath, findGaps, getReviews, getNextToLearn, getStats, getStrandStats, getGradeStats, getEstimatedGradeLevel, getDiagnosticSkills as getAdaptiveDiagnosticSkills, getRemediationSkills, calculateXP, getLevel, selectReviewProblems } from './adaptiveEngine.js';
import { processReviewResult, applyImplicitCredits, calculateMemoryStrength } from './spacedRepetition.js';
import { propagateCredit, getTimeWeight, selectNextQuestion, processDiagnosticResults } from './diagnosticEngine.js';
import { defaultProgress, loadProgress, saveProgress, forceSave, updateStreak } from './progressStore.js';
import { NATIVE, curriculaForSubject, gradeOf, strandOf, isEnrichment, bandLabel } from './curricula.js';
import { gainXP, todaysXP, dailyGoalPercent, dailyGoalMet, DAILY_GOAL_XP, ACHIEVEMENTS, evaluateAchievements, getAchievement, encourage } from './gamification.js';
import { getBrainProfile, getBrainSession } from './engineClient.js';
import { logResponse } from './telemetry.js';
import { supabase } from '../supabase.js';
import { Icon } from './components/Icons.jsx';
import { InteractiveVisual, SKILL_VISUALS } from './InteractiveVisual.jsx';
import { checkVisualAnswer } from './content/visual.js';

// ==================== SMART ANSWER MATCHING ====================
// Normalizes math expressions so equivalent forms match:
//   "2(x) = 12"  ↔  "2x = 12"
//   "5x + 3"     ↔  "5x+3"
//   "x = -3"     ↔  "x=-3"
//   "3/4"        ↔  "3 / 4"
//   "(−2, 5)"    ↔  "(-2, 5)"  ↔  "(-2,5)"

function normalizeMath(str) {
  let s = str.toString().trim().toLowerCase();
  // Normalize unicode minus/dash to hyphen
  s = s.replace(/[−–—]/g, '-');
  // Remove all spaces
  s = s.replace(/\s+/g, '');
  // Remove commas in numbers (1,200 → 1200) but keep commas between values
  s = s.replace(/(\d),(\d{3})/g, '$1$2');
  // Remove unnecessary parentheses around single variables: (x) → x, (y) → y
  s = s.replace(/\(([a-z])\)/g, '$1');
  // Remove × and * (multiplication signs) between number and variable: 2*x → 2x, 2×x → 2x
  s = s.replace(/(\d)[*×·]([a-z])/g, '$1$2');
  // Remove × and * between number and paren: 2*(3) → 2(3)
  s = s.replace(/(\d)[*×·]\(/g, '$1(');
  // Expand simple multiplications written as num(var): already handled by removing parens above
  return s;
}

function checkAnswerMatch(userAnswer, problem) {
  const normalizedUser = normalizeMath(userAnswer);
  const accepts = problem.accepts || [problem.answer];

  // Check if any accepted answer matches after normalization
  if (accepts.some(a => normalizedUser === normalizeMath(a))) return true;

  // For pure numeric answers, try parsing as number
  const userNum = parseFloat(normalizedUser);
  if (!isNaN(userNum)) {
    if (accepts.some(a => {
      const aNum = parseFloat(normalizeMath(a));
      return !isNaN(aNum) && Math.abs(userNum - aNum) < 0.01;
    })) return true;
  }

  // For fraction answers: check if 3/4 matches 0.75 etc.
  const fractionMatch = normalizedUser.match(/^(-?\d+)\/(\d+)$/);
  if (fractionMatch) {
    const fracVal = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
    if (accepts.some(a => {
      const aNum = parseFloat(normalizeMath(a));
      return !isNaN(aNum) && Math.abs(fracVal - aNum) < 0.01;
    })) return true;
    // Also check if accepted answer is a fraction with same value
    if (accepts.some(a => {
      const am = normalizeMath(a).match(/^(-?\d+)\/(\d+)$/);
      if (am) {
        const aFrac = parseInt(am[1]) / parseInt(am[2]);
        return Math.abs(fracVal - aFrac) < 0.001;
      }
      return false;
    })) return true;
  }

  // For coordinate answers: normalize (x,y) format
  const coordUser = normalizedUser.replace(/[() ]/g, '');
  if (accepts.some(a => normalizeMath(a).replace(/[() ]/g, '') === coordUser)) return true;

  return false;
}

// ==================== CELEBRATIONS ====================

const CONFETTI_COLORS = ['#34d399', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'];

// Lightweight CSS confetti (no dependencies) for celebratory moments.
const Confetti = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-[60]" aria-hidden="true">
    {Array.from({ length: 28 }).map((_, i) => {
      const size = 6 + Math.random() * 6;
      return (
        <span key={i} style={{
          position: 'absolute', left: `${Math.random() * 100}%`, top: '-5%',
          width: size, height: size, borderRadius: 2,
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          animation: `tg-confetti ${1.8 + Math.random() * 1.2}s linear ${Math.random() * 0.3}s forwards`,
        }} />
      );
    })}
    <style>{`@keyframes tg-confetti{to{transform:translateY(110vh) rotate(540deg);opacity:0}}`}</style>
  </div>
);

// Warm, full-screen celebration card. `item` = { type, icon, title, subtitle, xp }.
const CelebrationOverlay = ({ item, onDismiss }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onDismiss}>
      <Confetti />
      <div className="bg-slate-800 rounded-3xl p-8 text-center max-w-sm relative z-[61]" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-3">{item.icon}</div>
        <h2 className="text-2xl font-bold mb-1">{item.title}</h2>
        {item.subtitle && <p className="text-slate-300 mb-2">{item.subtitle}</p>}
        {item.xp != null && <p className="text-emerald-400 font-bold text-lg mb-2">+{item.xp} XP</p>}
        <button onClick={onDismiss} className="mt-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl px-8 py-3 font-semibold transition-colors">Continue</button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export function AIMastery({ onBack, userId }) {
  const [subjectId, setSubjectId] = useState(null); // null = subject picker
  const [progress, setProgress] = useState(defaultProgress);
  const [view, setView] = useState('loading');
  const [loading, setLoading] = useState(true);

  // Current subject data (derived)
  const sub = subjectId ? SUBJECTS[subjectId] : null;
  const SKILLS = sub?.skills || {};
  const SKILL_COUNT = sub?.skillCount || 0;
  const STRANDS = sub?.strands || [];
  const getPostRequisites = sub?.getPostReqs || (() => []);
  const generateProblem = sub?.generate || (() => null);
  const generateWorkedExample = sub?.generateExample || (() => null);

  // Active syllabus view (CBC/CBE, Cambridge, or native). Persisted per subject
  // inside progress so it survives reloads / other devices.
  const curriculum = progress.curriculum || NATIVE;
  const curriculaOptions = useMemo(() => curriculaForSubject(sub), [sub]);

  // Engine context — passed to adaptive/spaced/diagnostic engines
  const ctx = useMemo(() => sub ? { skills: sub.skills, getPostReqs: sub.getPostReqs, curriculum } : null, [sub, curriculum]);

  // Lesson / Practice state
  const [activeSkill, setActiveSkill] = useState(null);
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [session, setSession] = useState({ correct: 0, total: 0, streak: 0, startTime: null });
  const [kpIndex, setKpIndex] = useState(0);
  const [showWorkedExample, setShowWorkedExample] = useState(true);
  const [lessonFailCount, setLessonFailCount] = useState(0);
  // CPA modality: 'abstract' (symbols) by default; escalates to 'concrete'
  // (manipulatives / pictures) when the student struggles with a skill.
  const [modalityLevel, setModalityLevel] = useState('abstract');
  const [visualAnswer, setVisualAnswer] = useState(null);

  // Diagnostic state
  const [diagState, setDiagState] = useState({ skills: [], index: 0, balances: {}, results: {}, startTimes: {} });

  // Review state
  const [reviewProblems, setReviewProblems] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewTimer, setReviewTimer] = useState(0);
  const [reviewTimerActive, setReviewTimerActive] = useState(false);

  // UI state
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState('path');
  const [remediationSkills, setRemediationSkills] = useState(null);
  // Celebration queue: skill mastery, level-ups, achievements, daily goal.
  const [celebrations, setCelebrations] = useState([]);

  // Layered hints + tooltips state
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintLevel, setHintLevel] = useState(0); // 0=none, 1=hint, 2=partial steps, 3=full reveal
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [expandedWhySteps, setExpandedWhySteps] = useState({});
  const [conceptsExpanded, setConceptsExpanded] = useState(true);

  // Python "brain" overlay — richer measurement when the engine is reachable.
  // Falls back silently to the JS engine when it isn't (e.g. in production).
  const [brainProfile, setBrainProfile] = useState(null);
  const [brainPath, setBrainPath] = useState(null);

  // Per-problem timer for telemetry (reset whenever the problem changes).
  const problemStartRef = useRef(Date.now());
  useEffect(() => { problemStartRef.current = Date.now(); }, [problem]);

  // Join-a-class affordance (student enrolls with a teacher's code).
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinStatus, setJoinStatus] = useState(null); // null | 'joining' | 'ok' | error string

  const joinClass = async () => {
    const code = joinCode.trim();
    if (!code) return;
    setJoinStatus('joining');
    const { error } = await supabase.rpc('join_class', { p_code: code });
    if (error) {
      setJoinStatus(error.message || 'Could not join');
    } else {
      setJoinStatus('ok');
      setJoinCode('');
      setTimeout(() => { setShowJoin(false); setJoinStatus(null); }, 1800);
    }
  };

  // ==================== INLINE COMPONENTS ====================

  // TermTooltip: renders text with tappable variable definitions
  const TermTooltip = ({ text, definitions }) => {
    if (!definitions || Object.keys(definitions).length === 0) return <span>{text}</span>;
    // Build regex from definition keys, longest first to avoid partial matches
    const terms = Object.keys(definitions).sort((a, b) => b.length - a.length);
    const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => {
          const matchKey = terms.find(t => t.toLowerCase() === part.toLowerCase());
          if (matchKey) {
            const isActive = activeTooltip === `${matchKey}-${i}`;
            return (
              <span key={i} className="relative inline-block">
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveTooltip(isActive ? null : `${matchKey}-${i}`); }}
                  className="border-b border-dotted border-emerald-400/60 text-emerald-300 hover:text-emerald-200 cursor-help transition-colors"
                >{part}</button>
                {isActive && (
                  <span className="absolute left-0 top-full mt-1 z-50 w-64 p-3 bg-slate-700 border border-emerald-500/30 rounded-lg shadow-xl text-sm text-slate-200 font-normal leading-relaxed" style={{ whiteSpace: 'normal' }}>
                    <span className="font-bold text-emerald-400">{matchKey}:</span> {definitions[matchKey]}
                    <span className="absolute -top-1 left-4 w-2 h-2 bg-slate-700 border-l border-t border-emerald-500/30 rotate-45" />
                  </span>
                )}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  // ConceptIntro: shows expandable "What you need to know" block
  const ConceptIntro = ({ definitions }) => {
    if (!definitions || Object.keys(definitions).length === 0) return null;
    const entries = Object.entries(definitions);
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl mb-4 overflow-hidden">
        <button onClick={() => setConceptsExpanded(!conceptsExpanded)} className="w-full px-5 py-3 flex items-center justify-between text-left">
          <span className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
            <Icon name="book" className="w-4 h-4" />
            What you need to know
          </span>
          <span className="text-slate-500 text-xs">{conceptsExpanded ? 'Hide' : 'Show'}</span>
        </button>
        {conceptsExpanded && (
          <div className="px-5 pb-4 space-y-2">
            {entries.map(([term, def]) => (
              <div key={term} className="flex gap-2 text-sm">
                <span className="text-emerald-400 font-bold min-w-fit whitespace-nowrap">{term}:</span>
                <span className="text-slate-300">{def}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ==================== LOAD PROGRESS ====================

  // When subject changes, load that subject's progress
  useEffect(() => {
    if (!subjectId) { setLoading(false); setView('subject-picker'); return; }
    setLoading(true);
    (async () => {
      const storageKey = subjectId === 'math' ? userId : `${userId}_${subjectId}`;
      const p = await loadProgress(storageKey);
      setProgress(p);
      setView(p.diagnosed ? 'home' : 'welcome');
      setLoading(false);
    })();
  }, [userId, subjectId]);

  // Auto-save on progress change
  useEffect(() => {
    if (!loading && subjectId) {
      const storageKey = subjectId === 'math' ? userId : `${userId}_${subjectId}`;
      saveProgress(storageKey, progress);
    }
  }, [progress, userId, loading, subjectId]);

  // Keep a ref of the latest state so the unmount/back handlers flush the most
  // recent progress instead of a stale snapshot captured at first render.
  const latestRef = useRef({ progress, loading, subjectId, userId });
  useEffect(() => {
    latestRef.current = { progress, loading, subjectId, userId };
  });

  // Flush the latest progress to the cloud immediately (used on exit).
  const flushSave = useCallback(() => {
    const { progress, loading, subjectId, userId } = latestRef.current;
    if (loading || !subjectId) return;
    const storageKey = subjectId === 'math' ? userId : `${userId}_${subjectId}`;
    forceSave(storageKey, progress);
  }, []);

  // Save on unmount (e.g. navigating away from the tutor)
  useEffect(() => {
    return () => { flushSave(); };
  }, [flushSave]);

  // Brain overlay: when on the home dashboard, ask the Python engine for the
  // measured level + next-session plan. Null results => JS engine is used.
  useEffect(() => {
    let cancelled = false;
    if (loading || !subjectId || view !== 'home' || !progress.diagnosed) {
      setBrainProfile(null);
      setBrainPath(null);
      return;
    }
    (async () => {
      const [profile, recs] = await Promise.all([
        getBrainProfile(progress, subjectId),
        getBrainSession(progress, subjectId, 8),
      ]);
      if (cancelled) return;
      setBrainProfile(profile);
      if (recs) {
        // Map brain recommendations into the path-item shape the UI renders.
        const kindToType = { remediate: 'gap', review: 'review', learn: 'learn', stretch: 'stretch' };
        setBrainPath(recs.map(r => ({
          id: r.skill_id,
          name: r.name,
          grade: r.grade,
          strand: r.strand,
          type: kindToType[r.kind] || 'learn',
          reason: r.reason,
          critical: !!(sub?.skills?.[r.skill_id]?.critical),
          _brain: true,
        })));
      } else {
        setBrainPath(null);
      }
    })();
    return () => { cancelled = true; };
  }, [progress, subjectId, view, loading, sub]);

  // Detect level-ups, newly-unlocked achievements and daily-goal hits, and queue
  // a warm celebration for each. The first run after load seeds the baseline
  // silently so we never replay past wins when a learner re-opens the tutor.
  const gamifyRef = useRef({ init: false, level: 0, dailyDoneDate: null });
  useEffect(() => {
    if (loading || !subjectId || !ctx) return;
    const lvl = getLevel(progress.totalXP || 0).level;
    const st = getStats(progress, ctx);
    const strandsComplete = getStrandStats(progress, ctx).filter(s => s.total > 0 && s.mastered === s.total).length;
    const snapshot = { progress, mastered: st.mastered, total: st.total, level: lvl, streak: progress.currentStreak || 0, strandsComplete };
    const unlocked = evaluateAchievements(snapshot);
    const stored = progress.achievements || [];
    const newly = unlocked.filter(id => !stored.includes(id));
    const goalMet = dailyGoalMet(progress);

    if (!gamifyRef.current.init) {
      gamifyRef.current = { init: true, level: lvl, dailyDoneDate: goalMet ? progress.dailyDate : null };
      if (newly.length) setProgress(p => ({ ...p, achievements: Array.from(new Set([...(p.achievements || []), ...unlocked])) }));
      return;
    }

    const queue = [];
    if (lvl > gamifyRef.current.level) {
      queue.push({ type: 'levelup', icon: '🚀', title: `Level ${lvl}!`, subtitle: encourage('levelup') });
    }
    for (const id of newly) {
      const a = getAchievement(id);
      if (a) queue.push({ type: 'achievement', icon: a.icon, title: a.name, subtitle: a.desc });
    }
    if (goalMet && gamifyRef.current.dailyDoneDate !== progress.dailyDate) {
      gamifyRef.current.dailyDoneDate = progress.dailyDate;
      queue.push({ type: 'dailygoal', icon: '☀️', title: 'Daily goal reached!', subtitle: encourage('dailygoal') });
    }
    gamifyRef.current.level = lvl;
    if (newly.length) setProgress(p => ({ ...p, achievements: Array.from(new Set([...(p.achievements || []), ...newly])) }));
    if (queue.length) setCelebrations(q => [...q, ...queue]);
  }, [progress.totalXP, progress.skills, progress.dailyXP, loading, subjectId, ctx]);

  // Review timer
  useEffect(() => {
    let interval;
    if (reviewTimerActive) {
      interval = setInterval(() => setReviewTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [reviewTimerActive]);

  // ==================== DIAGNOSTIC ====================

  const startDiagnostic = () => {
    const skills = getAdaptiveDiagnosticSkills(progress, ctx);
    setDiagState({ skills, index: 0, balances: {}, results: {}, startTimes: { [skills[0]?.id]: Date.now() } });
    setProblem(generateProblem(skills[0]?.id));
    setAnswer('');
    setFeedback(null);
    setView('diagnostic');
  };

  const handleDiagnosticAnswer = () => {
    if (!answer.trim()) return;
    const { skills, index, balances, results, startTimes } = diagState;
    const skill = skills[index];
    const timeTaken = Date.now() - (startTimes[skill.id] || Date.now());
    const timeWeight = getTimeWeight(timeTaken);

    const correct = checkAnswerMatch(answer, problem);

    const newBalances = propagateCredit(balances, skill.id, correct, timeWeight, ctx);
    const newResults = { ...results, [skill.id]: { correct, timeTaken } };

    logResponse({
      studentId: userId, subject: subjectId, skillId: skill.id,
      correct, problemType: problem?.type, timeMs: timeTaken, isDiagnostic: true,
    });

    setFeedback(correct ? 'correct' : 'incorrect');

    setTimeout(() => {
      if (index < skills.length - 1) {
        const next = index + 1;
        setDiagState({ skills, index: next, balances: newBalances, results: newResults, startTimes: { ...startTimes, [skills[next].id]: Date.now() } });
        setProblem(generateProblem(skills[next].id));
        setAnswer('');
        setFeedback(null);
      } else {
        // Finish diagnostic
        const skillUpdates = processDiagnosticResults(newBalances, ctx);
        const finished = {
          ...progress,
          skills: { ...progress.skills, ...skillUpdates },
          diagnosed: true,
          diagnosticBalances: newBalances,
        };
        setProgress(finished);
        // Persist the diagnostic result immediately rather than waiting on the
        // debounced auto-save — closes the window where a quick exit/refresh
        // would lose the result and force a retake.
        const storageKey = subjectId === 'math' ? userId : `${userId}_${subjectId}`;
        forceSave(storageKey, finished);
        setView('home');
      }
    }, 800);
  };

  // ==================== LESSON (KP-BASED) ====================

  const startLesson = (skillId) => {
    setActiveSkill(skillId);
    setSession({ correct: 0, total: 0, streak: 0, startTime: Date.now() });
    setKpIndex(0);
    setLessonFailCount(0);
    setModalityLevel('abstract');
    const we = generateWorkedExample(skillId);
    setShowWorkedExample(!!we);
    setProblem(we ? null : generateProblem(skillId, { level: 'abstract' }));
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setRemediationSkills(null);
    setAttemptCount(0);
    setHintLevel(0);
    setExpandedWhySteps({});
    setConceptsExpanded(true);
    setActiveTooltip(null);
    setView('lesson');
  };

  const startPractice = () => {
    setShowWorkedExample(false);
    setProblem(generateProblem(activeSkill, { level: modalityLevel }));
    setAnswer('');
    setFeedback(null);
    setAttemptCount(0);
    setHintLevel(0);
    setActiveTooltip(null);
    setVisualAnswer(null);
  };

  const checkAnswer = () => {
    // Visual problems are answered by interaction (or by typing the coordinate).
    const hasVisualAnswer = problem?.visual && visualAnswer != null;
    if ((!answer.trim() && !hasVisualAnswer) || feedback) return;
    const correct = hasVisualAnswer
      ? checkVisualAnswer(visualAnswer, problem.visual)
      : checkAnswerMatch(answer, problem);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    // === LAYERED WRONG-ANSWER HANDLING ===
    // Attempt 1 wrong: show hint, let them retry
    // Attempt 2 wrong: show partial worked example, let them retry
    // Attempt 3 wrong: show full answer + worked example, mark as final incorrect
    if (!correct && newAttemptCount < 3) {
      // Not final attempt — show escalating hints, clear answer, let them retry
      setHintLevel(newAttemptCount); // 1 = hint, 2 = partial steps
      setAnswer('');
      return; // Don't record in progress yet — only the final result counts
    }

    // === FINAL RESULT (correct at any attempt, or 3rd-attempt fail) ===
    setFeedback(correct ? 'correct' : 'incorrect');
    if (!correct) setHintLevel(3); // Full reveal

    // Telemetry: capture the response for the HOREB learning loop.
    logResponse({
      studentId: userId, subject: subjectId, skillId: activeSkill,
      correct, problemType: problem?.type,
      timeMs: Date.now() - problemStartRef.current,
      hintsUsed: correct ? hintLevel : 3, attemptNo: newAttemptCount,
    });

    const newSession = {
      correct: session.correct + (correct ? 1 : 0),
      total: session.total + 1,
      streak: correct ? session.streak + 1 : 0,
      startTime: session.startTime,
    };
    setSession(newSession);

    // Update skill progress
    const skill = SKILLS[activeSkill];
    const sp = progress.skills[activeSkill] || { attempts: 0, correct: 0, mastered: false, repNum: 0, learningSpeed: 1.0, consecutiveFailures: 0 };
    const newCorrect = sp.correct + (correct ? 1 : 0);
    const newAttempts = sp.attempts + 1;
    const accuracy = newCorrect / newAttempts;
    const shouldMaster = newAttempts >= skill.minProblems && accuracy >= skill.masteryThreshold;

    // Apply implicit repetitions to prerequisites
    let updatedSkills = applyImplicitCredits(progress, activeSkill, correct, ctx);

    const updatedSp = processReviewResult(sp, correct);
    updatedSp.attempts = newAttempts;
    updatedSp.correct = newCorrect;
    if (shouldMaster && !sp.mastered) {
      updatedSp.mastered = true;
      updatedSp.repNum = 2;
    }

    updatedSkills = { ...updatedSkills, [activeSkill]: updatedSp };

    // Struggling (2 failed problems in a row): first try teaching the concept a
    // more CONCRETE way (manipulatives / pictures) before sending them back to
    // prerequisites. This is the CPA "drop down a level" move.
    if (!correct) {
      const newFailCount = lessonFailCount + 1;
      setLessonFailCount(newFailCount);
      if (newFailCount >= 2) {
        if (modalityLevel !== 'concrete') setModalityLevel('concrete');
        const remSkills = getRemediationSkills(activeSkill, kpIndex, progress, ctx);
        if (remSkills.length > 0) {
          setRemediationSkills(remSkills);
        }
      }
    } else {
      setLessonFailCount(0);
    }

    // XP calculation
    let xpEarned = 0;
    if (shouldMaster && !sp.mastered) {
      xpEarned = calculateXP(accuracy, skill.estimatedMinutes, accuracy >= 1.0);
    } else if (correct) {
      xpEarned = 2; // Small XP per correct answer
    }

    const updatedProgress = updateStreak(gainXP({
      ...progress,
      skills: updatedSkills,
    }, xpEarned));

    setProgress(updatedProgress);

    // Celebration on mastery (level-ups / badges are queued by the effect below)
    if (shouldMaster && !sp.mastered) {
      setTimeout(() => setCelebrations(q => [...q, {
        type: 'mastery', icon: '🏆', title: 'Skill Mastered!',
        subtitle: `${skill.name} — ${encourage('mastery')}`, xp: xpEarned,
      }]), 500);
    }
  };

  const nextProblem = () => {
    setProblem(generateProblem(activeSkill, { level: modalityLevel }));
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setAttemptCount(0);
    setHintLevel(0);
    setActiveTooltip(null);
    setVisualAnswer(null);
  };

  // ==================== REVIEW (TIMED, INTERLEAVED) ====================

  const startReview = () => {
    const problems = selectReviewProblems(progress, 12, ctx);
    if (problems.length === 0) return;
    setReviewProblems(problems);
    setReviewIndex(0);
    setProblem(generateProblem(problems[0]));
    setAnswer('');
    setFeedback(null);
    setSession({ correct: 0, total: 0, streak: 0, startTime: Date.now() });
    setReviewTimer(0);
    setReviewTimerActive(true);
    setView('review');
  };

  const handleReviewAnswer = () => {
    if (!answer.trim() || feedback) return;
    const skillId = reviewProblems[reviewIndex];
    const correct = checkAnswerMatch(answer, problem);

    logResponse({
      studentId: userId, subject: subjectId, skillId,
      correct, problemType: problem?.type,
      timeMs: Date.now() - problemStartRef.current, isReview: true,
    });

    setFeedback(correct ? 'correct' : 'incorrect');
    setSession(s => ({ ...s, correct: s.correct + (correct ? 1 : 0), total: s.total + 1, streak: correct ? s.streak + 1 : 0 }));

    // Update skill progress with spaced repetition
    const sp = progress.skills[skillId] || { attempts: 0, correct: 0, mastered: false, repNum: 0, learningSpeed: 1.0 };
    const updatedSp = processReviewResult(sp, correct);
    updatedSp.attempts = sp.attempts + 1;
    updatedSp.correct = sp.correct + (correct ? 1 : 0);

    let updatedSkills = applyImplicitCredits(progress, skillId, correct, ctx);
    updatedSkills = { ...updatedSkills, [skillId]: updatedSp };

    setProgress(p => updateStreak(gainXP({
      ...p,
      skills: updatedSkills,
    }, correct ? 3 : 0)));

    setTimeout(() => {
      if (reviewIndex < reviewProblems.length - 1) {
        const next = reviewIndex + 1;
        setReviewIndex(next);
        setProblem(generateProblem(reviewProblems[next]));
        setAnswer('');
        setFeedback(null);
      } else {
        // Review complete
        setReviewTimerActive(false);
        const accuracy = (session.correct + (correct ? 1 : 0)) / (session.total + 1);
        const xp = calculateXP(accuracy, 10, false);
        setProgress(p => updateStreak(gainXP({ ...p, sessionsCompleted: (p.sessionsCompleted || 0) + 1 }, xp)));
        setView('review-complete');
      }
    }, 800);
  };

  // ==================== NAVIGATION ====================

  const goHome = () => { setView('home'); setActiveSkill(null); setCelebrations([]); setRemediationSkills(null); };

  // Dismiss the front celebration; mastery returns the learner to the dashboard.
  const dismissCelebration = () => {
    const item = celebrations[0];
    setCelebrations(q => q.slice(1));
    if (item?.type === 'mastery') goHome();
  };
  const switchSubject = () => { setSubjectId(null); setView('subject-picker'); setActiveSkill(null); setProgress(defaultProgress); };
  const resetAll = () => { if (confirm('Reset ALL progress? This cannot be undone.')) { const fresh = defaultProgress(); setProgress(fresh); const storageKey = subjectId === 'math' ? userId : `${userId}_${subjectId}`; forceSave(storageKey, fresh); setView('welcome'); } };

  // Grade/band label helper. ACCA subjects use named levels; otherwise the
  // active curriculum decides the wording ("Grade" vs Cambridge "Stage").
  const gradeLabel = (grade) => {
    if (sub?.gradeNames?.[grade]) return `${sub.gradeLabel} ${grade} — ${sub.gradeNames[grade]}`;
    return bandLabel(curriculum, grade);
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

  // ==================== RENDER: SUBJECT PICKER ====================

  if (view === 'subject-picker' || !subjectId) return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>}
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">T</div>
          <h1 className="text-base font-bold text-slate-900">AI Tutor</h1>
        </div>
      </div>
      <div className="bg-gradient-to-b from-slate-100 to-slate-900 pt-8 pb-4" />
      <div className="max-w-lg mx-auto px-4 -mt-4">
        <h2 className="text-2xl font-bold text-center mb-2">Choose a Subject</h2>
        <p className="text-slate-400 text-center text-sm mb-6">Adaptive learning with spaced repetition for each</p>
        <div className="space-y-3">
          {SUBJECT_LIST.map(s => (
            <button key={s.id} onClick={() => setSubjectId(s.id)} className="w-full bg-slate-800 hover:bg-slate-700 rounded-2xl p-5 flex items-center gap-4 transition-colors text-left">
              <div className="text-4xl">{s.emoji}</div>
              <div className="flex-1">
                <div className="font-bold text-lg">{s.name}</div>
                <div className="text-slate-400 text-sm">{s.description}</div>
                <div className="text-xs text-slate-500 mt-1">{s.skillCount} skills</div>
              </div>
              <Icon name="arrow" className="w-5 h-5 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const stats = getStats(progress, ctx);
  const level = getLevel(progress.totalXP || 0);

  // ==================== RENDER: WELCOME ====================

  if (view === 'welcome') return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Light bridging header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>}
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">T</div>
          <h1 className="text-base font-bold text-slate-900">AI Tutor</h1>
        </div>
      </div>
      <div className="bg-gradient-to-b from-slate-100 to-slate-900 pt-12 pb-4" />
      <div className="flex items-center justify-center p-4 -mt-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">{sub?.emoji || '🧠'}</div>
          <h1 className="text-3xl font-bold mb-2">{sub?.name || 'AI Tutor'}</h1>
          <p className="text-emerald-400 text-sm font-medium mb-4">Powered by The Math Academy Way</p>
          <p className="text-slate-400 mb-6">Adaptive learning that finds your gaps and fills them. {sub?.description} — {SKILL_COUNT} skills.</p>
          <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left text-sm text-slate-300 space-y-2">
            <p>🎯 <strong>Diagnostic test</strong> — ~40 questions to find your level</p>
            <p>🧩 <strong>Knowledge graph</strong> — maps all skill connections</p>
            <p>🔁 <strong>Spaced repetition</strong> — reviews skills before you forget</p>
            <p>🎓 <strong>Worked examples</strong> — teaches before testing</p>
          </div>
          <button onClick={startDiagnostic} className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-4 font-semibold text-lg transition-colors">Start Diagnostic Test</button>
          <button onClick={() => { setProgress(p => ({ ...p, diagnosed: true })); setView('home'); }} className="mt-4 text-slate-500 hover:text-slate-300 text-sm block mx-auto">Skip (start from scratch)</button>
        </div>
      </div>
    </div>
  );

  // ==================== RENDER: DIAGNOSTIC ====================

  if (view === 'diagnostic') {
    const { skills, index } = diagState;
    const skill = skills[index];
    if (!skill) return null;
    const pct = Math.round(((index + 1) / skills.length) * 100);

    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Light bridging header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">T</div>
              <div>
                <div className="text-sm font-bold text-slate-900">Diagnostic Test</div>
                <div className="text-xs text-slate-400">Question {index + 1} of {skills.length}</div>
              </div>
            </div>
            <div className="text-sm text-emerald-600 font-semibold">{pct}%</div>
          </div>
          <div className="h-1 bg-slate-100"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="bg-gradient-to-b from-slate-100 to-slate-900 h-8" />
        <div className="px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-xs text-slate-500 mb-2">Grade {skill.grade} — {skill.strand} — {skill.name}</div>
          <div className="bg-slate-800 rounded-2xl p-6 mb-4">
            <div className="text-lg mb-6 leading-relaxed">{problem?.question}</div>
            <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && handleDiagnosticAnswer()} disabled={!!feedback} className="w-full bg-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50" autoFocus placeholder="Your answer..." />
          </div>
          {feedback && <div className={`rounded-xl p-4 mb-4 ${feedback === 'correct' ? 'bg-emerald-900/50 border border-emerald-500' : 'bg-red-900/50 border border-red-500'}`}>{feedback === 'correct' ? <span className="text-emerald-400">✓ Correct!</span> : <span className="text-red-400">✗ Answer: {problem?.answer}</span>}</div>}
          {!feedback && <button onClick={handleDiagnosticAnswer} disabled={!answer.trim()} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl py-4 font-semibold transition-colors">Check</button>}
        </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: LESSON ====================

  if (view === 'lesson' && activeSkill) {
    const skill = SKILLS[activeSkill];
    const sp = progress.skills[activeSkill] || { attempts: 0, correct: 0, mastered: false };
    const pct = Math.min(100, (session.correct / skill.minProblems) * 100);

    return (
      <div className="min-h-screen bg-slate-900 text-white" onClick={() => activeTooltip && setActiveTooltip(null)}>
        {/* Light bridging header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={goHome} className="text-slate-400 hover:text-slate-600 flex items-center gap-1"><Icon name="back" className="w-4 h-4" /> Exit</button>
            <div className="text-center flex-1">
              <div className="text-xs text-slate-400">Grade {skill.grade} — {skill.strand}</div>
              <div className="font-semibold text-slate-900 text-sm">{skill.name}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-600 font-bold text-sm">{session.correct}/{skill.minProblems}</div>
              <div className="text-xs text-slate-400">to master</div>
            </div>
          </div>
          <div className="h-1 bg-slate-100"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="bg-gradient-to-b from-slate-100 to-slate-900 h-6" />
        <div className="px-4">
        <div className="max-w-2xl mx-auto">

          {session.streak >= 3 && <div className="bg-amber-900/30 border border-amber-600 rounded-lg p-2 mb-4 text-center text-amber-400 text-sm">🔥 {session.streak} streak!</div>}

          {/* Worked Example */}
          {showWorkedExample && (
            <div className="bg-slate-800 rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <Icon name="book" className="w-5 h-5" />
                <span className="font-semibold">Worked Example</span>
              </div>
              {(() => {
                const we = generateWorkedExample(activeSkill);
                if (!we) return <p className="text-slate-400">No worked example available. Let's practice!</p>;
                return (
                  <div>
                    {/* Concept Intro — explains key terms before the example */}
                    <ConceptIntro definitions={we.definitions} />

                    <div className="bg-slate-700/50 rounded-lg p-3 mb-4 font-medium">
                      <TermTooltip text={we.problem} definitions={we.definitions} />
                    </div>
                    <div className="space-y-2 mb-4">
                      {we.steps.map((step, i) => (
                        <div key={i}>
                          <div className="flex gap-3 text-sm">
                            <span className="text-emerald-400 font-bold min-w-[24px]">{i + 1}.</span>
                            <span className="text-slate-300 flex-1">
                              <TermTooltip text={step} definitions={we.definitions} />
                            </span>
                            {we.whySteps && we.whySteps[i] && (
                              <button
                                onClick={() => setExpandedWhySteps(prev => ({ ...prev, [i]: !prev[i] }))}
                                className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap transition-colors"
                              >
                                {expandedWhySteps[i] ? 'Hide' : 'Why?'}
                              </button>
                            )}
                          </div>
                          {expandedWhySteps[i] && we.whySteps && we.whySteps[i] && (
                            <div className="ml-9 mt-1 mb-2 p-2 bg-amber-900/20 border border-amber-700/30 rounded-lg text-xs text-amber-200 leading-relaxed">
                              {we.whySteps[i]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-emerald-900/30 border border-emerald-700 rounded-lg p-3">
                      <span className="text-emerald-400 font-semibold">Answer: </span>
                      <span className="font-mono">{we.solution}</span>
                    </div>
                  </div>
                );
              })()}
              <button onClick={startPractice} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl py-3 font-semibold transition-colors">Got it — Let me try!</button>
            </div>
          )}

          {/* Practice Problem */}
          {!showWorkedExample && problem && (
            <>
              {modalityLevel === 'concrete' && (
                <div className="bg-indigo-900/30 border border-indigo-600/40 rounded-xl p-3 mb-3 text-sm text-indigo-200 flex items-center gap-2">
                  <span>💡</span> Let's see this a different way — try it with the picture.
                </div>
              )}
              <div className="bg-slate-800 rounded-2xl p-6 mb-4">
                <div className="text-lg mb-6 leading-relaxed">
                  <TermTooltip text={problem.question} definitions={problem.workedExample?.definitions || problem.definitions} />
                </div>
                {/* Visual ANSWER widget (the problem is answered by interaction) */}
                {problem.visual ? (
                  <InteractiveVisual
                    visualType={problem.visual.type}
                    visualData={problem.visual.data}
                    onAnswer={setVisualAnswer}
                    disabled={!!feedback}
                  />
                ) : (
                  /* Otherwise, an exploratory manipulative if the skill has one */
                  activeSkill && SKILL_VISUALS[activeSkill] && (
                    <InteractiveVisual
                      visualType={SKILL_VISUALS[activeSkill].visualType}
                      visualData={SKILL_VISUALS[activeSkill].visualData}
                      onAnswer={setVisualAnswer}
                      disabled={!!feedback}
                    />
                  )
                )}
                <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && checkAnswer()} disabled={!!feedback} className="w-full bg-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50" autoFocus placeholder={problem.visual ? 'Click the grid above, or type the coordinate…' : 'Your answer...'} />

                {/* Layered hint display — shown on wrong attempts before final reveal */}
                {hintLevel >= 1 && !feedback && (
                  <div className="mt-4 p-3 bg-amber-900/30 border border-amber-700/40 rounded-lg text-amber-200 text-sm">
                    <span className="font-semibold text-amber-400">Hint:</span> {problem.hint || 'Double-check your calculation — look at each step carefully.'}
                  </div>
                )}
                {hintLevel >= 2 && !feedback && (() => {
                  // Prefer THIS problem's own solution steps; fall back to a
                  // worked example for legacy skills without structured steps.
                  const ownSteps = problem.solutionSteps;
                  const we = ownSteps ? null : generateWorkedExample(activeSkill);
                  const steps = ownSteps || we?.steps;
                  if (!steps) return null;
                  return (
                    <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg text-sm">
                      <span className="font-semibold text-blue-400">Here are the first steps to guide you:</span>
                      <div className="mt-2 space-y-1">
                        {steps.slice(0, 2).map((step, i) => (
                          <div key={i} className="flex gap-2 text-slate-300">
                            <span className="text-blue-400 font-bold">{i + 1}.</span>
                            <TermTooltip text={step} definitions={we?.definitions} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Correct answer feedback */}
              {feedback === 'correct' && (
                <div className="rounded-xl p-4 mb-4 bg-emerald-900/50 border border-emerald-500">
                  <span className="text-emerald-400 font-semibold">✓ Correct!</span>
                  {attemptCount > 1 && <span className="text-slate-400 text-sm ml-2">(attempt {attemptCount})</span>}
                </div>
              )}

              {/* Final incorrect feedback — only shown after 3 failed attempts */}
              {feedback === 'incorrect' && (
                <div className="rounded-xl p-4 mb-4 bg-red-900/50 border border-red-500">
                  <span className="text-red-400 font-semibold">Answer: <span className="font-mono">{problem.answer}</span></span>
                  {(() => {
                    // Show how THIS problem is solved when we have its steps;
                    // otherwise fall back to a worked example (legacy skills).
                    const ownSteps = problem.solutionSteps;
                    const we = ownSteps ? null : generateWorkedExample(activeSkill);
                    const steps = ownSteps || we?.steps;
                    if (!steps) return null;
                    return (
                      <div className="mt-3 pt-3 border-t border-red-700/30">
                        <span className="text-sm text-slate-400 mb-2 block">Here's the full worked solution:</span>
                        <div className="space-y-1">
                          {steps.map((step, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <span className="text-red-400/70 font-bold">{i + 1}.</span>
                              <span className="text-slate-300">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Remediation alert */}
              {remediationSkills && <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2"><Icon name="alert" className="w-5 h-5" /> Let's strengthen your foundations</div>
                <p className="text-sm text-slate-300 mb-3">You might need to practice these prerequisite skills first:</p>
                <div className="space-y-2">{remediationSkills.map(rs => (
                  <button key={rs.id} onClick={() => startLesson(rs.id)} className="w-full text-left p-3 bg-red-900/30 rounded-lg hover:bg-red-900/40 transition-colors">
                    <div className="font-medium text-red-300">{rs.name}</div>
                    <div className="text-xs text-slate-400">{rs.reason}</div>
                  </button>
                ))}</div>
              </div>}

              {!feedback ? <button onClick={checkAnswer} disabled={!answer.trim() && !(problem.visual && visualAnswer != null)} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl py-4 font-semibold transition-colors">{attemptCount > 0 ? 'Try Again' : 'Check Answer'}</button>
                : <button onClick={nextProblem} className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-colors">Next <Icon name="arrow" className="w-5 h-5" /></button>}
            </>
          )}
        </div>

        {/* Celebrations (mastery, level-up, achievements, daily goal) */}
        <CelebrationOverlay item={celebrations[0]} onDismiss={dismissCelebration} />
        </div>
      </div>
    );
  }

  // ==================== RENDER: REVIEW (TIMED) ====================

  if (view === 'review' && reviewProblems.length > 0) {
    const skillId = reviewProblems[reviewIndex];
    const skill = SKILLS[skillId];
    const pct = Math.round(((reviewIndex + 1) / reviewProblems.length) * 100);
    const mins = Math.floor(reviewTimer / 60);
    const secs = reviewTimer % 60;

    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Light bridging header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => { setReviewTimerActive(false); goHome(); }} className="text-slate-400 hover:text-slate-600 flex items-center gap-1"><Icon name="back" className="w-4 h-4" /> Exit</button>
            <div className="flex items-center gap-2 text-slate-500">
              <Icon name="clock" className="w-4 h-4" />
              <span className="font-mono text-sm">{mins}:{secs.toString().padStart(2, '0')}</span>
            </div>
            <div className="text-blue-600 font-bold text-sm">{reviewIndex + 1}/{reviewProblems.length}</div>
          </div>
          <div className="h-1 bg-slate-100"><div className="h-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="bg-gradient-to-b from-slate-100 to-slate-900 h-6" />
        <div className="px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-xs text-blue-400 mb-4 text-center font-medium">TIMED REVIEW — {skill?.name}</div>

          <div className="bg-slate-800 rounded-2xl p-6 mb-4">
            <div className="text-lg mb-6">{problem?.question}</div>
            <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && handleReviewAnswer()} disabled={!!feedback} className="w-full bg-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" autoFocus placeholder="Your answer..." />
          </div>

          {feedback && <div className={`rounded-xl p-4 mb-4 ${feedback === 'correct' ? 'bg-emerald-900/50 border border-emerald-500' : 'bg-red-900/50 border border-red-500'}`}>{feedback === 'correct' ? <span className="text-emerald-400">✓ Correct!</span> : <span className="text-red-400">✗ Answer: {problem?.answer}</span>}</div>}
          {!feedback && <button onClick={handleReviewAnswer} disabled={!answer.trim()} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl py-4 font-semibold transition-colors">Check</button>}
        </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: REVIEW COMPLETE ====================

  if (view === 'review-complete') {
    const accuracy = session.total > 0 ? Math.round((session.correct / session.total) * 100) : 0;
    const mins = Math.floor(reviewTimer / 60);
    const secs = reviewTimer % 60;

    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <CelebrationOverlay item={celebrations[0]} onDismiss={dismissCelebration} />
        <div className="max-w-md text-center">
          <Icon name="check" className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Review Complete!</h2>
          <div className="bg-slate-800 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between"><span className="text-slate-400">Accuracy</span><span className={`font-bold ${accuracy >= 80 ? 'text-emerald-400' : accuracy >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{accuracy}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Questions</span><span className="font-bold">{session.correct}/{session.total}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Time</span><span className="font-bold">{mins}m {secs}s</span></div>
          </div>
          <button onClick={goHome} className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-4 font-semibold transition-colors">Continue</button>
        </div>
      </div>
    );
  }

  // ==================== RENDER: HOME DASHBOARD ====================

  const jsPath = getRecommendedPath(progress, ctx);
  const gaps = findGaps(progress, ctx);
  const reviews = getReviews(progress, ctx);
  const strandStats = getStrandStats(progress, ctx);
  const gradeStats = getGradeStats(progress, ctx);
  const jsGrade = getEstimatedGradeLevel(progress, ctx);

  // Prefer the Python brain's measurement when available; else the JS engine.
  const path = brainPath || jsPath;
  const estimatedGrade = brainProfile ? Math.round(brainProfile.overall_level) : jsGrade;
  const brainAccelerated = brainProfile?.accelerated;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <CelebrationOverlay item={celebrations[0]} onDismiss={dismissCelebration} />
      {/* Bridging Header — matches main app's light nav, then transitions to dark */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>}
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">T</div>
            <div>
              <h1 className="text-base font-bold text-slate-900">{sub?.emoji} {sub?.shortName || 'AI Tutor'}</h1>
              <p className="text-xs text-slate-400">{gradeLabel(estimatedGrade)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {progress.currentStreak > 0 && <div className="flex items-center gap-1 text-amber-500"><Icon name="flame" className="w-4 h-4" /><span className="text-sm font-bold">{progress.currentStreak}d</span></div>}
            <div className="text-right">
              <div className="text-amber-500 font-bold flex items-center gap-1 text-sm"><Icon name="star" className="w-4 h-4" /> {progress.totalXP || 0}</div>
              <div className="text-xs text-slate-400">Level {level.level}</div>
            </div>
            {curriculaOptions.length > 1 && (
              <select
                value={curriculum}
                onChange={(e) => setProgress(p => ({ ...p, curriculum: e.target.value }))}
                title="Curriculum view"
                className="text-xs bg-slate-100 text-slate-700 rounded-md px-2 py-1 border border-slate-200 focus:outline-none"
              >
                {curriculaOptions.map(c => <option key={c.id} value={c.id}>{c.shortName}</option>)}
              </select>
            )}
            <button onClick={switchSubject} className="text-slate-300 hover:text-slate-500" title="Switch subject"><Icon name="book" className="w-4 h-4" /></button>
            <button onClick={resetAll} className="text-slate-300 hover:text-slate-500" title="Reset progress"><Icon name="refresh" className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Gradient bridge from light header into dark content */}
      <div className="bg-gradient-to-b from-slate-100 to-slate-900 pt-4 pb-2 px-4">
        <div className="max-w-2xl mx-auto">
          {/* XP Progress */}
          <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur rounded-xl px-4 py-2.5">
            <span className="text-xs text-slate-400">Lv {level.level}</span>
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-amber-500 transition-all" style={{ width: `${level.progress}%` }} /></div>
            <span className="text-xs text-slate-400">Lv {level.level + 1}</span>
            <span className="text-xs text-slate-500 ml-2">{SKILL_COUNT} skills</span>
            <button onClick={() => { setShowJoin(s => !s); setJoinStatus(null); }} className="ml-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors" title="Join your class">
              + Class
            </button>
          </div>

          {/* Daily goal — warm, returns-focused encouragement */}
          {(() => {
            const earned = todaysXP(progress);
            const pct = dailyGoalPercent(progress);
            const met = dailyGoalMet(progress);
            return (
              <div className="mt-2 bg-slate-800/80 backdrop-blur rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    {met ? '☀️ Daily goal reached!' : '🎯 Today’s goal'}
                  </span>
                  <span className="text-xs text-slate-400">{Math.min(earned, DAILY_GOAL_XP)}/{DAILY_GOAL_XP} XP</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${met ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {met
                    ? 'Wonderful — see you again tomorrow to keep your streak going.'
                    : progress.currentStreak > 0
                      ? `You’re on a ${progress.currentStreak}-day streak. A little practice keeps it alive!`
                      : 'Every small session adds up. Let’s make today count.'}
                </p>
              </div>
            );
          })()}
          {showJoin && (
            <div className="mt-2 bg-slate-800/80 backdrop-blur rounded-xl px-4 py-3">
              {joinStatus === 'ok' ? (
                <p className="text-sm text-emerald-400">✓ Joined! Your teacher can now see your progress.</p>
              ) : (
                <>
                  <p className="text-xs text-slate-400 mb-2">Enter the class code from your teacher:</p>
                  <div className="flex gap-2">
                    <input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && joinClass()}
                      placeholder="ABC123"
                      className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button onClick={joinClass} disabled={joinStatus === 'joining' || !joinCode.trim()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg text-sm font-semibold transition-colors">
                      {joinStatus === 'joining' ? '…' : 'Join'}
                    </button>
                  </div>
                  {joinStatus && joinStatus !== 'joining' && joinStatus !== 'ok' && (
                    <p className="text-xs text-red-400 mt-1.5">{joinStatus}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="flex gap-1 bg-slate-800 rounded-xl p-1 mb-4">
          {[['path', 'Learning Path', 'target'], ['skills', 'All Skills', 'map'], ['stats', 'Stats', 'bar'], ['awards', 'Awards', 'trophy']].map(([id, label, icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              <Icon name={icon} className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* ========== PATH TAB ========== */}
        {activeTab === 'path' && (
          <div>
            {/* Review banner */}
            {reviews.length > 0 && (
              <button onClick={startReview} className="w-full bg-gradient-to-r from-blue-900/50 to-blue-800/50 border border-blue-600 rounded-xl p-4 mb-4 flex items-center justify-between hover:from-blue-900/70 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><Icon name="refresh" className="w-5 h-5" /></div>
                  <div className="text-left">
                    <div className="font-semibold">Review Session</div>
                    <div className="text-xs text-blue-300">{reviews.length} skills due — timed & interleaved</div>
                  </div>
                </div>
                <Icon name="arrow" className="w-5 h-5 text-blue-400" />
              </button>
            )}

            {/* Gaps alert */}
            {gaps.length > 0 && (
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2"><Icon name="alert" className="w-5 h-5" /> Foundation Gaps Detected</div>
                <p className="text-sm text-slate-300 mb-3">These prerequisite skills need work:</p>
                <div className="flex flex-wrap gap-2">{gaps.slice(0, 3).map(g => <span key={g.id} className="px-2 py-1 bg-red-900/30 rounded text-sm text-red-300">{g.name}</span>)}</div>
              </div>
            )}

            {/* Recommended path */}
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Icon name="target" className="w-5 h-5 text-emerald-400" /> Your Learning Path</h2>
            {path.length > 0 ? (
              <div className="space-y-2 mb-6">{path.map((s, i) => (
                <button key={s.id} onClick={() => startLesson(s.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${s.type === 'gap' ? 'bg-red-900/20 border border-red-800 hover:bg-red-900/30' : s.type === 'review' ? 'bg-blue-900/20 border border-blue-800 hover:bg-blue-900/30' : s.type === 'remediation' ? 'bg-amber-900/20 border border-amber-800' : 'bg-slate-800 hover:bg-slate-700'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${s.type === 'gap' ? 'bg-red-600' : s.type === 'review' ? 'bg-blue-600' : 'bg-emerald-600'}`}>{i + 1}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center gap-2">{s.name}{s.critical && <Icon name="zap" className="w-4 h-4 text-amber-400" />}</div>
                    <div className="text-xs text-slate-400">{s._brain ? `${s.type === 'gap' ? '⚠️ ' : s.type === 'review' ? '🔄 ' : s.type === 'stretch' ? '🚀 ' : ''}${s.reason}` : s.type === 'gap' ? `⚠️ ${s.reason}` : s.type === 'review' ? `🔄 Review (${s.daysSince}d ago)` : `Grade ${s.grade} — ${s.strand}`}</div>
                  </div>
                  <Icon name="arrow" className="w-5 h-5 text-slate-500" />
                </button>
              ))}</div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <Icon name="trophy" className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="font-semibold mb-1">Amazing work!</p>
                <p className="text-sm">All available skills are mastered. Check back for reviews.</p>
              </div>
            )}

            {/* Overall progress */}
            <div className="bg-slate-800 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300">Overall Mastery</span>
                <span className="text-emerald-400 font-bold">{stats.percent}% ({stats.mastered}/{stats.total})</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${stats.percent}%` }} /></div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">{strandStats.map(s => (
                <div key={s.name} className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-slate-400 text-xs">{s.name}</div>
                  <div className="font-bold">{s.percent}%</div>
                  {s.accuracy !== null && s.accuracy < 70 && <div className="text-xs text-red-400">⚠️ {s.accuracy}%</div>}
                </div>
              ))}</div>
            </div>
          </div>
        )}

        {/* ========== SKILLS TAB ========== */}
        {activeTab === 'skills' && (
          <div className="space-y-3">
            {(() => {
              // Group all skills by the active curriculum's band (grade/stage),
              // falling back to native grade for untagged skills so nothing is
              // hidden — out-of-scope skills are labelled "enrichment" instead.
              const byBand = {};
              Object.values(sub.skills).forEach(s => {
                const g = gradeOf(s, curriculum);
                (byBand[g] = byBand[g] || []).push(s);
              });
              return Object.keys(byBand).map(Number).sort((a, b) => a - b);
            })().map(grade => {
              const gradeSkills = Object.values(sub.skills).filter(s => gradeOf(s, curriculum) === grade);
              const mastered = gradeSkills.filter(s => progress.skills[s.id]?.mastered).length;
              const isExp = expanded === grade;

              // Group by the active curriculum's strand within the band
              const byStrand = {};
              gradeSkills.forEach(s => {
                const strand = strandOf(s, curriculum);
                if (!byStrand[strand]) byStrand[strand] = [];
                byStrand[strand].push(s);
              });

              return (
                <div key={grade}>
                  <button onClick={() => setExpanded(isExp ? null : grade)} className="w-full flex items-center justify-between bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${grade <= 6 ? 'bg-green-600' : grade <= 8 ? 'bg-blue-600' : grade <= 10 ? 'bg-purple-600' : 'bg-red-600'}`}>{grade}</div>
                      <div className="text-left">
                        <div className="font-semibold">{gradeLabel(grade)}</div>
                        <div className="text-sm text-slate-400">{mastered}/{gradeSkills.length} mastered</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(mastered / gradeSkills.length) * 100}%` }} /></div>
                      <Icon name={isExp ? 'up' : 'down'} className="w-5 h-5" />
                    </div>
                  </button>
                  {isExp && (
                    <div className="mt-2 space-y-3 pl-2">
                      {Object.entries(byStrand).map(([strand, skills]) => (
                        <div key={strand}>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 px-2">{strand}</div>
                          <div className="space-y-1">{skills.map(skill => {
                            const status = getStatus(skill.id, progress, ctx);
                            const sp = progress.skills[skill.id];
                            return (
                              <button key={skill.id} onClick={() => status !== 'locked' && startLesson(skill.id)} disabled={status === 'locked'} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${status === 'locked' ? 'bg-slate-800/50 opacity-50 cursor-not-allowed' : status === 'mastered' ? 'bg-emerald-900/20 border border-emerald-800' : status === 'in_progress' ? 'bg-blue-900/20 border border-blue-800' : 'bg-slate-800 hover:bg-slate-700'}`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${status === 'locked' ? 'bg-slate-700' : status === 'mastered' ? 'bg-emerald-600' : status === 'in_progress' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                                  {status === 'locked' ? <Icon name="lock" className="w-3.5 h-3.5" /> : status === 'mastered' ? <Icon name="check" className="w-3.5 h-3.5" /> : status === 'in_progress' ? <Icon name="trend" className="w-3.5 h-3.5" /> : <Icon name="play" className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="text-sm font-medium flex items-center gap-2">{skill.name}{skill.critical && <Icon name="zap" className="w-3.5 h-3.5 text-amber-400" />}{isEnrichment(skill, curriculum) && <span className="text-[10px] uppercase tracking-wide text-amber-300/80 bg-amber-900/30 rounded px-1.5 py-0.5">Enrichment</span>}</div>
                                  {sp?.attempts > 0 && <div className="text-xs text-slate-400">{sp.correct}/{sp.attempts} ({Math.round((sp.correct / sp.attempts) * 100)}%)</div>}
                                </div>
                              </button>
                            );
                          })}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========== STATS TAB ========== */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Big numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{stats.mastered}</div>
                <div className="text-sm text-slate-400">Skills Mastered</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-400">{progress.totalXP || 0}</div>
                <div className="text-sm text-slate-400">Total XP</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.accuracy}%</div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{progress.currentStreak || 0}</div>
                <div className="text-sm text-slate-400">Day Streak</div>
              </div>
            </div>

            {/* Grade breakdown */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Grade Progress</h3>
              <div className="space-y-2">{gradeStats.map(gs => (
                <div key={gs.grade} className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 w-24">{sub?.gradeNames?.[gs.grade] || `Grade ${gs.grade}`}</span>
                  <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${gs.percent}%` }} /></div>
                  <span className="text-sm font-medium w-12 text-right">{gs.percent}%</span>
                </div>
              ))}</div>
            </div>

            {/* Strand breakdown */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Strand Mastery</h3>
              <div className="space-y-2">{strandStats.map(ss => (
                <div key={ss.name} className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 w-24">{ss.name}</span>
                  <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${ss.percent}%` }} /></div>
                  <span className="text-sm font-medium w-12 text-right">{ss.mastered}/{ss.total}</span>
                </div>
              ))}</div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button onClick={startDiagnostic} className="w-full p-3 bg-slate-800 rounded-xl text-emerald-400 hover:bg-slate-700 transition-colors text-sm font-medium">Retake Diagnostic Test</button>
            </div>
          </div>
        )}

        {/* ========== AWARDS TAB ========== */}
        {activeTab === 'awards' && (() => {
          const unlocked = new Set(progress.achievements || []);
          return (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">{unlocked.size}<span className="text-slate-500 text-lg">/{ACHIEVEMENTS.length}</span></div>
                <div className="text-sm text-slate-400">Badges earned — keep going, every one is a win!</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACHIEVEMENTS.map(a => {
                  const got = unlocked.has(a.id);
                  return (
                    <div key={a.id} className={`rounded-2xl p-4 text-center border transition-colors ${got ? 'bg-amber-900/15 border-amber-700/50' : 'bg-slate-800/60 border-slate-700/50'}`}>
                      <div className={`text-3xl mb-1 ${got ? '' : 'grayscale opacity-40'}`}>{a.icon}</div>
                      <div className={`text-sm font-semibold ${got ? 'text-white' : 'text-slate-400'}`}>{a.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
                      {got && <div className="text-[10px] uppercase tracking-wide text-amber-300/80 mt-1">Earned</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600 text-xs space-y-1 pb-8">
          <p>Powered by The Math Academy Way methodology</p>
          <p>🎯 Adaptive learning path · 🔁 Spaced repetition · 🧩 Knowledge graph</p>
        </div>
      </div>
    </div>
  );
}

export default AIMastery;
