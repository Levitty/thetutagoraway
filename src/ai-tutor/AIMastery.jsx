// ============================================================================
// TUTAGORA AI MASTERY — Main Component
// Adaptive learning based on "The Math Academy Way" — supports multiple subjects
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SUBJECTS, SUBJECT_LIST, DEFAULT_SUBJECT } from './subjects.js';
import { getStatus, getRecommendedPath, findGaps, getReviews, getNextToLearn, getStats, getStrandStats, getGradeStats, getEstimatedGradeLevel, getDiagnosticSkills as getAdaptiveDiagnosticSkills, computePlacementGrade, getEffectivePlacement, getRemediationSkills, calculateXP, getLevel, selectReviewProblems } from './adaptiveEngine.js';
import { processReviewResult, applyImplicitCredits, calculateMemoryStrength, fluencyExpectedMs } from './spacedRepetition.js';
import { propagateCredit, getTimeWeight, selectNextQuestion, processDiagnosticResults } from './diagnosticEngine.js';
import { HorebBot } from './HorebBot.jsx';
import { AreaModel, parseAreaProblem } from './AreaModel.jsx';
import { computeSteps, diagnoseError, genericNudge } from './remediation.js';
import { shouldInterleave, pickInterleavedReview } from './interleave.js';
import { defaultProgress, loadProgress, loadLocalProgress, saveProgress, forceSave, updateStreak } from './progressStore.js';
import { NATIVE, curriculaForSubject, gradeOf, strandOf, isEnrichment, bandLabel, getCurriculum } from './curricula.js';
import { gainXP, todaysXP, dailyGoalPercent, dailyGoalMet, DAILY_GOAL_XP, ACHIEVEMENTS, evaluateAchievements, getAchievement, encourage } from './gamification.js';
import { getBrainProfile, getBrainSession } from './engineClient.js';
import { logResponse } from './telemetry.js';
import { SUPPORT, SUPPORT_LABEL, initialSupportLevel, nextSupportLevel, completionPlan, exampleSupport } from './fadedExamples.js';
import YoungLearnerLesson, { planYoungLesson } from './YoungLearnerLesson.jsx';
import BridgeLesson, { planBridgeLesson } from './BridgeLesson.jsx';
import { supabase } from '../supabase.js';
import { Icon } from './components/Icons.jsx';
import { Lottie, LOTTIE } from './components/Lottie.jsx';
import { InteractiveVisual, SKILL_VISUALS } from './InteractiveVisual.jsx';
import { checkVisualAnswer } from './content/visual.js';
import { checkAnswerMatch, normalizeMath } from './answerCheck.js';
import { canPractice } from '../subscription.js';

// ==================== SMART ANSWER MATCHING ====================
// Tolerant answer grading lives in ./answerCheck.js (so it can be unit-tested).
// Normalizes math expressions so equivalent forms match:
//   "2(x) = 12"  ↔  "2x = 12"
//   "5x + 3"     ↔  "5x+3"
//   "x = -3"     ↔  "x=-3"
//   "3/4"        ↔  "3 / 4"
//   "(−2, 5)"    ↔  "(-2, 5)"  ↔  "(-2,5)"
// (Implementation in ./answerCheck.js — imported above.)

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

