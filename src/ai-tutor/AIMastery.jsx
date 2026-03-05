// ============================================================================
// TUTAGORA AI MASTERY — Main Component
// Adaptive Math Learning based on "The Math Academy Way"
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { SKILLS, SKILL_COUNT, STRANDS, GRADES, getSkillsByGrade, getPostRequisites } from './knowledgeGraph.js';
import { generateProblem, generateWorkedExample } from './problemGenerators.js';
import { getStatus, getRecommendedPath, findGaps, getReviews, getNextToLearn, getStats, getStrandStats, getGradeStats, getEstimatedGradeLevel, getDiagnosticSkills as getAdaptiveDiagnosticSkills, getRemediationSkills, calculateXP, getLevel, selectReviewProblems } from './adaptiveEngine.js';
import { processReviewResult, applyImplicitCredits, calculateMemoryStrength } from './spacedRepetition.js';
import { propagateCredit, getTimeWeight, selectNextQuestion, processDiagnosticResults } from './diagnosticEngine.js';
import { defaultProgress, loadProgress, saveProgress, forceSave, updateStreak } from './progressStore.js';
import { Icon } from './components/Icons.jsx';

const skillList = Object.values(SKILLS);

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

// ==================== MAIN COMPONENT ====================

export function AIMastery({ onBack, userId }) {
  const [progress, setProgress] = useState(defaultProgress);
  const [view, setView] = useState('loading');
  const [loading, setLoading] = useState(true);

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
  const [celebration, setCelebration] = useState(null);

  // ==================== LOAD PROGRESS ====================

  useEffect(() => {
    (async () => {
      const p = await loadProgress(userId);
      setProgress(p);
      setView(p.diagnosed ? 'home' : 'welcome');
      setLoading(false);
    })();
  }, [userId]);

  // Auto-save on progress change
  useEffect(() => {
    if (!loading) saveProgress(userId, progress);
  }, [progress, userId, loading]);

  // Save on unmount
  useEffect(() => {
    return () => { if (!loading) forceSave(userId, progress); };
  }, []);

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
    const skills = getAdaptiveDiagnosticSkills(progress);
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

    const newBalances = propagateCredit(balances, skill.id, correct, timeWeight);
    const newResults = { ...results, [skill.id]: { correct, timeTaken } };

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
        const skillUpdates = processDiagnosticResults(newBalances);
        setProgress(p => ({
          ...p,
          skills: { ...p.skills, ...skillUpdates },
          diagnosed: true,
          diagnosticBalances: newBalances,
        }));
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
    const we = generateWorkedExample(skillId);
    setShowWorkedExample(!!we);
    setProblem(we ? null : generateProblem(skillId));
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setRemediationSkills(null);
    setView('lesson');
  };

  const startPractice = () => {
    setShowWorkedExample(false);
    setProblem(generateProblem(activeSkill));
    setAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!answer.trim() || feedback) return;
    const correct = checkAnswerMatch(answer, problem);

    setFeedback(correct ? 'correct' : 'incorrect');
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
    let updatedSkills = applyImplicitCredits(progress, activeSkill, correct);

    const updatedSp = processReviewResult(sp, correct);
    updatedSp.attempts = newAttempts;
    updatedSp.correct = newCorrect;
    if (shouldMaster && !sp.mastered) {
      updatedSp.mastered = true;
      updatedSp.repNum = 2;
    }

    updatedSkills = { ...updatedSkills, [activeSkill]: updatedSp };

    // Check for targeted remediation (2 consecutive failures on same KP)
    if (!correct) {
      const newFailCount = lessonFailCount + 1;
      setLessonFailCount(newFailCount);
      if (newFailCount >= 2) {
        const remSkills = getRemediationSkills(activeSkill, kpIndex, progress);
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

    const updatedProgress = updateStreak({
      ...progress,
      skills: updatedSkills,
      totalXP: (progress.totalXP || 0) + xpEarned,
    });

    setProgress(updatedProgress);

    // Celebration on mastery
    if (shouldMaster && !sp.mastered) {
      setTimeout(() => setCelebration({ skill: skill.name, xp: xpEarned }), 500);
    }
  };

  const nextProblem = () => {
    setProblem(generateProblem(activeSkill));
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  // ==================== REVIEW (TIMED, INTERLEAVED) ====================

  const startReview = () => {
    const problems = selectReviewProblems(progress, 12);
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

    setFeedback(correct ? 'correct' : 'incorrect');
    setSession(s => ({ ...s, correct: s.correct + (correct ? 1 : 0), total: s.total + 1, streak: correct ? s.streak + 1 : 0 }));

    // Update skill progress with spaced repetition
    const sp = progress.skills[skillId] || { attempts: 0, correct: 0, mastered: false, repNum: 0, learningSpeed: 1.0 };
    const updatedSp = processReviewResult(sp, correct);
    updatedSp.attempts = sp.attempts + 1;
    updatedSp.correct = sp.correct + (correct ? 1 : 0);

    let updatedSkills = applyImplicitCredits(progress, skillId, correct);
    updatedSkills = { ...updatedSkills, [skillId]: updatedSp };

    setProgress(p => updateStreak({
      ...p,
      skills: updatedSkills,
      totalXP: (p.totalXP || 0) + (correct ? 3 : 0),
    }));

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
        setProgress(p => ({ ...p, totalXP: (p.totalXP || 0) + xp, sessionsCompleted: (p.sessionsCompleted || 0) + 1 }));
        setView('review-complete');
      }
    }, 800);
  };

  // ==================== NAVIGATION ====================

  const goHome = () => { setView('home'); setActiveSkill(null); setCelebration(null); setRemediationSkills(null); };
  const resetAll = () => { if (confirm('Reset ALL progress? This cannot be undone.')) { const fresh = defaultProgress(); setProgress(fresh); forceSave(userId, fresh); setView('welcome'); } };

  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

  const stats = getStats(progress);
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
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="text-3xl font-bold mb-2">Tutagora AI Tutor</h1>
          <p className="text-emerald-400 text-sm font-medium mb-4">Powered by The Math Academy Way</p>
          <p className="text-slate-400 mb-6">Adaptive learning that finds your gaps and fills them. Covering Grade 5-12 math with {SKILL_COUNT} skills.</p>
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
      <div className="min-h-screen bg-slate-900 text-white">
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
                    <div className="bg-slate-700/50 rounded-lg p-3 mb-4 font-medium">{we.problem}</div>
                    <div className="space-y-2 mb-4">
                      {we.steps.map((step, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <span className="text-emerald-400 font-bold min-w-[24px]">{i + 1}.</span>
                          <span className="text-slate-300">{step}</span>
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
              <div className="bg-slate-800 rounded-2xl p-6 mb-4">
                <div className="text-lg mb-6 leading-relaxed">{problem.question}</div>
                <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && checkAnswer()} disabled={!!feedback} className="w-full bg-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50" autoFocus placeholder="Your answer..." />
                {problem.hint && !feedback && <button onClick={() => setShowHint(!showHint)} className="mt-3 text-sm text-amber-400">{showHint ? '🙈 Hide hint' : '💡 Show hint'}</button>}
                {showHint && problem.hint && <div className="mt-2 p-3 bg-amber-900/30 rounded-lg text-amber-200 text-sm">💡 {problem.hint}</div>}
              </div>

              {feedback && <div className={`rounded-xl p-4 mb-4 ${feedback === 'correct' ? 'bg-emerald-900/50 border border-emerald-500' : 'bg-red-900/50 border border-red-500'}`}>{feedback === 'correct' ? <span className="text-emerald-400 font-semibold">✓ Correct!</span> : <div><span className="text-red-400 font-semibold">✗ Not quite</span><div className="text-slate-300 mt-1">Answer: <span className="font-mono">{problem.answer}</span></div></div>}</div>}

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

              {!feedback ? <button onClick={checkAnswer} disabled={!answer.trim()} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl py-4 font-semibold transition-colors">Check Answer</button>
                : <button onClick={nextProblem} className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-colors">Next <Icon name="arrow" className="w-5 h-5" /></button>}
            </>
          )}
        </div>

        {/* Mastery Celebration */}
        {celebration && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => { setCelebration(null); goHome(); }}>
          <div className="bg-slate-800 rounded-3xl p-8 text-center max-w-sm" onClick={e => e.stopPropagation()}>
            <Icon name="trophy" className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Skill Mastered! 🎉</h2>
            <p className="text-slate-400 mb-2">{celebration.skill}</p>
            <p className="text-emerald-400 font-bold text-lg mb-6">+{celebration.xp} XP</p>
            <button onClick={() => { setCelebration(null); goHome(); }} className="bg-emerald-600 hover:bg-emerald-500 rounded-xl px-8 py-3 font-semibold transition-colors">Continue</button>
          </div>
        </div>}
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

  const path = getRecommendedPath(progress);
  const gaps = findGaps(progress);
  const reviews = getReviews(progress);
  const strandStats = getStrandStats(progress);
  const gradeStats = getGradeStats(progress);
  const estimatedGrade = getEstimatedGradeLevel(progress);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Bridging Header — matches main app's light nav, then transitions to dark */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>}
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">T</div>
            <div>
              <h1 className="text-base font-bold text-slate-900">AI Tutor</h1>
              <p className="text-xs text-slate-400">Grade {estimatedGrade} Level</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {progress.currentStreak > 0 && <div className="flex items-center gap-1 text-amber-500"><Icon name="flame" className="w-4 h-4" /><span className="text-sm font-bold">{progress.currentStreak}d</span></div>}
            <div className="text-right">
              <div className="text-amber-500 font-bold flex items-center gap-1 text-sm"><Icon name="star" className="w-4 h-4" /> {progress.totalXP || 0}</div>
              <div className="text-xs text-slate-400">Level {level.level}</div>
            </div>
            <button onClick={resetAll} className="text-slate-300 hover:text-slate-500"><Icon name="refresh" className="w-4 h-4" /></button>
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="flex gap-1 bg-slate-800 rounded-xl p-1 mb-4">
          {[['path', 'Learning Path', 'target'], ['skills', 'All Skills', 'map'], ['stats', 'Stats', 'bar']].map(([id, label, icon]) => (
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
                    <div className="text-xs text-slate-400">{s.type === 'gap' ? `⚠️ ${s.reason}` : s.type === 'review' ? `🔄 Review (${s.daysSince}d ago)` : `Grade ${s.grade} — ${s.strand}`}</div>
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
            {GRADES.map(grade => {
              const gradeSkills = getSkillsByGrade(grade);
              const mastered = gradeSkills.filter(s => progress.skills[s.id]?.mastered).length;
              const isExp = expanded === grade;

              // Group by strand within grade
              const byStrand = {};
              gradeSkills.forEach(s => {
                if (!byStrand[s.strand]) byStrand[s.strand] = [];
                byStrand[s.strand].push(s);
              });

              return (
                <div key={grade}>
                  <button onClick={() => setExpanded(isExp ? null : grade)} className="w-full flex items-center justify-between bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${grade <= 6 ? 'bg-green-600' : grade <= 8 ? 'bg-blue-600' : grade <= 10 ? 'bg-purple-600' : 'bg-red-600'}`}>{grade}</div>
                      <div className="text-left">
                        <div className="font-semibold">Grade {grade}</div>
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
                            const status = getStatus(skill.id, progress);
                            const sp = progress.skills[skill.id];
                            return (
                              <button key={skill.id} onClick={() => status !== 'locked' && startLesson(skill.id)} disabled={status === 'locked'} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${status === 'locked' ? 'bg-slate-800/50 opacity-50 cursor-not-allowed' : status === 'mastered' ? 'bg-emerald-900/20 border border-emerald-800' : status === 'in_progress' ? 'bg-blue-900/20 border border-blue-800' : 'bg-slate-800 hover:bg-slate-700'}`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${status === 'locked' ? 'bg-slate-700' : status === 'mastered' ? 'bg-emerald-600' : status === 'in_progress' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                                  {status === 'locked' ? <Icon name="lock" className="w-3.5 h-3.5" /> : status === 'mastered' ? <Icon name="check" className="w-3.5 h-3.5" /> : status === 'in_progress' ? <Icon name="trend" className="w-3.5 h-3.5" /> : <Icon name="play" className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="text-sm font-medium flex items-center gap-2">{skill.name}{skill.critical && <Icon name="zap" className="w-3.5 h-3.5 text-amber-400" />}</div>
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
                  <span className="text-sm text-slate-400 w-16">Grade {gs.grade}</span>
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
