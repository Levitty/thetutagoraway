// ============================================================================
// LAZY ROUTES — the screens that must not be in the first download.
//
// Everything here is a whole screen reached by navigation, never part of the
// first paint. Each one is wrapped in its own Suspense boundary so the call
// sites in App.jsx stay exactly as they were: App.jsx imports these names from
// here instead of from their own files, and nothing else changes.
//
// Why this and not a per-grade content split: the authored content is reachable
// only through AIMastery and TeacherDashboard (they are the only importers of
// problemGenerators.js). Putting the dynamic import at the COMPONENT boundary
// takes the whole corpus — content, generators, the adaptive engine — out of
// the initial chunk for free, and generateProblem() stays synchronous, so the
// tests and the quality gate are untouched. Splitting content/ by grade instead
// would mean re-filing hundreds of skills out of the strand files they live in
// (numbers.js alone spans Grade 5 to Grade 10) for the same bytes.
//
// The heaviest item by far is VideoRoom: it pulls agora-rtc-sdk-ng, 369 kB
// gzipped — 41% of what every learner used to download, for a video call that
// a practice session never opens.
//
// A named export has to be mapped to `default` for React.lazy; the ones that
// already export default are imported straight.
// ============================================================================
import React, { Suspense, lazy } from 'react';

// Deliberately not App.jsx's LoadingSpinner: that one plays a 1 MB Lottie that
// is runtime-cached, not precached, so using it as the fallback for a route
// chunk could mean fetching more than the chunk being waited on. Plain CSS,
// nothing to download, same slate palette.
const RouteLoading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
    <span className="text-sm text-slate-400 font-medium">Loading…</span>
  </div>
);

const named = (load, name) => lazy(() => load().then((m) => ({ default: m[name] })));

const LazyVideoRoom = named(() => import('./VideoRoom'), 'VideoRoom');
const LazyAIMastery = named(() => import('./ai-tutor/AIMastery.jsx'), 'AIMastery');
const LazyTeacherDashboard = named(() => import('./ai-tutor/TeacherDashboard.jsx'), 'TeacherDashboard');
const LazyWriting = named(() => import('./writing/Writing.jsx'), 'Writing');
const LazySpreadsheet = named(() => import('./Spreadsheet.jsx'), 'Spreadsheet');
const LazyConsultingPage = named(() => import('./ConsultingPage.jsx'), 'ConsultingPage');
const LazySchoolsPage = lazy(() => import('./SchoolsPage.jsx'));
const LazyClubsPage = lazy(() => import('./ClubsPage.jsx'));

const route = (Lazy) => {
  const Route = (props) => (
    <Suspense fallback={<RouteLoading />}><Lazy {...props} /></Suspense>
  );
  return Route;
};

export const VideoRoom = route(LazyVideoRoom);
export const AIMastery = route(LazyAIMastery);
export const TeacherDashboard = route(LazyTeacherDashboard);
export const Writing = route(LazyWriting);
export const Spreadsheet = route(LazySpreadsheet);
export const ConsultingPage = route(LazyConsultingPage);
export const SchoolsPage = route(LazySchoolsPage);
export const ClubsPage = route(LazyClubsPage);