export function AIMastery({ onBack, userId, studentName, onFindTutor, subscription = null, onPaywall }) {
  const [subjectId, setSubjectId] = useState(DEFAULT_SUBJECT); // default subject; switch via header. null = picker
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
  const getKpCount = sub?.kpCount || (() => 1);

  // Active syllabus view (CBC/CBE, Cambridge, or native). Persisted per subject
  // inside progress so it survives reloads / other devices.
  const curriculum = progress.curriculum || NATIVE;
  const curriculaOptions = useMemo(() => curriculaForSubject(sub), [sub]);

  // Engine context — passed to adaptive/spaced/diagnostic engines.
  // We derive the full prerequisite/post-requisite CHAIN walkers from the
  // subject's own graph. Without these, the engines silently fell back to the
  // math chains, so credit propagation / implicit review / gap detection did
  // nothing for non-math subjects (AFM/APM). Now every subject gets real graph
  // propagation against its OWN skill ids.
  const ctx = useMemo(() => {
    if (!sub) return null;
    const skills = sub.skills;
    const postReqs = sub.getPostReqs || (() => []);
    const getPreChain = (id, visited = new Set()) => {
      if (visited.has(id)) return [];
      visited.add(id);
      const s = skills[id];
      if (!s) return [];
      const chain = [...(s.prerequisites || [])];
      for (const p of (s.prerequisites || [])) chain.push(...getPreChain(p, visited));
      return [...new Set(chain)];
    };
    const getPostChain = (id, visited = new Set()) => {
      if (visited.has(id)) return [];
      visited.add(id);
      const posts = (postReqs(id) || []).map(p => (p && p.id) ? p.id : p);
      const chain = [...posts];
      for (const pid of posts) chain.push(...getPostChain(pid, visited));
      return [...new Set(chain)];
    };
    return { skills, getPostReqs: sub.getPostReqs, getPreChain, getPostChain, curriculum };
  }, [sub, curriculum]);

  // Per-child HOREB: a parent account can run the engine for each of their
  // children separately. activeLearner === null means the account holder
  // practises; a child means that child's own namespaced progress (its own
  // profile key + cloud row), still owned by the parent uid for RLS.
  const [learners, setLearners] = useState([]);
  const [activeLearner, setActiveLearner] = useState(null);
  useEffect(() => {
    if (!userId) { setLearners([]); return; }
    supabase.from('children').select('id, name, grade').eq('parent_id', userId).order('created_at')
      .then(({ data }) => setLearners(data || []));
  }, [userId]);
  const learnerBase = activeLearner ? `${userId}_c${activeLearner.id}` : userId;
  const learnerId = activeLearner?.id || null;
  const keyFor = useCallback(
    (subj) => (subj === 'math' ? learnerBase : `${learnerBase}_${subj}`),
    [learnerBase],
  );

  // Lesson / Practice state
  const [activeSkill, setActiveSkill] = useState(null);
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [session, setSession] = useState({ correct: 0, total: 0, streak: 0, startTime: null });
  // Interleaved review interlude inside a lesson (Rohrer): { skillId, name } | null.
  const [interleave, setInterleave] = useState(null);
  const interleaveCountRef = useRef(0);
  const [kpIndex, setKpIndex] = useState(0);
  // Ref mirror so problem generation always reads the CURRENT knowledge-point,
  // even when nextProblem() runs synchronously right after finalizeResult().
  const kpIndexRef = useRef(0);
  const [showWorkedExample, setShowWorkedExample] = useState(true);
  const [lessonFailCount, setLessonFailCount] = useState(0);
  // CPA modality: 'abstract' (symbols) by default; escalates to 'concrete'
  // (manipulatives / pictures) when the student struggles with a skill.
  const [modalityLevel, setModalityLevel] = useState('abstract');
  const [visualAnswer, setVisualAnswer] = useState(null);

  // Diagnostic state (adaptive: running evidence + a moving focus grade, not a fixed list)
  const [diagState, setDiagState] = useState({ answered: [], balances: {}, results: {}, startTimes: {}, current: null, focus: null, perGrade: {} });
  // Snapshots of each answered question so "Previous" can step back and rollback
  // the evidence (in-session only — not restored across a reload/resume).
  const [diagHistory, setDiagHistory] = useState([]);

  // Review state
  const [reviewProblems, setReviewProblems] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewTimer, setReviewTimer] = useState(0);
  const [reviewTimerActive, setReviewTimerActive] = useState(false);

  // UI state
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [remediationSkills, setRemediationSkills] = useState(null);
  // Celebration queue: skill mastery, level-ups, achievements, daily goal.
  const [celebrations, setCelebrations] = useState([]);

  // Layered hints + tooltips state
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintLevel, setHintLevel] = useState(0); // 0=none, 1=hint, 2=partial steps, 3=full reveal
  const [wrongInfo, setWrongInfo] = useState(null); // { answer, diagnosis } | { needNumber:true } — feedback on the last wrong try
  // "GPS brain" (Skycak): reaching for help before trying means you never build
  // the internal map. The worked example is the map — shown first. During
  // practice, help is roadside assistance: it appears once the child has sat
  // with the problem (or after any attempt), never as a reflex tap.
  const HINT_UNLOCK_MS = 20000;
  const [hintUnlocked, setHintUnlocked] = useState(false);

  // Faded worked examples (Renkl completion problems). `scaffoldLevel` is the
  // live support level (0 guided … 3 solo); the ref mirrors it for the
  // synchronous finalize path. `answeredLevel` freezes the level the current
  // problem was ANSWERED at (for the post-answer self-explanation card), and
  // `scaffoldableRef` records whether this problem could be scaffolded at all
  // — the mastery guard only bites when support was actually on offer.
  const [scaffoldLevel, setScaffoldLevel] = useState(SUPPORT.SOLO);
  const scaffoldRef = useRef(SUPPORT.SOLO);
  const scaffoldableRef = useRef(false);
  const [answeredLevel, setAnsweredLevel] = useState(null);
  const [selfExplainOpen, setSelfExplainOpen] = useState(false);
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
  useEffect(() => {
    setHintUnlocked(false);
    if (!problem) return undefined;
    const t = setTimeout(() => setHintUnlocked(true), HINT_UNLOCK_MS);
    return () => clearTimeout(t);
  }, [problem]);

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
    if (!userId) return; // transient auth gap — don't reload with no user / clobber state
    let cancelled = false;
    const storageKey = keyFor(subjectId);

    // Apply a loaded progress object: resume an in-progress diagnostic, or pick
    // the entry view. Shared by the instant local paint and the cloud path.
    const apply = (p) => {
      setProgress(p);

      // Resume an unfinished diagnostic exactly where the student left off — the
      // same current question, all evidence so far, and the focus grade. The
      // candidate pool is the full skill list, rebuilt fresh from the subject.
      const dip = p.diagInProgress;
      if (!p.diagnosed && dip && dip.subjectId === subjectId && dip.currentId && Array.isArray(dip.answered)) {
        try {
          const cur = ctx?.skills?.[dip.currentId];
          if (!cur) throw new Error('current skill not found');
          setDiagState({ answered: dip.answered, balances: dip.balances || {}, results: dip.results || {}, startTimes: { [cur.id]: Date.now() }, current: cur, focus: dip.focus ?? p.declaredGrade, perGrade: dip.perGrade || {} });
          setDiagHistory([]); // snapshots aren't persisted; can't step back past a reload
          setProblem(dip.problem || generateProblem(cur.id));
          setAnswer(''); setVisualAnswer(null); setFeedback(null);
          setView('diagnostic');
          setLoading(false);
          return;
        } catch { /* corrupt cursor — fall through to the normal entry view */ }
      }

      // Resume an in-progress LESSON at the same point. Leaving mid-skill — a web
      // refresh, or the native app being backgrounded/killed — used to drop the
      // learner back to the start (the "3/6, come back, start over" bug). The
      // diagnostic already saved a cursor; regular lessons never did. Restores
      // the mastery count, the knowledge-point position and the support level;
      // serves a fresh problem rather than reviving the exact one on screen.
      const lip = p.lessonInProgress;
      if (p.diagnosed && lip && lip.skillId && SKILLS[lip.skillId] && ctx?.skills?.[lip.skillId] && (lip.session?.total > 0)) {
        try {
          setActiveSkill(lip.skillId);
          setSession(lip.session);
          setKpIndex(lip.kpIndex || 0); kpIndexRef.current = lip.kpIndex || 0;
          setModalityLevel(lip.modalityLevel || 'abstract');
          if (lip.scaffoldLevel != null) { scaffoldRef.current = lip.scaffoldLevel; setScaffoldLevel(lip.scaffoldLevel); }
          setShowWorkedExample(false);
          setProblem(serveLessonProblem(lip.skillId, lip.modalityLevel || 'abstract'));
          setAnswer(''); setVisualAnswer(null); setFeedback(null); setAttemptCount(0); setHintLevel(0);
          setView(prev => (prev === 'diagnostic' || prev === 'review' || prev === 'review-complete') ? prev : 'lesson');
          setLoading(false);
          return;
        } catch { /* corrupt cursor — fall through to the normal entry view */ }
      }

      // Only (re)set the entry view on a genuine load. If this effect re-fires
      // while the student is mid-activity (e.g. an auth token refresh briefly
      // changes userId), NEVER yank them out of an in-progress diagnostic,
      // lesson, or review — that was sending them back to the welcome screen.
      setView(prev =>
        (prev === 'diagnostic' || prev === 'lesson' || prev === 'review' || prev === 'review-complete' || prev === 'welcome')
          ? prev
          : (p.diagnosed ? 'home' : 'welcome'));
      setLoading(false);
    };

    // Fast path: a returning learner already has a local copy. Paint it at once
    // so the screen never waits on the network, then reconcile the cloud copy in
    // the background and adopt it only if the learner is still on the landing
    // view (never yank them out of an activity they've since started).
    const local = loadLocalProgress(storageKey);
    if (local) {
      apply(local);
      loadProgress(storageKey, userId).then(merged => {
        if (cancelled || !merged || merged === local) return;
        setProgress(merged);
        setView(prev => prev === 'welcome' && merged.diagnosed ? 'home'
                       : prev === 'home' && !merged.diagnosed ? 'welcome' : prev);
      }).catch(() => { /* offline — local stands */ });
      return () => { cancelled = true; };
    }

    // First run on this device: there is nothing to show but the loader.
    setLoading(true);
    (async () => {
      const p = await loadProgress(storageKey, userId);
      if (cancelled) return;
      apply(p);
    })();
    return () => { cancelled = true; };
  }, [userId, subjectId, learnerBase, keyFor]);

  // Auto-save on progress change
  useEffect(() => {
    if (!loading && subjectId) {
      saveProgress(keyFor(subjectId), progress, userId, learnerId);
    }
  }, [progress, userId, loading, subjectId, keyFor, learnerId]);

  // Save an in-progress lesson cursor as the learner advances, so leaving
  // mid-skill and returning resumes at the same point (see the resume branch
  // in the load effect). Only once they've actually answered something.
  useEffect(() => {
    if (loading || !subjectId) return;
    if (view === 'lesson' && activeSkill && session.total > 0) {
      setProgress(p => ({ ...p, lessonInProgress: { skillId: activeSkill, session, kpIndex, modalityLevel, scaffoldLevel } }));
    }
  }, [view, activeSkill, session, kpIndex, modalityLevel, scaffoldLevel, loading, subjectId]);

  // Keep a ref of the latest state so the unmount/back handlers flush the most
  // recent progress instead of a stale snapshot captured at first render.
  const latestRef = useRef({ progress, loading, subjectId, userId, learnerBase, learnerId });
  useEffect(() => {
    latestRef.current = { progress, loading, subjectId, userId, learnerBase, learnerId };
  });

  // Flush the latest progress to the cloud immediately (used on exit).
  const flushSave = useCallback(() => {
    const { progress, loading, subjectId, userId, learnerBase, learnerId } = latestRef.current;
    if (loading || !subjectId) return;
    const storageKey = subjectId === 'math' ? learnerBase : `${learnerBase}_${subjectId}`;
    forceSave(storageKey, progress, userId, learnerId);
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
      if (profile) setBrainProfile(profile);
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

  // Adaptive, grade-anchored diagnostic. Instead of marching a fixed list, we
  // start the focus at the student's declared grade and move it — UP when they
  // clear a grade, DOWN when they fail one — until the frontier between what they
  // know and don't is bracketed. Credit propagation means each answer also tells
  // us about that skill's prerequisites/post-requisites, so we don't re-measure
  // what the graph already implies and spend questions where we're still unsure
  // (within a grade, we ask the least-certain skill first). The test ends as soon
  // as the level is pinned down — short for a clear-cut student, longer when the
  // picture is mixed — the "infer from structure, measure only the gaps" idea.
  const DIAG_MIN = 8;    // ask at least this many before bracketing can stop us
  const DIAG_MAX = 20;   // hard ceiling

  const diagList = () => Object.values(ctx?.skills || {}).filter(s => Number.isFinite(s.grade));
  const gradeSpan = (list) => { const g = list.map(s => s.grade); return [Math.min(...g), Math.max(...g)]; };
  const clearedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t >= 0.5;
  const failedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t < 0.5;
  // Nearest grade to `focus` that still has an unanswered skill; within a grade,
  // prefer load-bearing (critical) skills, then the least-certain one.
  const pickAt = (list, focus, answeredSet, balances) => {
    const [gmin, gmax] = gradeSpan(list);
    for (let d = 0; d <= gmax - gmin; d++) {
      for (const g of (d === 0 ? [focus] : [focus - d, focus + d])) {
        const cands = list.filter(s => s.grade === g && !answeredSet.has(s.id));
        if (cands.length) {
          cands.sort((a, b) => (b.critical ? 1 : 0) - (a.critical ? 1 : 0)
            || Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0));
          return cands[0];
        }
      }
    }
    return null;
  };

  // Snapshot the live diagnostic so a browser close/reload resumes the exact
  // question — answers so far, running evidence, focus grade, and the current
  // problem. Stored in `progress` (localStorage instantly + cloud on save). The
  // candidate pool is the full skill list, rebuilt on resume rather than stored.
  const diagCursor = (answered, balances, results, current, prob, focus, perGrade) =>
    ({ subjectId, v: 3, answered, balances, results, currentId: current?.id, problem: prob, focus, perGrade });

  const startDiagnostic = () => {
    const list = diagList();
    const focus = progress.declaredGrade; // required before starting
    const first = pickAt(list, focus, new Set(), {}) || list[0];
    const firstProblem = generateProblem(first?.id);
    setDiagState({ answered: [], balances: {}, results: {}, startTimes: { [first?.id]: Date.now() }, current: first, focus, perGrade: {} });
    setDiagHistory([]);
    setProblem(firstProblem);
    setProgress(p => ({ ...p, diagInProgress: diagCursor([], {}, {}, first, firstProblem, focus, {}) }));
    setAnswer('');
    setVisualAnswer(null);
    setFeedback(null);
    setView('diagnostic');
  };

  // Step back to the previous diagnostic question, rolling the evidence back to
  // exactly what it was before that question was answered.
  const diagBack = () => {
    if (!diagHistory.length) return;
    const prev = diagHistory[diagHistory.length - 1];
    setDiagHistory(diagHistory.slice(0, -1));
    setDiagState(prev.state);
    setProblem(prev.problem);
    setAnswer('');
    setVisualAnswer(null);
    setFeedback(null);
    const s = prev.state;
    setProgress(p => ({ ...p, diagInProgress: diagCursor(s.answered, s.balances, s.results, s.current, prev.problem, s.focus, s.perGrade) }));
  };

  const handleDiagnosticAnswer = (opts = {}) => {
    // "I haven't learned this yet" — an honest signal, not a wrong answer. It
    // counts as not-known for placement (that's exactly what we need to learn)
    // without forcing the child to guess or type junk.
    const skip = opts.skip === true;
    // Allow either a typed answer or an interactive-visual answer (number line etc.)
    const hasVisualAnswer = problem?.visual && visualAnswer != null;
    if (!skip && !answer.trim() && !hasVisualAnswer) return;
    const { answered, balances, results, startTimes, current, focus, perGrade } = diagState;
    const skill = current;
    if (!skill) return;
    // Remember this question so "Previous" can return to it and undo its evidence.
    setDiagHistory(h => [...h, { state: diagState, problem }]);
    const timeTaken = Date.now() - (startTimes[skill.id] || Date.now());
    const timeWeight = getTimeWeight(timeTaken);

    const correct = skip ? false : hasVisualAnswer
      ? checkVisualAnswer(visualAnswer, problem.visual)
      : checkAnswerMatch(answer, problem);

    // How sure the running evidence already was about this skill, BEFORE the
    // answer — the calibration signal to mine across learners later (idea #2).
    const priorConfidence = Math.abs(balances[skill.id] || 0);

    const newBalances = propagateCredit(balances, skill.id, correct, timeWeight, ctx);
    const newResults = { ...results, [skill.id]: { correct, timeTaken } };
    const newAnswered = [...answered, skill.id];
    const answeredSet = new Set(newAnswered);
    const newPerGrade = { ...perGrade, [skill.grade]: {
      c: (perGrade[skill.grade]?.c || 0) + (correct ? 1 : 0),
      t: (perGrade[skill.grade]?.t || 0) + 1,
    } };

    logResponse({
      studentId: userId, subject: subjectId, skillId: skill.id,
      correct, problemType: problem?.type, timeMs: timeTaken, isDiagnostic: true,
      confidence: priorConfidence, skipped: skip || undefined,
    });

    setFeedback(correct ? 'correct' : 'incorrect');

    // Move the focus toward the frontier, then decide whether it's bracketed.
    const list = diagList();
    const [gmin, gmax] = gradeSpan(list);
    let nextFocus = focus;
    if (clearedG(newPerGrade, focus)) nextFocus = Math.min(gmax, focus + 1);
    else if (failedG(newPerGrade, focus)) nextFocus = Math.max(gmin, focus - 1);

    let bracketed = false;
    if (newAnswered.length >= DIAG_MIN) {
      for (let g = gmin; g < gmax; g++) if (clearedG(newPerGrade, g) && failedG(newPerGrade, g + 1)) bracketed = true;
    }
    const nextSkill = pickAt(list, nextFocus, answeredSet, newBalances);
    const isLast = newAnswered.length >= DIAG_MAX || !nextSkill || bracketed;

    // On the final question, compute and PERSIST the finished state immediately —
    // before the 800ms feedback pause — so navigating away can never lose it.
    if (isLast) {
      const answeredObjs = newAnswered.map(id => ctx.skills[id]).filter(Boolean);
      const skillUpdates = processDiagnosticResults(newBalances, ctx);
      const placementGrade = computePlacementGrade(answeredObjs, newResults, progress.declaredGrade);
      const finished = {
        ...progress,
        skills: { ...progress.skills, ...skillUpdates },
        diagnosed: true,
        diagnosticBalances: newBalances,
        placementGrade,
        diagInProgress: null, // completed — clear the resume cursor
      };
      setProgress(finished);
      forceSave(keyFor(subjectId), finished, userId, learnerId);
    }

    setTimeout(() => {
      if (!isLast) {
        const nextProblem = generateProblem(nextSkill.id);
        setDiagState({ answered: newAnswered, balances: newBalances, results: newResults, startTimes: { ...startTimes, [nextSkill.id]: Date.now() }, current: nextSkill, focus: nextFocus, perGrade: newPerGrade });
        setProblem(nextProblem);
        // Advance the resume cursor so a mid-test exit returns to THIS question.
        setProgress(p => ({ ...p, diagInProgress: diagCursor(newAnswered, newBalances, newResults, nextSkill, nextProblem, nextFocus, newPerGrade) }));
        setAnswer('');
        setVisualAnswer(null);
        setFeedback(null);
      } else {
        setView('home');
      }
    }, 800);
  };

  // ==================== LESSON (KP-BASED) ====================

  // Serve a lesson problem and note whether it can carry a completion scaffold
  // (grades 1–4 have their own scaffolding, so they are never "scaffoldable"
  // here and the mastery guard leaves them alone).
  const serveLessonProblem = (skillId, level) => {
    const p = generateProblem(skillId, { level, kp: kpIndexRef.current });
    const young = (SKILLS[skillId]?.grade || 99) <= 4;
    scaffoldableRef.current = !young && !!completionPlan(p, SUPPORT.FULL);
    return p;
  };

  const startLesson = (skillId) => {
    // Freemium gate (inert until the paywall is switched on): a free learner
    // who has used today's practice allowance is offered the pass instead of a
    // new lesson. The diagnostic is never gated. canPractice() returns true
    // while the paywall is off, so this changes nothing until launch.
    if (onPaywall && !canPractice(subscription, progress)) { onPaywall(); return; }
    setActiveSkill(skillId);
    setSession({ correct: 0, total: 0, streak: 0, startTime: Date.now() });
    setInterleave(null);
    interleaveCountRef.current = 0;
    setKpIndex(0); kpIndexRef.current = 0;
    setLessonFailCount(0);
    setModalityLevel('abstract');
    // Faded worked examples: support starts where this learner's history says
    // it should (expertise reversal — a practised learner skips support).
    const startLevel = initialSupportLevel(progress.skills[skillId]);
    scaffoldRef.current = startLevel;
    setScaffoldLevel(startLevel);
    setAnsweredLevel(null);
    setSelfExplainOpen(false);
    // Grades 1–4 never see the text worked example — the young flow teaches by
    // demonstration (count-together / column reveal) instead. Past ORIENT the
    // intro example is skipped too: a learner who no longer needs support goes
    // straight to solving.
    const young = (SKILLS[skillId]?.grade || 99) <= 4;
    const we = (young || startLevel >= SUPPORT.ORIENT) ? null : generateWorkedExample(skillId);
    setShowWorkedExample(!!we);
    setProblem(we ? null : serveLessonProblem(skillId, 'abstract'));
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
    setProblem(serveLessonProblem(activeSkill, modalityLevel));
    setAnswer('');
    setFeedback(null);
    setAttemptCount(0);
    setHintLevel(0);
    setActiveTooltip(null);
    setVisualAnswer(null);
    setAnsweredLevel(null);
    setSelfExplainOpen(false);
    setWrongInfo(null);
  };

  // An interleaved review is retrieval practice: ONE attempt, immediate
  // feedback, credit to the reviewed skill's spaced-repetition schedule.
  // The lesson skill's mastery count and session totals are untouched.
  const handleInterleaveAnswer = () => {
    const hasVisualAnswer = problem?.visual && visualAnswer != null;
    if ((!answer.trim() && !hasVisualAnswer) || feedback) return;
    const skillId = interleave.skillId;
    const correct = hasVisualAnswer
      ? checkVisualAnswer(visualAnswer, problem.visual)
      : checkAnswerMatch(answer, problem);
    const timeMs = Date.now() - problemStartRef.current;
    logResponse({
      studentId: userId, subject: subjectId, skillId,
      correct, problemType: problem?.type, timeMs, isReview: true,
    });
    if (!correct) {
      setWrongInfo({ answer: answer.trim(), diagnosis: diagnoseError(problem, answer) });
      setHintLevel(3); // full reveal — the teaching moment still happens
    }
    setFeedback(correct ? 'correct' : 'incorrect');
    const sp = progress.skills[skillId] || { attempts: 0, correct: 0, mastered: false, repNum: 0, learningSpeed: 1.0 };
    const updatedSp = processReviewResult(sp, correct, timeMs, fluencyExpectedMs(SKILLS[skillId]));
    updatedSp.attempts = sp.attempts + 1;
    updatedSp.correct = sp.correct + (correct ? 1 : 0);
    let updatedSkills = applyImplicitCredits(progress, skillId, correct, ctx);
    updatedSkills = { ...updatedSkills, [skillId]: updatedSp };
    // Small XP either way: showing up for a memory check pays (effort-aware).
    setProgress(p => updateStreak(gainXP({ ...p, skills: updatedSkills }, correct ? 3 : 1)));
  };

  const checkAnswer = () => {
    if (interleave) return handleInterleaveAnswer();
    // Visual problems are answered by interaction (or by typing the coordinate).
    const hasVisualAnswer = problem?.visual && visualAnswer != null;
    if ((!answer.trim() && !hasVisualAnswer) || feedback) return;
    // A numeric problem with a no-digit entry ("abc") isn't a wrong attempt —
    // it's "please type a number", so we don't burn one of their three tries.
    const expectsNumber = /^-?\d/.test(String(problem?.answer ?? ''));
    if (!hasVisualAnswer && expectsNumber && !/\d/.test(answer)) {
      setWrongInfo({ needNumber: true });
      return;
    }
    const correct = hasVisualAnswer
      ? checkVisualAnswer(visualAnswer, problem.visual)
      : checkAnswerMatch(answer, problem);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    // Feedback on THIS answer: name the likely slip (e.g. 42×4→160 = "you found
    // 40×4 but forgot the ones"), keeping their answer visible.
    if (!correct) setWrongInfo({ answer: answer.trim(), diagnosis: diagnoseError(problem, answer) });
    else setWrongInfo(null);

    // === LAYERED WRONG-ANSWER HANDLING ===
    // Attempt 1 wrong: "Not quite" + the diagnosis, let them retry
    // Attempt 2 wrong: also offer the first steps
    // Attempt 3 wrong: full answer + full working (for THIS problem), mark incorrect
    if (!correct && newAttemptCount < 3) {
      setHintLevel(newAttemptCount); // 1 = hint, 2 = partial steps
      setAnswer('');
      return; // Don't record in progress yet — only the final result counts
    }

    // === FINAL RESULT (correct at any attempt, or 3rd-attempt fail) ===
    setFeedback(correct ? 'correct' : 'incorrect');
    if (!correct) setHintLevel(3); // Full reveal
    // Freeze the support level this problem was answered at — the post-answer
    // self-explanation card and telemetry read it after finalize fades it.
    setAnsweredLevel(scaffoldRef.current);

    finalizeResult(correct, {
      attemptNo: newAttemptCount,
      hintsUsed: correct ? hintLevel : 3,
      timeMs: Date.now() - problemStartRef.current,
    });
  };

  // The shared post-answer pipeline: telemetry, session, mastery/FIRe credit,
  // CPA drop-down on struggle, XP. Used by the typed flow and the young flow.
  const finalizeResult = (correct, { attemptNo, hintsUsed, timeMs, taps = null }) => {
    // The support level this answer was produced under, before fading moves it.
    const answeredAt = scaffoldRef.current;
    // Climb the knowledge-point ladder one rung per correct answer (capped at the
    // top). A skill like G2 addition thus walks no-regroup → regroup → 2-digit →
    // 2-digit-regroup in order, instead of always sitting on step one. Wrong
    // answers keep the student on the current KP to re-practise it.
    let kpAdvanced = false;
    if (correct) {
      const top = getKpCount(activeSkill) - 1;
      if (kpIndexRef.current < top) {
        kpIndexRef.current += 1;
        setKpIndex(kpIndexRef.current);
        kpAdvanced = true;
      }
    }
    // Fade the worked-example support: one rung lighter per correct, one rung
    // heavier per wrong; entering a NEW knowledge point caps at ORIENT so a
    // fresh variant is never met fully solo.
    const faded = nextSupportLevel(answeredAt, correct, kpAdvanced);
    scaffoldRef.current = faded;
    setScaffoldLevel(faded);
    // Telemetry: capture the response for the HOREB learning loop.
    logResponse({
      studentId: userId, subject: subjectId, skillId: activeSkill,
      correct, problemType: problem?.type,
      timeMs,
      hintsUsed, attemptNo, taps,
      scaffold: scaffoldableRef.current ? answeredAt : null,
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
    // A placeholder problem (no authored generator) must never grant mastery or
    // propagate credit — otherwise typing "1" would falsify the learning signal.
    const isPlaceholder = !!problem?.placeholder;
    const sp = progress.skills[activeSkill] || { attempts: 0, correct: 0, mastered: false, repNum: 0, learningSpeed: 1.0, consecutiveFailures: 0 };
    const newCorrect = sp.correct + (correct ? 1 : 0);
    const newAttempts = sp.attempts + 1;
    const accuracy = newCorrect / newAttempts;
    // Mastery needs enough practice, a high accuracy, AND this final answer to be
    // correct — so a skill can never tip into "mastered" on a wrong answer just
    // because cumulative accuracy is still above threshold. When completion
    // scaffolding was available, the mastering answer must also have been given
    // at light support (ORIENT or SOLO) — assisted answers are practice, not
    // proof (assistance dilution).
    const lightSupport = !scaffoldableRef.current || answeredAt >= SUPPORT.ORIENT;
    // Test-out: a skill 2+ grades below the learner's own grade masters on a single
    // clean first-attempt correct — a capable child proves a foundation once and
    // moves on, instead of grinding six trivial reps. A wrong first try drops them
    // straight back into normal practice (they clearly need it after all).
    const tgLearnerGrade = progress.declaredGrade ?? getEstimatedGradeLevel(progress, ctx) ?? 99;
    const testOutNow = Number.isFinite(skill?.grade) && (tgLearnerGrade - skill.grade) >= 2 && newAttempts === 1;
    const shouldMaster = !isPlaceholder && correct && accuracy >= skill.masteryThreshold
      && (testOutNow || (lightSupport && newAttempts >= skill.minProblems));

    // Apply implicit repetitions to prerequisites (skip for placeholder stand-ins)
    let updatedSkills = isPlaceholder ? { ...progress.skills } : applyImplicitCredits(progress, activeSkill, correct, ctx);

    const updatedSp = processReviewResult(sp, correct, timeMs, fluencyExpectedMs(SKILLS[activeSkill]));
    updatedSp.attempts = newAttempts;
    updatedSp.correct = newCorrect;
    if (shouldMaster && !sp.mastered) {
      updatedSp.mastered = true;
      // Keep the spaced-repetition schedule the FIRe model just computed; only
      // raise it to the mastery floor if it's lower. (Previously this overwrote
      // repNum with a fixed 2, throwing away the review interval at mastery.)
      updatedSp.repNum = Math.max(updatedSp.repNum || 0, 2);
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
    } else if (!isPlaceholder) {
      // Effort-aware (Math Academy): a final miss still ends in reading the
      // full working — a completed teaching moment. Honest struggle never
      // pays zero, so a hard session still moves the daily goal.
      xpEarned = 1;
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

  // Young learners (G1–2): one final result per problem from the young UI,
  // then keep the flow moving — the child already had their celebration.
  const handleYoungResult = ({ correct, hintsUsed, timeMs, taps }) => {
    finalizeResult(correct, { attemptNo: hintsUsed + 1, hintsUsed, timeMs, taps });
    nextProblem();
  };

  const nextProblem = () => {
    // Interleave a due review from ANOTHER skill after the 3rd and 7th answers
    // (mixed practice ≈ doubles delayed retention vs blocked — Rohrer). Standard
    // flow only: young learners keep their uninterrupted count-together rhythm.
    const lg = progress.declaredGrade ?? getEstimatedGradeLevel(progress, ctx) ?? 99;
    const due = (lg > 3 && shouldInterleave(session.total, interleaveCountRef.current))
      ? pickInterleavedReview(getReviews(progress, ctx), activeSkill) : null;
    if (due) {
      interleaveCountRef.current += 1;
      setInterleave({ skillId: due.id, name: due.name || SKILLS[due.id]?.name || 'earlier skill' });
      setProblem(generateProblem(due.id));
    } else {
      setInterleave(null);
      setProblem(serveLessonProblem(activeSkill, modalityLevel));
    }
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setAttemptCount(0);
    setHintLevel(0);
    setActiveTooltip(null);
    setVisualAnswer(null);
    setAnsweredLevel(null);
    setSelfExplainOpen(false);
    setWrongInfo(null);
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
    setVisualAnswer(null);
    setView('review');
  };

  const handleReviewAnswer = () => {
    // Visual problems are answered by interaction, same as in lessons.
    const hasVisualAnswer = problem?.visual && visualAnswer != null;
    if ((!answer.trim() && !hasVisualAnswer) || feedback) return;
    const skillId = reviewProblems[reviewIndex];
    const correct = hasVisualAnswer
      ? checkVisualAnswer(visualAnswer, problem.visual)
      : checkAnswerMatch(answer, problem);
    const timeMs = Date.now() - problemStartRef.current;

    logResponse({
      studentId: userId, subject: subjectId, skillId,
      correct, problemType: problem?.type,
      timeMs, isReview: true,
    });

    setFeedback(correct ? 'correct' : 'incorrect');
    setSession(s => ({ ...s, correct: s.correct + (correct ? 1 : 0), total: s.total + 1, streak: correct ? s.streak + 1 : 0 }));

    // Update skill progress with spaced repetition
    const sp = progress.skills[skillId] || { attempts: 0, correct: 0, mastered: false, repNum: 0, learningSpeed: 1.0 };
    const updatedSp = processReviewResult(sp, correct, timeMs, fluencyExpectedMs(SKILLS[skillId]));
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
        setVisualAnswer(null);
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

  const goHome = () => { setView('home'); setActiveSkill(null); setCelebrations([]); setRemediationSkills(null); setProgress(p => p.lessonInProgress ? { ...p, lessonInProgress: null } : p); };

  // Dismiss the front celebration; mastery returns the learner to the dashboard.
  const dismissCelebration = () => {
    const item = celebrations[0];
    setCelebrations(q => q.slice(1));
    if (item?.type === 'mastery') goHome();
  };
  const switchSubject = () => { setSubjectId(null); setView('subject-picker'); setActiveSkill(null); setProgress(defaultProgress); };
  const resetAll = () => { if (confirm('Reset ALL progress? This cannot be undone.')) { const fresh = defaultProgress(); setProgress(fresh); forceSave(keyFor(subjectId), fresh, userId, learnerId); setView('welcome'); } };

  // Grade/band label helper. ACCA subjects use named levels; otherwise the
  // active curriculum decides the wording ("Grade" vs Cambridge "Stage").
  const gradeLabel = (grade) => {
    if (sub?.gradeNames?.[grade]) return `${sub.gradeLabel} ${grade} — ${sub.gradeNames[grade]}`;
    return bandLabel(curriculum, grade);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#eef0f2] flex flex-col items-center justify-center gap-4">
      <HorebBot size={56} />
      <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-amber-400 rounded-full animate-pulse" />
      </div>
    </div>
  );

  // ==================== RENDER: SUBJECT PICKER ====================

  if (view === 'subject-picker' || !subjectId) return (
    <div className="min-h-screen bg-[#eef0f2] text-slate-900 app-shell">
      <div className="bg-white/85 backdrop-blur border-b border-slate-200/70 sticky top-0 z-40 shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2.5">
          {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-700 mr-1"><Icon name="back" /></button>}
          <HorebBot size={28} />
          <h1 className="text-base font-extrabold tracking-tight">HOREB</h1>
        </div>
      </div>
      <div className="app-scroll">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16">
          <h2 className="text-[26px] font-extrabold tracking-tight text-center mb-1">What shall we work on?</h2>
          <p className="text-slate-500 text-center text-sm mb-6">Each subject adapts to you and brings skills back before you forget them.</p>
          <div className="space-y-3">
            {SUBJECT_LIST.map(s => (
              <button key={s.id} onClick={() => setSubjectId(s.id)} className="w-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 rounded-2xl p-5 flex items-center gap-4 transition-colors text-left">
                <div className="text-4xl">{s.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[17px] text-slate-900">{s.name}</div>
                  <div className="text-slate-500 text-sm">{s.description}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.skillCount} skills</div>
                </div>
                <Icon name="arrow" className="w-5 h-5 text-slate-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const level = getLevel(progress.totalXP || 0);

  // ==================== RENDER: WELCOME ====================

  if (view === 'welcome') {
    const welcomeFirst = ((activeLearner?.name || studentName) || '').trim().split(/\s+/)[0];
    return (
    <div className="min-h-screen bg-[#eef0f2] text-slate-900">
      <div className="bg-white/85 backdrop-blur border-b border-slate-200/70 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2.5">
          {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mr-1"><Icon name="back" /></button>}
          <HorebBot size={28} />
          <h1 className="text-base font-extrabold tracking-tight">HOREB</h1>
        </div>
      </div>
      <div className="flex justify-center px-4 py-10">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-5"><HorebBot size={76} /></div>
          <h1 className="text-[27px] font-extrabold tracking-tight text-center leading-tight mb-2">
            {welcomeFirst ? `Hi ${welcomeFirst} — let’s` : 'Let’s'} find your starting point
          </h1>
          <p className="text-slate-500 text-center text-[15px] mb-6">
            This is <strong className="text-slate-700">not a test</strong> — no marks, nothing to revise.
            Just a few questions so I know exactly where to begin with you.
          </p>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-4 text-sm text-slate-600 space-y-2.5">
            <p>Around 15–20 quick questions — we stop the moment I know your start.</p>
            <p>Meet something you haven’t learned? Tap <strong className="text-slate-800">“I haven’t learned this yet”</strong> — that’s a helpful answer, not a wrong one.</p>
            <p>Whatever we find, it’s only a starting line. Everything after it is growth.</p>
          </div>

          {/* Onboarding — class + curriculum anchor the check to the student */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-5">
            <p className="text-sm font-semibold text-slate-800 mb-2">What {(sub?.gradeLabel || 'grade').toLowerCase()} are you in?</p>
            <div className="flex flex-wrap gap-2">
              {(sub?.grades || []).map(g => (
                <button key={g} onClick={() => setProgress(p => ({ ...p, declaredGrade: g }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${progress.declaredGrade === g ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {sub?.gradeLabel || 'Grade'} {g}
                </button>
              ))}
            </div>
            {curriculaOptions.length > 1 && (
              <>
                <p className="text-sm font-semibold text-slate-800 mt-4 mb-2">Your curriculum</p>
                <div className="flex flex-wrap gap-2">
                  {curriculaOptions.map(co => (
                    <button key={co.id} onClick={() => setProgress(p => ({ ...p, curriculum: co.id }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${curriculum === co.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {co.shortName}
                    </button>
                  ))}
                </div>
              </>
            )}
            {progress.declaredGrade != null && (
              <p className="text-xs text-[#5a7a3a] mt-3">I’ll focus on {sub?.gradeLabel || 'Grade'} {progress.declaredGrade} and the steps that lead up to it.</p>
            )}
          </div>

          <button onClick={startDiagnostic} disabled={progress.declaredGrade == null} className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-900 rounded-2xl py-4 font-bold text-lg transition-colors">
            {progress.declaredGrade != null ? "Let's start" : `Pick your ${(sub?.gradeLabel || 'class').toLowerCase()} first`}
          </button>
        </div>
      </div>
    </div>
    );
  }

  // ==================== RENDER: DIAGNOSTIC ====================

  if (view === 'diagnostic') {
    const { answered, current } = diagState;
    const skill = current;
    if (!skill) return null;
    const n = answered.length + 1;
    // Adaptive test: the length isn't fixed, so show progress toward the ceiling.
    const pct = Math.min(96, Math.round((answered.length / DIAG_MAX) * 100));
    // The guide keeps the mood light — this must never feel like an exam. No
    // grade labels on questions (an older child rebuilding foundations should
    // never see "Grade 1" stamped on their screen), no red X, no scores.
    const cheer = [
      'Take your time — there’s no clock.',
      'If it’s new to you, just say so. That helps me!',
      'You’re doing great.',
      'Remember: not a test. We’re just finding your start.',
    ][(n - 1) % 4];

    return (
      <div className="min-h-screen bg-[#eef0f2] text-slate-900">
        <div className="bg-white/85 backdrop-blur border-b border-slate-200/70 sticky top-0 z-40 shrink-0">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HorebBot size={28} />
              <div>
                <div className="text-sm font-bold text-slate-900">Finding your start</div>
                <div className="text-xs text-slate-400">Question {n} · no marks, just mapping</div>
              </div>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100"><div className="h-full bg-amber-400 transition-all duration-300 rounded-r-full" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="px-4 pt-6 pb-16">
          <div className="max-w-2xl mx-auto">
            {diagHistory.length > 0 && !feedback && (
              <button onClick={diagBack} className="text-xs text-slate-400 hover:text-slate-600 mb-3 flex items-center gap-1 transition-colors">← Previous question</button>
            )}
            <div className="flex items-start gap-3 mb-4">
              <HorebBot size={40} className="shrink-0" />
              <div className="bg-white rounded-2xl rounded-tl-md border border-slate-200 px-4 py-2.5 text-[15px] text-slate-700 shadow-sm">{cheer}</div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-4">
              <div className="text-[22px] font-bold text-slate-900 mb-6 leading-snug">{problem?.question}</div>
              {/* Interactive visual (number line / grid / etc.) when the problem
                  needs one — otherwise it would be an unanswerable text box. */}
              {problem?.visual && (
                <InteractiveVisual
                  visualType={problem.visual.type}
                  visualData={problem.visual.data}
                  onAnswer={setVisualAnswer}
                  disabled={!!feedback}
                />
              )}
              <input type="text" inputMode={/^-?\d+$/.test(String(problem?.answer ?? '')) ? 'numeric' : /^-?\d*\.\d+$/.test(String(problem?.answer ?? '')) ? 'decimal' : undefined} value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && handleDiagnosticAnswer()} disabled={!!feedback} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3.5 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:opacity-60 placeholder:text-slate-400" autoFocus placeholder={problem?.visual ? 'Tap the picture above — or type your answer' : 'Type your answer…'} />
              {!feedback && (
                <button onClick={() => handleDiagnosticAnswer({ skip: true })} className="mt-3 text-sm text-slate-400 hover:text-[#6d6fcb] transition-colors">
                  I haven’t learned this yet
                </button>
              )}
            </div>
            {feedback && (
              feedback === 'correct'
                ? <div className="rounded-2xl p-4 mb-4 bg-[#eef4e7] border border-[#cfe0bd]"><span className="text-[#4f7233] font-bold">✓ Nice one!</span></div>
                : <div className="rounded-2xl p-4 mb-4 bg-[#f5f6fc] border border-[#d3daf0]"><span className="text-[#5658b8] font-semibold">Noted — that helps me find your start.</span></div>
            )}
            {!feedback && <button onClick={() => handleDiagnosticAnswer()} disabled={!answer.trim() && !(problem?.visual && visualAnswer != null)} className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 rounded-2xl py-4 font-bold transition-colors">Check</button>}
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: LESSON ====================

  if (view === 'lesson' && activeSkill) {
    const skill = SKILLS[activeSkill];
    const sp = progress.skills[activeSkill] || { attempts: 0, correct: 0, mastered: false };
    const learnerGrade = progress.declaredGrade ?? getEstimatedGradeLevel(progress, ctx) ?? 99;
    // Test-out: a skill well below the learner's own grade only needs ONE clean
    // correct answer to master — a capable child shouldn't grind six trivial reps
    // just because the diagnostic never confirmed a foundation it couldn't reach.
    const testOutSkill = Number.isFinite(skill?.grade) && (learnerGrade - skill.grade) >= 2;
    const masterTarget = testOutSkill ? 1 : skill.minProblems;
    const pct = Math.min(100, (session.correct / masterTarget) * 100);

    // Faded worked examples: this problem's completion scaffold at the current
    // support level (structured content), or a parallel solved example (legacy
    // content) — and, after a correct answer, the partition the problem was
    // ANSWERED with, for the self-explanation card.
    // An interleaved review is bare retrieval — no completion scaffold, no
    // similar-example crutch. The point is recalling it from memory.
    const plan = problem && !feedback && !interleave ? completionPlan(problem, scaffoldLevel) : null;
    const legacyExample = problem && !feedback && !interleave ? exampleSupport(problem, scaffoldLevel) : null;
    const supportChip = SUPPORT_LABEL[scaffoldLevel];
    const answeredPlan = (feedback === 'correct' && answeredLevel != null && answeredLevel <= SUPPORT.MOST)
      ? completionPlan(problem, answeredLevel) : null;

    // Grades 1–2 get the young-learner experience: read-aloud, tappable
    // counters, count-together scaffolding. Falls back to the standard UI for
    // problem shapes the young plan can't express.
    // Age-appropriate presentation is gated on WHO is sitting there (their declared
    // grade), not only the skill's grade. An older student rebuilding a Grade-1
    // foundation gets the normal UI — not a toddler duck; genuine lower-primary
    // learners (declared grade ≤ 3) keep the read-aloud / tap-to-answer experience.
    if ((skill.grade || 99) <= 4 && problem && learnerGrade <= 3) {
      const cbc = skill.curricula?.cbc;
      const shared = {
        problem,
        skillName: skill.name,
        cbcLabel: cbc ? `CBC · Grade ${cbc.grade} · ${cbc.strand} — ${cbc.substrand}` : `Grade ${skill.grade} · ${skill.strand}`,
        progressLabel: `${Math.min(session.correct, masterTarget)} of ${masterTarget}`,
        studentName: ((activeLearner?.name || studentName) || '').trim().split(/\s+/)[0],
        onResult: handleYoungResult,
        onExit: goHome,
      };
      if (skill.grade <= 2) {
        const plan = planYoungLesson(problem);
        if (plan) return <YoungLearnerLesson {...shared} plan={plan} />;
      } else {
        const plan = planBridgeLesson(problem);
        if (plan) return <BridgeLesson {...shared} plan={plan} />;
      }
    }

    const learnerFirst = ((activeLearner?.name || studentName) || '').trim().split(/\s+/)[0];
    return (
      <div className="min-h-screen bg-[#eef0f2] text-slate-900 app-shell" onClick={() => activeTooltip && setActiveTooltip(null)}>
        {/* Header */}
        <div className="bg-white/85 backdrop-blur border-b border-slate-200/70 sticky top-0 z-40 shrink-0">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <button onClick={goHome} className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-sm"><Icon name="back" className="w-4 h-4" /> Exit</button>
            <div className="text-center flex-1 min-w-0">
              <div className="font-semibold text-slate-900 text-sm truncate">{skill.name}</div>
              <div className="text-xs text-slate-400">Grade {skill.grade} · {skill.strand}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-sm text-slate-900 tabular-nums">{Math.min(session.correct, masterTarget)}/{masterTarget}</div>
              <div className="text-xs text-slate-400">{testOutSkill ? 'quick check' : 'to master'}</div>
            </div>
          </div>
          <div className="h-1 bg-slate-100"><div className="h-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} /></div>
        </div>

        <div className="px-4 sm:px-6 pt-6 pb-20 app-scroll">
        <div className="max-w-2xl mx-auto">

          {session.streak >= 3 && <div className="mb-4 text-center text-amber-600 text-sm font-semibold">{session.streak} in a row — keep it going!</div>}

          {/* Worked Example — the tutor walks the child through the full working */}
          {showWorkedExample && (
            <div>
              <div className="flex items-start gap-3 mb-4">
                <HorebBot size={40} className="shrink-0" />
                <div className="bg-white rounded-2xl rounded-tl-md border border-slate-200 px-4 py-2.5 text-[15px] text-slate-700 shadow-sm">
                  Let's do one together first{learnerFirst ? `, ${learnerFirst}` : ''} — watch how it works.
                </div>
              </div>

              {(() => {
                const we = generateWorkedExample(activeSkill);
                if (!we) return null;
                return (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <ConceptIntro definitions={we.definitions} />

                    <div className="text-[22px] font-bold text-slate-900 mb-5 leading-snug">
                      <TermTooltip text={we.problem} definitions={we.definitions} />
                    </div>
                    {(() => { const am = parseAreaProblem(we.problem); return am ? <AreaModel a={am.a} b={am.b} /> : null; })()}
                    {!parseAreaProblem(we.problem) && <div className="space-y-3">
                      {we.steps.map((step, i) => (
                        <div key={i}>
                          <div className="flex gap-3 items-start">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">{i + 1}</span>
                            <span className="text-[15px] text-slate-700 flex-1 leading-relaxed">
                              <TermTooltip text={step} definitions={we.definitions} />
                            </span>
                            {we.whySteps && we.whySteps[i] && (
                              <button
                                onClick={() => setExpandedWhySteps(prev => ({ ...prev, [i]: !prev[i] }))}
                                className="text-xs text-amber-600 hover:text-amber-700 whitespace-nowrap font-medium"
                              >
                                {expandedWhySteps[i] ? 'Hide' : 'Why?'}
                              </button>
                            )}
                          </div>
                          {expandedWhySteps[i] && we.whySteps && we.whySteps[i] && (
                            <div className="ml-9 mt-1.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-800 leading-relaxed">
                              {we.whySteps[i]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>}
                    <div className="mt-5 flex items-center gap-2 bg-[#eef4e7] border border-[#cfe0bd] rounded-2xl px-4 py-3">
                      <span className="text-[#5a7a3a] font-semibold text-sm">Answer</span>
                      <span className="font-bold text-slate-900 ml-auto text-lg">{we.solution}</span>
                    </div>
                  </div>
                );
              })()}
              <button onClick={startPractice} className="w-full mt-4 bg-amber-400 text-slate-900 hover:bg-amber-300 rounded-2xl py-3.5 font-bold transition-colors">I'm ready — let me try</button>
            </div>
          )}

          {/* Practice Problem */}
          {!showWorkedExample && problem && (
            <>
              <div className="flex items-start gap-3 mb-4">
                <HorebBot size={40} className="shrink-0" />
                <div className="bg-white rounded-2xl rounded-tl-md border border-slate-200 px-4 py-2.5 text-[15px] text-slate-700 shadow-sm">
                  {interleave ? 'Quick memory check — do you still remember this one?' : modalityLevel === 'concrete' ? "Let's see it a different way — use the picture to help." : 'Now you try this one. Take your time.'}
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-4">
                {interleave && (
                  <div className="inline-flex items-center gap-1.5 mb-3 text-xs font-bold text-[#6d6fcb] bg-[#f5f6fc] border border-[#e8e9f6] rounded-full px-3 py-1.5">
                    <Icon name="refresh" className="w-3.5 h-3.5" /> Quick review · {interleave.name}
                  </div>
                )}
                <div className="text-[22px] font-bold text-slate-900 mb-6 leading-snug">
                  <TermTooltip text={problem.question} definitions={problem.workedExample?.definitions || problem.definitions} />
                </div>

                {/* Completion scaffold — this problem's own solution, started for
                    the learner and faded from the end (Renkl backward fading). */}
                {plan && (
                  <div className="mb-5 rounded-2xl border border-[#cfe0bd] bg-[#f2f6ec] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#5a7a3a] text-sm font-semibold">Solution started for you — finish the last step</span>
                      {supportChip && <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e2edd3] text-[#5a7a3a]">{supportChip}</span>}
                    </div>
                    <div className="space-y-1.5">
                      {plan.shown.map((s, i) => (
                        <div key={i} className="flex gap-2 text-sm text-slate-700">
                          <span className="text-[#5a7a3a] font-bold min-w-[20px] tabular-nums">{i + 1}.</span>
                          <span>{s}</span>
                        </div>
                      ))}
                      {Array.from({ length: plan.hiddenCount }).map((_, i) => (
                        <div key={`h${i}`} className="flex gap-2 text-sm items-center">
                          <span className="text-slate-400 font-bold min-w-[20px] tabular-nums">{plan.shown.length + i + 1}.</span>
                          <span className="flex-1 border-b border-dashed border-slate-300 text-slate-400 text-xs pb-0.5">
                            {i === 0 ? 'your turn — type the answer below' : '…'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!plan && legacyExample && (
                  <details className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm open:pb-4">
                    <summary className="cursor-pointer text-amber-700 font-semibold select-none">
                      See a similar solved example
                    </summary>
                    <div className="mt-3 text-slate-700 font-medium">{legacyExample.problem}</div>
                    <div className="mt-2 space-y-1">
                      {(legacyExample.steps || []).map((s, i) => (
                        <div key={i} className="flex gap-2 text-slate-700">
                          <span className="text-amber-600 font-bold min-w-[20px] tabular-nums">{i + 1}.</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[#5a7a3a]"><span className="font-semibold">Answer:</span> <span className="font-mono">{legacyExample.solution}</span></div>
                  </details>
                )}

                {/* Visual ANSWER widget (the problem is answered by interaction) */}
                {problem.visual ? (
                  <InteractiveVisual visualType={problem.visual.type} visualData={problem.visual.data} onAnswer={setVisualAnswer} disabled={!!feedback} />
                ) : (
                  activeSkill && SKILL_VISUALS[activeSkill] && (
                    <InteractiveVisual visualType={SKILL_VISUALS[activeSkill].visualType} visualData={SKILL_VISUALS[activeSkill].visualData} onAnswer={setVisualAnswer} disabled={!!feedback} />
                  )
                )}
                <input type="text" inputMode={/^-?\d+$/.test(String(problem.answer ?? '')) ? 'numeric' : /^-?\d*\.\d+$/.test(String(problem.answer ?? '')) ? 'decimal' : undefined} value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && checkAnswer()} disabled={!!feedback} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3.5 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:opacity-60 placeholder:text-slate-400" autoFocus placeholder={problem.visual ? 'Tap the picture above — or type your answer' : 'Type your answer…'} />

                {/* Roadside assistance, not GPS: only offered once the child has
                    actually sat with the problem — never as a reflex tap. */}
                {!feedback && hintLevel < 1 && attemptCount === 0 && hintUnlocked && (
                  <button onClick={() => setHintLevel(1)} className="mt-3 text-sm text-slate-400 hover:text-amber-600 transition-colors">I'm stuck — give me a nudge</button>
                )}

                {/* "type a number" nudge — doesn't cost an attempt */}
                {!feedback && wrongInfo?.needNumber && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
                    Type your answer as a number.
                  </div>
                )}

                {/* Proactive hint (asked before trying) — an op-appropriate nudge */}
                {hintLevel >= 1 && !feedback && attemptCount === 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
                    <span className="font-semibold text-amber-700">Hint:</span> {problem.hint || genericNudge(problem)}
                    {hintLevel < 2 && !plan && <button onClick={() => setHintLevel(2)} className="ml-2 text-amber-700 underline hover:text-amber-800">still stuck?</button>}
                  </div>
                )}

                {/* Wrong try — name what happened, keep their answer, escalate */}
                {!feedback && attemptCount > 0 && wrongInfo && !wrongInfo.needNumber && (
                  <div className="mt-4 p-3 bg-[#fdf2ef] border border-[#f2cdc2] rounded-2xl text-sm">
                    <span className="text-[#c0663f] font-semibold">Not quite.</span>
                    {wrongInfo.answer && <span className="text-slate-500"> You wrote <span className="font-mono text-slate-700">{wrongInfo.answer}</span>.</span>}
                    <div className="mt-1 text-slate-700">{wrongInfo.diagnosis || (problem.hint || genericNudge(problem))}</div>
                    {hintLevel < 2 && !plan && <button onClick={() => setHintLevel(2)} className="mt-1.5 text-[#6d6fcb] underline text-xs hover:text-[#5658b8]">show me the first steps</button>}
                  </div>
                )}

                {hintLevel >= 2 && !feedback && !plan && (() => {
                  const steps = problem.solutionSteps || computeSteps(problem) || generateWorkedExample(activeSkill)?.steps;
                  if (!steps) return null;
                  return (
                    <div className="mt-3 p-3 bg-[#eef1f8] border border-[#d3daf0] rounded-2xl text-sm">
                      <span className="font-semibold text-[#6d6fcb]">Here are the first steps to guide you:</span>
                      <div className="mt-2 space-y-1">
                        {steps.slice(0, 2).map((step, i) => (
                          <div key={i} className="flex gap-2 text-slate-700">
                            <span className="text-[#6d6fcb] font-bold tabular-nums">{i + 1}.</span>
                            <TermTooltip text={step} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Correct answer feedback */}
              {feedback === 'correct' && (
                <div className="rounded-2xl p-4 mb-4 bg-[#eef4e7] border border-[#cfe0bd]">
                  <span className="text-[#4f7233] font-bold">✓ Nice{learnerFirst ? `, ${learnerFirst}` : ''} — that's right!</span>
                  {attemptCount > 1 && <span className="text-slate-400 text-sm ml-2">(attempt {attemptCount})</span>}
                </div>
              )}

              {/* Self-explanation prompt (Chi) — after finishing a completion
                  problem, the learner articulates WHY the steps they supplied
                  work, then checks their thinking against the actual steps. */}
              {answeredPlan && (
                <div className="rounded-2xl p-4 mb-4 bg-[#eef1f8] border border-[#d3daf0]">
                  <div className="text-[#5658b8] text-sm font-bold mb-1">Teach it back</div>
                  <p className="text-sm text-slate-600 mb-2">
                    You worked the last {answeredPlan.hiddenCount === 1 ? 'step' : `${answeredPlan.hiddenCount} steps`} yourself.
                    Say <em>why</em> {answeredPlan.hiddenCount === 1 ? 'it works' : 'they work'} — out loud or in your head — then check:
                  </p>
                  {!selfExplainOpen ? (
                    <button onClick={() => setSelfExplainOpen(true)} className="text-sm text-[#6d6fcb] hover:text-[#5658b8] font-semibold transition-colors">
                      Show the thinking
                    </button>
                  ) : (
                    <div className="space-y-1">
                      {answeredPlan.hidden.map((s, i) => (
                        <div key={i} className="flex gap-2 text-sm text-slate-700">
                          <span className="text-[#6d6fcb] font-bold min-w-[20px] tabular-nums">{answeredPlan.shown.length + i + 1}.</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Missed it — show the answer AND the full working, warmly */}
              {feedback === 'incorrect' && (
                <div className="rounded-2xl p-4 mb-4 bg-[#fdf2ef] border border-[#f2cdc2]">
                  <span className="text-[#c0663f] font-bold">Not quite — the answer is <span className="font-mono text-slate-900">{problem.answer}</span></span>
                  {wrongInfo?.diagnosis && <p className="mt-1.5 text-sm text-slate-700">{wrongInfo.diagnosis}</p>}
                  {(() => {
                    // Working for the LEARNER'S problem (never a stand-in example),
                    // showing the parts — the moment the missed step becomes visible.
                    const steps = problem.solutionSteps || computeSteps(problem) || generateWorkedExample(activeSkill)?.steps;
                    if (!steps) return null;
                    return (
                      <div className="mt-3 pt-3 border-t border-[#f2cdc2]">
                        <span className="text-sm text-slate-500 mb-2 block">Here's the full working, step by step:</span>
                        <div className="space-y-1.5">
                          {steps.map((step, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <span className="text-[#c0663f] font-bold tabular-nums">{i + 1}.</span>
                              <span className="text-slate-700">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Remediation — a gentle nudge to shore up a foundation */}
              {remediationSkills && <div className="bg-[#f2f6ec] border border-[#cfe0bd] rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 text-[#5a7a3a] font-semibold mb-2"><Icon name="target" className="w-5 h-5" /> Let's shore up a foundation first</div>
                <p className="text-sm text-slate-600 mb-3">A quick warm-up on these will make this one click:</p>
                <div className="space-y-2">{remediationSkills.map(rs => (
                  <button key={rs.id} onClick={() => startLesson(rs.id)} className="w-full text-left p-3 bg-white border border-[#cfe0bd] rounded-xl hover:bg-[#eef4e7] transition-colors">
                    <div className="font-medium text-slate-900">{rs.name}</div>
                    <div className="text-xs text-slate-500">{rs.reason}</div>
                  </button>
                ))}</div>
              </div>}

              {!feedback ? <button onClick={checkAnswer} disabled={!answer.trim() && !(problem.visual && visualAnswer != null)} className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 rounded-2xl py-4 font-bold transition-colors">{attemptCount > 0 ? 'Try Again' : 'Check Answer'}</button>
                : <button onClick={nextProblem} className="w-full bg-[#6d6fcb] hover:bg-[#5658b8] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-colors">Next <Icon name="arrow" className="w-5 h-5" /></button>}
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
      <div className="min-h-screen bg-[#eef0f2] text-slate-900">
        <div className="bg-white/85 backdrop-blur border-b border-slate-200/70 sticky top-0 z-40 shrink-0">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => { setReviewTimerActive(false); goHome(); }} className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-sm"><Icon name="back" className="w-4 h-4" /> Exit</button>
            <div className="flex items-center gap-2 text-slate-400">
              <Icon name="clock" className="w-4 h-4" />
              <span className="font-mono text-sm tabular-nums">{mins}:{secs.toString().padStart(2, '0')}</span>
            </div>
            <div className="text-slate-500 font-semibold text-sm tabular-nums">{reviewIndex + 1}/{reviewProblems.length}</div>
          </div>
          <div className="h-1.5 bg-slate-100"><div className="h-full bg-[#6d6fcb] transition-all rounded-r-full" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="px-4 pt-6 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start gap-3 mb-4">
              <HorebBot size={40} className="shrink-0" />
              <div className="bg-white rounded-2xl rounded-tl-md border border-slate-200 px-4 py-2.5 text-[15px] text-slate-700 shadow-sm">
                Memory check — {skill?.name}. Straight from memory, no notes.
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-4">
              <div className="text-[22px] font-bold text-slate-900 mb-6 leading-snug">{problem?.question}</div>
              {problem?.visual && (
                <div className="mb-4">
                  <InteractiveVisual
                    visualType={problem.visual.type}
                    visualData={problem.visual.data}
                    onAnswer={setVisualAnswer}
                    disabled={!!feedback}
                  />
                </div>
              )}
              <input type="text" inputMode={/^-?\d+$/.test(String(problem?.answer ?? '')) ? 'numeric' : undefined} value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === 'Enter' && !feedback && handleReviewAnswer()} disabled={!!feedback} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3.5 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:opacity-60 placeholder:text-slate-400" autoFocus placeholder={problem?.visual ? 'Tap the picture above — or type your answer' : 'Type your answer…'} />
            </div>

            {feedback && (
              feedback === 'correct'
                ? <div className="rounded-2xl p-4 mb-4 bg-[#eef4e7] border border-[#cfe0bd]"><span className="text-[#4f7233] font-bold">✓ Still got it!</span></div>
                : (
                  <div className="rounded-2xl p-4 mb-4 bg-[#fdf2ef] border border-[#f2cdc2]">
                    <span className="text-[#c0663f] font-bold">Not this time — it&rsquo;s <span className="font-mono text-slate-900">{problem?.answer}</span></span>
                    <p className="text-sm text-slate-600 mt-1">That&rsquo;s exactly what a review is for — I&rsquo;ll bring this one back sooner.</p>
                  </div>
                )
            )}
            {!feedback && <button onClick={handleReviewAnswer} disabled={!answer.trim() && !(problem?.visual && visualAnswer != null)} className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 rounded-2xl py-4 font-bold transition-colors">Check</button>}
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
      <div className="min-h-screen bg-[#eef0f2] text-slate-900 flex items-center justify-center p-4">
        <CelebrationOverlay item={celebrations[0]} onDismiss={dismissCelebration} />
        <div className="max-w-md text-center">
          <Icon name="check" className="w-16 h-16 text-[#5a7a3a] mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Review complete</h2>
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-6 space-y-3">
            <div className="flex justify-between"><span className="text-slate-500">Accuracy</span><span className={`font-bold ${accuracy >= 80 ? 'text-[#5a7a3a]' : accuracy >= 60 ? 'text-amber-600' : 'text-[#c0663f]'}`}>{accuracy}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Questions</span><span className="font-bold text-slate-900">{session.correct}/{session.total}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-bold text-slate-900">{mins}m {secs}s</span></div>
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
  const jsGrade = getEstimatedGradeLevel(progress, ctx);

  // Prefer the Python brain's measurement when available. Otherwise show a
  // STABLE level anchored on the diagnostic placement: it acts as a floor so the
  // level doesn't drop to the conservative mastery-count estimate when the brain
  // is briefly unreachable, can rise as the student masters higher-grade skills,
  // and is walked DOWN by getEffectivePlacement after sustained struggle.
  const path = brainPath || jsPath;
  const effectivePlacement = getEffectivePlacement(progress, ctx);
  const estimatedGrade = brainProfile
    ? Math.round(brainProfile.overall_level)
    : (effectivePlacement != null ? Math.max(effectivePlacement, jsGrade) : jsGrade);
  const brainAccelerated = brainProfile?.accelerated;

  // Progress-dashboard views are scoped to the active curriculum and exclude
  // out-of-scope "enrichment" skills, so a CBC/Cambridge learner's in-scope
  // mastery isn't diluted by topics their syllabus doesn't cover. (Native view
  // has no enrichment, so these match the unscoped numbers.)
  const scopedStats = getStats(progress, ctx, { excludeEnrichment: true });
  const scopedStrandStats = getStrandStats(progress, ctx, { excludeEnrichment: true });
  const scopedGradeStats = getGradeStats(progress, ctx, { excludeEnrichment: true });
  const brainStrandLevel = (name) => brainProfile?.strands?.find(b => b.strand === name) || null;

  return (
    <div className="min-h-screen bg-[#eef0f2] text-slate-900 lg:flex app-shell">
      <CelebrationOverlay item={celebrations[0]} onDismiss={dismissCelebration} />

      {/* ===== SIDEBAR (desktop) ===== */}
      <aside className="hidden lg:flex lg:flex-col w-[248px] shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen px-4 py-5">
        <div className="flex items-center gap-2.5 px-2 pb-5">
          <HorebBot size={30} />
          <b className="text-[18px] font-extrabold tracking-tight">HOREB</b>
        </div>
        <nav className="flex flex-col gap-1">
          {[['overview', 'Home', 'home'], ['path', 'My path', 'target'], ['skills', 'Skills', 'map'], ['stats', 'Progress', 'bar'], ['awards', 'Awards', 'trophy']].map(([id, label, icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14.5px] font-semibold transition-colors ${activeTab === id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Icon name={icon} className="w-[19px] h-[19px]" />{label}
            </button>
          ))}
          <button onClick={() => { setShowJoin(s => !s); setJoinStatus(null); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14.5px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <span className="w-[19px] text-center text-lg leading-none">+</span>Join a class
          </button>
        </nav>
        <div className="flex-1" />
        <div className="border-t border-slate-100 pt-3 space-y-1">
          {curriculaOptions.length > 1 && (
            <select value={curriculum} onChange={(e) => setProgress(p => ({ ...p, curriculum: e.target.value }))} title="Curriculum view" className="w-full text-xs bg-slate-50 text-slate-600 rounded-lg px-2.5 py-2 border border-slate-200 focus:outline-none">
              {curriculaOptions.map(c => <option key={c.id} value={c.id}>{c.shortName}</option>)}
            </select>
          )}
          <button onClick={switchSubject} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-slate-500 hover:bg-slate-50 transition-colors"><Icon name="book" className="w-4 h-4" />Switch subject</button>
          <button onClick={resetAll} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-slate-500 hover:bg-slate-50 transition-colors"><Icon name="refresh" className="w-4 h-4" />Reset progress</button>
        </div>
        <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-100">
          <HorebBot size={32} />
          <div className="min-w-0"><b className="text-[13.5px] block truncate">{((activeLearner?.name || studentName) || 'You').trim().split(/\s+/)[0]}</b><span className="text-[12px] text-slate-400">{gradeLabel(estimatedGrade)} · {sub?.shortName}</span></div>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden sticky top-0 z-40 shrink-0 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 min-h-14 py-2">
        <div className="flex items-center gap-2">
          {onBack && <button onClick={onBack} className="text-slate-400 mr-1"><Icon name="back" className="w-5 h-5" /></button>}
          <HorebBot size={28} /><b className="text-[17px] font-extrabold tracking-tight">HOREB</b>
        </div>
        <div className="flex items-center gap-3.5">
          {progress.currentStreak > 0 && <span className="flex items-center gap-1 text-amber-500 text-sm font-bold"><Icon name="flame" className="w-4 h-4" />{progress.currentStreak}d</span>}
          <button onClick={switchSubject} className="text-slate-400" title="Switch subject"><Icon name="book" className="w-[18px] h-[18px]" /></button>
          <button onClick={resetAll} className="text-slate-400" title="Reset progress"><Icon name="refresh" className="w-[18px] h-[18px]" /></button>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <main className="flex-1 min-w-0 app-scroll">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-28 lg:pb-14">

        {/* ========== OVERVIEW (HOME) TAB ========== */}
        {activeTab === 'overview' && (() => {
          const firstName = ((activeLearner?.name || studentName) || '').trim().split(/\s+/)[0];
          const hour = new Date().getHours();
          const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
          const dueReviews = reviews.length;
          const nextItem = path[0];
          const recentBadges = (() => {
            const got = new Set(progress.achievements || []);
            return ACHIEVEMENTS.filter(a => got.has(a.id)).slice(-3).reverse();
          })();
          // The next step must not move under the child's feet: keep the skill
          // we last pointed at until it is mastered (or gone from the path).
          const pinnedId = progress.focusSkillId;
          const pinned = pinnedId && !progress.skills[pinnedId]?.mastered
            ? (path.find(p => p.id === pinnedId) || (SKILLS[pinnedId] ? { id: pinnedId, name: SKILLS[pinnedId].name } : null))
            : null;
          const nextPick = pinned || nextItem;
          if (nextPick && nextPick.id !== pinnedId) {
            // remember it for next time (write-behind; harmless if it repeats)
            setTimeout(() => setProgress(pr => pr.focusSkillId === nextPick.id ? pr : { ...pr, focusSkillId: nextPick.id }), 0);
          }
          const cta = dueReviews > 0
            ? { label: 'Start your review', sub: `${dueReviews} skill${dueReviews === 1 ? '' : 's'} due — keep them from fading`, icon: 'refresh', onClick: startReview }
            : nextPick
            ? { label: 'Continue learning', sub: nextPick.name, icon: 'play', onClick: () => startLesson(nextPick.id) }
            : { label: 'Take the diagnostic', sub: 'Find your level and get your plan', icon: 'target', onClick: startDiagnostic };
          const confidencePct = brainProfile ? Math.round((brainProfile.confidence || 0) * 100) : null;
          // Daily-goal ring — rendered near the top on mobile and in the right rail on desktop
          const goalRing = (() => {
            const earned = todaysXP(progress);
            const pct = dailyGoalPercent(progress);
            const met = dailyGoalMet(progress);
            const R = 52, C = 2 * Math.PI * R;
            const off = C * (1 - Math.min(1, pct / 100));
            return (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 text-center">
                <div className="text-slate-800 font-semibold text-[15px] mb-2">{met ? 'Goal reached!' : 'Today’s goal'}</div>
                <div className="relative w-[128px] h-[128px] mx-auto">
                  <svg width="128" height="128" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={R} fill="none" stroke="#eef0f3" strokeWidth="11" />
                    <circle cx="64" cy="64" r={R} fill="none" stroke={met ? '#8ca86a' : '#f2a828'} strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset .6s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <b className="text-[26px] font-extrabold tabular-nums leading-none">{Math.min(earned, DAILY_GOAL_XP)}<span className="text-slate-400 text-[15px]">/{DAILY_GOAL_XP}</span></b>
                    <span className="text-[11px] text-slate-400 mt-0.5">XP today</span>
                  </div>
                </div>
                <p className="text-[12.5px] text-slate-500 mt-2.5 leading-snug">
                  {met
                    ? 'Wonderful — see you tomorrow to keep the streak alive.'
                    : progress.currentStreak > 0
                      ? `${Math.max(0, DAILY_GOAL_XP - earned)} XP to go · ${progress.currentStreak}-day streak`
                      : `${Math.max(0, DAILY_GOAL_XP - earned)} XP to go today.`}
                </p>
              </div>
            );
          })();
          return (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:items-start">
              {/* Learner switcher — a parent runs HOREB per child. Each learner
                  has their own diagnostic, level, and progress. */}
              {learners.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap lg:col-span-3">
                  <span className="text-xs text-slate-400 mr-1">Practising as</span>
                  <button onClick={() => setActiveLearner(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!activeLearner ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    You
                  </button>
                  {learners.map(c => (
                    <button key={c.id} onClick={() => setActiveLearner(c)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeLearner?.id === c.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {(c.name || '').trim().split(/\s+/)[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* ===== LEFT COLUMN — the main flow: what to do, what to fix, progress ===== */}
              <div className="lg:col-span-2 space-y-4">
              {/* Greeting — the guide + who/where */}
              <div className="flex items-center gap-3">
                <HorebBot size={44} className="shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 leading-tight">{greeting}{firstName ? `, ${firstName}` : ''}</h2>
                  <p className="text-sm text-slate-500">{gradeLabel(estimatedGrade)} · your level{brainAccelerated ? ' · above grade' : ''}</p>
                </div>
              </div>

              {/* Daily-goal ring — mobile only, kept near the top so it's the first thing they see */}
              <div className="lg:hidden">{goalRing}</div>

              {/* Resume card — light, content-forward (fixes the 'AI' navy hero) */}
              <button onClick={cta.onClick} className="w-full text-left bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex items-center gap-4 hover:border-slate-300 transition-colors">
                <div className="w-[68px] h-[68px] rounded-2xl bg-[#f5f6fc] border border-[#e8e9f6] flex items-center justify-center shrink-0 text-[#6d6fcb]">
                  <Icon name={cta.icon} className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-bold tracking-[.08em] uppercase text-amber-700">{cta.label}</div>
                  <div className="text-[18px] font-extrabold tracking-tight text-slate-900 mt-1 leading-tight">{cta.sub}</div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-2 bg-amber-400 text-slate-900 font-bold rounded-2xl px-5 py-2.5">
                  <Icon name="play" className="w-4 h-4" /> Go
                </span>
              </button>

              {/* Your path — the next few skills as designed cards with status */}
              {path.length > 0 && (
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between px-5 pt-4 pb-1">
                    <span className="text-slate-800 font-semibold text-[15px]">Your path</span>
                    <button onClick={() => setActiveTab('path')} className="text-xs text-amber-600 hover:text-amber-700">View all →</button>
                  </div>
                  <div className="px-2 pb-2">
                    {path.slice(0, 4).map((it) => {
                      const sp = progress.skills[it.id] || {};
                      const status = sp.mastered ? 'done' : (sp.attempts ? 'prog' : 'next');
                      const min = SKILLS[it.id]?.minProblems || 5;
                      const pct = status === 'done' ? 100 : (sp.attempts ? Math.min(100, Math.round((sp.correct || 0) / min * 100)) : 0);
                      const tint = status === 'done' ? 'bg-[#eef4e7] text-[#4f6a30]' : status === 'prog' ? 'bg-[#fff4e2] text-[#a5670a]' : 'bg-slate-100 text-slate-400';
                      const chipTxt = status === 'done' ? 'Mastered' : status === 'prog' ? 'In progress' : 'Up next';
                      return (
                        <button key={it.id} onClick={() => startLesson(it.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
                            <Icon name={status === 'done' ? 'check' : 'play'} className="w-4 h-4" />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[14px] font-semibold text-slate-900 truncate">{it.name || SKILLS[it.id]?.name}</span>
                            <span className="block text-xs text-slate-400 truncate">{SKILLS[it.id]?.strand || ''}</span>
                          </span>
                          <span className="hidden sm:block w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0"><span className="block h-full rounded-full bg-[#8ca86a]" style={{ width: `${pct}%` }} /></span>
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${status === 'next' ? 'bg-slate-100 text-slate-500' : tint}`}>{chipTxt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gaps */}
              {gaps.length > 0 && (
                <button onClick={() => setActiveTab('path')} className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-left hover:border-slate-300 transition-colors">
                  <div className="text-amber-600 font-semibold mb-1">Where we’ll start</div>
                  <p className="text-xs text-slate-500 mb-2.5">A few foundations to build first — HOREB takes them one step at a time, so nothing piles up.</p>
                  <div className="flex flex-wrap gap-2">{gaps.slice(0, 3).map(g => <span key={g.id} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-700">{g.name}</span>)}</div>
                </button>
              )}

              {/* Strand progress */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-800 font-semibold">Your progress</span>
                  <button onClick={() => setActiveTab('stats')} className="text-xs text-amber-600 hover:text-amber-700">Details →</button>
                </div>
                <div className="space-y-2.5">{scopedStrandStats.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 w-24 truncate" title={s.name}>{s.name}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full transition-all ${s.assessed ? 'bg-[#8ca86a]' : 'bg-slate-200'}`} style={{ width: `${s.percent}%` }} /></div>
                    <span className="text-xs font-semibold w-14 text-right text-slate-700 tabular-nums">{s.assessed ? `${s.percent}%` : '—'}</span>
                  </div>
                ))}</div>
              </div>
              </div>{/* ===== end LEFT COLUMN ===== */}

              {/* ===== RIGHT COLUMN — the glanceable sidebar ===== */}
              <div className="space-y-4">
              {/* Join a class — surfaced from the sidebar's "+ Join a class" */}
              {showJoin && (
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
                  {joinStatus === 'ok' ? (
                    <p className="text-sm text-[#5a7a3a] font-medium">✓ Joined! Your teacher can now see your progress.</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-800 mb-1">Join your class</p>
                      <p className="text-xs text-slate-500 mb-2.5">Enter the code from your teacher:</p>
                      <div className="flex gap-2">
                        <input
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && joinClass()}
                          placeholder="ABC123"
                          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button onClick={joinClass} disabled={joinStatus === 'joining' || !joinCode.trim()} className="px-4 py-2 bg-amber-400 text-slate-900 hover:bg-amber-300 disabled:opacity-40 rounded-xl text-sm font-bold transition-colors">
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

              {/* Today's goal — ring (desktop rail; the mobile copy sits up top) */}
              <div className="hidden lg:block">{goalRing}</div>

              {/* Live tutoring — a first-class door, not a footnote. Practice
                  and a real tutor are the two halves of the same promise. */}
              {onFindTutor && (
                <div className="bg-gradient-to-br from-[#f5f6fc] to-white border border-[#d3daf0] shadow-sm rounded-2xl p-4">
                  <div className="text-slate-900 font-semibold text-[15px]">Live help, any time</div>
                  <p className="text-[13px] text-slate-500 mt-1 mb-3">Stuck on something, or want a person to walk it through with you? Kenya's best tutors are one tap away.</p>
                  <button onClick={onFindTutor} className="w-full bg-[#6d6fcb] hover:bg-[#5658b8] text-white rounded-xl py-2.5 text-sm font-bold transition-colors">Find a live tutor</button>
                </div>
              )}

              {/* Quick stats. On a phone these sit under the real content and a
                  zero reads as failure, so only earned numbers show; the full
                  set stays in the desktop rail (and always in Progress). */}
              {(() => {
                const all = [
                  { icon: 'target', val: `${scopedStats.percent}%`, label: 'Mastery', color: 'text-[#5a7a3a]', earned: scopedStats.percent > 0 },
                  { icon: 'zap', val: progress.totalXP || 0, label: 'XP', color: 'text-amber-500', earned: (progress.totalXP || 0) > 0 },
                  { icon: 'flame', val: progress.currentStreak || 0, label: 'Streak', color: 'text-orange-500', earned: (progress.currentStreak || 0) > 0 },
                  { icon: 'check', val: `${scopedStats.accuracy}%`, label: 'Accuracy', color: 'text-[#6d6fcb]', earned: scopedStats.accuracy > 0 },
                ];
                const Tile = ({ s }) => (
                  <div key={s.label} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-center">
                    <Icon name={s.icon} className={`w-4 h-4 mx-auto mb-1.5 ${s.color}`} />
                    <div className="text-xl font-bold leading-none text-slate-900 tabular-nums">{s.val}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">{s.label}</div>
                  </div>
                );
                const earned = all.filter(s => s.earned);
                return (
                  <>
                    <div className="hidden lg:grid grid-cols-2 gap-2.5">{all.map(s => <Tile key={s.label} s={s} />)}</div>
                    {earned.length > 0 && (
                      <div className={`lg:hidden grid gap-2.5 ${earned.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {earned.map(s => <Tile key={s.label} s={s} />)}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Recent badges */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-800 font-semibold">Recent badges</span>
                  <button onClick={() => setActiveTab('awards')} className="text-xs text-amber-600 hover:text-amber-700">All →</button>
                </div>
                {recentBadges.length > 0 ? (
                  <div className="flex gap-3">{recentBadges.map(a => (
                    <div key={a.id} className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{a.icon}</div>
                      <div className="text-[11px] font-medium text-amber-800 leading-tight">{a.name}</div>
                    </div>
                  ))}</div>
                ) : (
                  <p className="text-xs text-slate-400">No badges yet — finish a lesson to earn your first one.</p>
                )}
              </div>

              {/* Retake diagnostic */}
              <button onClick={() => setView('welcome')} className="w-full text-center text-xs text-slate-400 hover:text-slate-700 py-2 transition-colors">Retake the check</button>
              </div>{/* ===== end RIGHT COLUMN ===== */}
            </div>
          );
        })()}

        {/* ========== PATH TAB ========== */}
        {activeTab === 'path' && (
          <div>
            {/* Review banner */}
            {reviews.length > 0 && (
              <button onClick={startReview} className="w-full bg-[#f5f6fc] border border-[#d3daf0] rounded-2xl p-4 mb-4 flex items-center justify-between hover:bg-[#eef0fb] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6d6fcb] text-white rounded-xl flex items-center justify-center"><Icon name="refresh" className="w-5 h-5" /></div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">Review Session</div>
                    <div className="text-xs text-[#6d6fcb]">{reviews.length} skills due — timed & interleaved</div>
                  </div>
                </div>
                <Icon name="arrow" className="w-5 h-5 text-[#6d6fcb]" />
              </button>
            )}

            {/* Gaps alert */}
            {gaps.length > 0 && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 text-amber-600 font-semibold mb-2"><Icon name="target" className="w-5 h-5" /> Foundations to build first</div>
                <p className="text-sm text-slate-500 mb-3">HOREB starts here and builds up from these, one step at a time:</p>
                <div className="flex flex-wrap gap-2">{gaps.slice(0, 3).map(g => <span key={g.id} className="px-2.5 py-1 bg-slate-100 rounded-lg text-sm text-slate-700">{g.name}</span>)}</div>
              </div>
            )}

            {/* Recommended path */}
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-900"><Icon name="target" className="w-5 h-5 text-[#8ca86a]" /> Your Learning Path</h2>
            {path.length > 0 ? (
              <div className="space-y-2 mb-6">{path.map((s, i) => (
                <button key={s.id} onClick={() => startLesson(s.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${s.type === 'gap' ? 'bg-[#fdf2ef] border-[#f2cdc2] hover:bg-[#fbe9e3]' : s.type === 'review' ? 'bg-[#f5f6fc] border-[#d3daf0] hover:bg-[#eef0fb]' : s.type === 'remediation' ? 'bg-[#fff7ec] border-[#f6e2bd]' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0 ${s.type === 'gap' ? 'bg-[#c0663f]' : s.type === 'review' ? 'bg-[#6d6fcb]' : 'bg-[#8ca86a]'}`}>{i + 1}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-900 flex items-center gap-2">{s.name}{s.critical && <Icon name="zap" className="w-4 h-4 text-amber-500" />}</div>
                    <div className="text-xs text-slate-500">{s._brain ? s.reason : s.type === 'gap' ? s.reason : s.type === 'review' ? `Review (${s.daysSince}d ago)` : `Grade ${s.grade} — ${s.strand}`}</div>
                  </div>
                  <Icon name="arrow" className="w-5 h-5 text-slate-300" />
                </button>
              ))}</div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Icon name="trophy" className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="font-semibold mb-1 text-slate-900">Amazing work!</p>
                <p className="text-sm">All available skills are mastered. Check back for reviews.</p>
              </div>
            )}

            {/* Overall progress — scoped to the active curriculum (enrichment excluded) */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-700">{curriculum === NATIVE ? 'Overall Mastery' : 'In-syllabus Mastery'}</span>
                <span className="text-[#5a7a3a] font-bold">{scopedStats.percent}% ({scopedStats.mastered}/{scopedStats.total})</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4"><div className="h-full bg-[#8ca86a] transition-all" style={{ width: `${scopedStats.percent}%` }} /></div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">{scopedStrandStats.map(s => (
                <div key={s.name} className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                  <div className="text-slate-500 text-xs">{s.name}</div>
                  <div className="font-bold text-slate-900">{s.assessed ? `${s.percent}%` : '—'}</div>
                  {s.accuracy !== null && s.accuracy < 70 && <div className="text-xs text-[#c0663f]">{s.accuracy}%</div>}
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
                  <button onClick={() => setExpanded(isExp ? null : grade)} className="w-full flex items-center justify-between bg-white border border-slate-200 shadow-sm rounded-2xl p-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white ${grade <= 6 ? 'bg-[#8ca86a]' : grade <= 8 ? 'bg-[#6d6fcb]' : grade <= 10 ? 'bg-purple-500' : 'bg-rose-500'}`}>{grade}</div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900">{gradeLabel(grade)}</div>
                        <div className="text-sm text-slate-500">{mastered}/{gradeSkills.length} mastered</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#8ca86a]" style={{ width: `${(mastered / gradeSkills.length) * 100}%` }} /></div>
                      <Icon name={isExp ? 'up' : 'down'} className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>
                  {isExp && (
                    <div className="mt-2 space-y-3 pl-2">
                      {Object.entries(byStrand).map(([strand, skills]) => (
                        <div key={strand}>
                          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 px-2">{strand}</div>
                          <div className="space-y-1">{skills.map(skill => {
                            const status = getStatus(skill.id, progress, ctx);
                            const sp = progress.skills[skill.id];
                            return (
                              <button key={skill.id} onClick={() => status !== 'locked' && startLesson(skill.id)} disabled={status === 'locked'} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${status === 'locked' ? 'bg-slate-50 border border-slate-100 opacity-70 cursor-not-allowed' : status === 'mastered' ? 'bg-[#eef4e7] border border-[#cfe0bd] hover:bg-[#e6efd9]' : status === 'in_progress' ? 'bg-[#f5f6fc] border border-[#e8e9f6] hover:bg-[#eef0fb]' : 'bg-white border border-slate-200 hover:border-slate-300'}`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${status === 'locked' ? 'bg-slate-300' : status === 'mastered' ? 'bg-[#8ca86a]' : status === 'in_progress' ? 'bg-[#6d6fcb]' : 'bg-slate-300'}`}>
                                  {status === 'locked' ? <Icon name="lock" className="w-3.5 h-3.5" /> : status === 'mastered' ? <Icon name="check" className="w-3.5 h-3.5" /> : status === 'in_progress' ? <Icon name="trend" className="w-3.5 h-3.5" /> : <Icon name="play" className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="text-sm font-medium text-slate-900 flex items-center gap-2">{skill.name}{skill.critical && <Icon name="zap" className="w-3.5 h-3.5 text-amber-500" />}{isEnrichment(skill, curriculum) && <span className="text-[10px] uppercase tracking-wide text-amber-700 bg-amber-100 rounded px-1.5 py-0.5">Enrichment</span>}</div>
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
            {/* Your Level — surfaces the engine's actual measurement (or a JS estimate) */}
            <div className="bg-gradient-to-br from-[#eef4e7] to-white border border-[#cfe0bd] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-[#5a7a3a] mb-1">Your current level</div>
                  <div className="text-2xl font-bold leading-tight text-slate-900">{gradeLabel(estimatedGrade)}</div>
                </div>
                {brainAccelerated && (
                  <span className="shrink-0 text-[11px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1">
                    Working above grade
                  </span>
                )}
              </div>
              {brainProfile ? (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Measurement confidence</span>
                    <span>{Math.round((brainProfile.confidence || 0) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8ca86a] transition-all" style={{ width: `${Math.round((brainProfile.confidence || 0) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {brainAccelerated && brainProfile.headroom_grades >= 1
                      ? `You're succeeding about ${Math.round(brainProfile.headroom_grades * 10) / 10} grade${brainProfile.headroom_grades >= 2 ? 's' : ''} above your working level — no ceiling here.`
                      : brainProfile.confidence < 0.4
                        ? 'Answer a few more questions to sharpen this estimate.'
                        : 'Measured live from how you answer — it updates as you learn.'}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">Estimated from your mastered skills. Take the diagnostic for a sharper read.</p>
              )}
            </div>

            {/* Big numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-[#5a7a3a]">{scopedStats.mastered}</div>
                <div className="text-sm text-slate-500">Skills Mastered</div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-500">{progress.totalXP || 0}</div>
                <div className="text-sm text-slate-500">Total XP</div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-[#6d6fcb]">{scopedStats.accuracy}%</div>
                <div className="text-sm text-slate-500">Accuracy</div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-orange-500">{progress.currentStreak || 0}</div>
                <div className="text-sm text-slate-500">Day Streak</div>
              </div>
            </div>

            {/* In-scope mastery + enrichment note */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-700">{curriculum === NATIVE ? 'Overall mastery' : 'In-syllabus mastery'}</span>
                <span className="text-[#5a7a3a] font-bold">{scopedStats.percent}% ({scopedStats.mastered}/{scopedStats.total})</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#8ca86a] transition-all" style={{ width: `${scopedStats.percent}%` }} /></div>
              {scopedStats.enrichment > 0 && (
                <p className="text-xs text-amber-700 mt-2">+ {scopedStats.enrichment} enrichment skill{scopedStats.enrichment === 1 ? '' : 's'} beyond the {curriculaOptions.find(c => c.id === curriculum)?.shortName || ''} syllabus — explore them anytime in All Skills.</p>
              )}
            </div>

            {/* Grade/Stage breakdown — curriculum-aware labels */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
              <h3 className="font-semibold mb-3 text-slate-900">{getCurriculum(curriculum).bandLabel} Progress</h3>
              <div className="space-y-2">{scopedGradeStats.map(gs => (
                <div key={gs.grade} className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 w-28 truncate" title={gradeLabel(gs.grade)}>{gradeLabel(gs.grade)}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#8ca86a] transition-all" style={{ width: `${gs.percent}%` }} /></div>
                  <span className="text-sm font-medium w-12 text-right text-slate-700">{gs.percent}%</span>
                </div>
              ))}</div>
            </div>

            {/* Strand breakdown — with engine level + "not assessed" clarity */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
              <h3 className="font-semibold mb-3 text-slate-900">Strand Mastery</h3>
              <div className="space-y-2">{scopedStrandStats.map(ss => {
                const bs = brainStrandLevel(ss.name);
                return (
                  <div key={ss.name} className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 w-24 truncate" title={ss.name}>{ss.name}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full transition-all ${ss.assessed ? 'bg-[#8ca86a]' : 'bg-slate-200'}`} style={{ width: `${ss.percent}%` }} /></div>
                    {ss.assessed
                      ? <span className="text-sm font-medium w-16 text-right text-slate-700">{bs ? gradeLabel(bs.grade_level).replace(/ —.*/, '') : `${ss.mastered}/${ss.total}`}</span>
                      : <span className="text-xs text-slate-400 w-16 text-right">not assessed</span>}
                  </div>
                );
              })}</div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button onClick={() => setView('welcome')} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-[#6d6fcb] hover:bg-slate-50 transition-colors text-sm font-medium">Retake Diagnostic Test</button>
            </div>
          </div>
        )}

        {/* ========== AWARDS TAB ========== */}
        {activeTab === 'awards' && (() => {
          const unlocked = new Set(progress.achievements || []);
          return (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-500">{unlocked.size}<span className="text-slate-400 text-lg">/{ACHIEVEMENTS.length}</span></div>
                <div className="text-sm text-slate-500">Badges earned — keep going, every one is a win!</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACHIEVEMENTS.map(a => {
                  const got = unlocked.has(a.id);
                  return (
                    <div key={a.id} className={`rounded-2xl p-4 text-center border shadow-sm transition-colors ${got ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                      <div className={`text-3xl mb-1 ${got ? '' : 'grayscale opacity-40'}`}>{a.icon}</div>
                      <div className={`text-sm font-semibold ${got ? 'text-slate-900' : 'text-slate-400'}`}>{a.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
                      {got && <div className="text-[10px] uppercase tracking-wide text-amber-600 mt-1">Earned</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600 text-xs space-y-1 pb-8">
          <p>Adaptive learning path · Spaced repetition · Knowledge graph</p>
        </div>
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-slate-200 flex justify-around px-1 pt-2" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
        {[['overview', 'Home', 'home'], ['path', 'Path', 'target'], ['skills', 'Skills', 'map'], ['stats', 'Progress', 'bar'], ['awards', 'Awards', 'trophy']].map(([id, label, icon]) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors ${activeTab === id ? 'text-slate-900' : 'text-slate-400'}`}>
            <Icon name={icon} className="w-[21px] h-[21px]" /><span className="text-[10px] font-semibold">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default AIMastery;
