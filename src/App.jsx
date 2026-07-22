import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase';
import { VideoRoom } from './VideoRoom';
import { INTEREST_CATEGORIES, CATEGORY_BY_KEY, categoryLabel, categoryEmoji } from './groupClassCategories.js';
import { PaymentModal } from './PaymentModal';
import { initiatePaystackPayment } from './paystack';
import { Messaging, MessageButton, startConversation } from './Messaging';
import { AIMastery } from './ai-tutor/AIMastery.jsx';
import { getLevel } from './ai-tutor/adaptiveEngine.js';
import { todaysXP, dailyGoalPercent, dailyGoalMet, DAILY_GOAL_XP } from './ai-tutor/gamification.js';
import { TeacherDashboard } from './ai-tutor/TeacherDashboard.jsx';
import SchoolsPage from './SchoolsPage.jsx';
import ClubsPage from './ClubsPage.jsx';
import { ConsultingPage } from './ConsultingPage.jsx';
import { Spreadsheet } from './Spreadsheet.jsx';
import { sendEmail } from './email.js';

// ============ ERROR BOUNDARY ============
// Without this, ANY uncaught render error anywhere in the tree unmounts the
// whole app and the user is left staring at a blank white screen (e.g. the
// blank screen some tutors saw right after submitting their documents). This
// catches it, shows a friendly recoverable screen, and surfaces the error.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md w-full p-8 text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
            <p className="text-slate-500 text-sm mt-2">
              The page hit an unexpected error. Your data is safe — this is just a display glitch.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
                Reload page
              </button>
              <button onClick={() => { window.location.href = '/'; }} className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                Go home
              </button>
            </div>
            {this.state.error?.message && (
              <p className="text-xs text-slate-400 mt-4 font-mono break-words">{String(this.state.error.message)}</p>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============ LOTTIE ANIMATION COMPONENT ============
const Lottie = ({ src, width = 200, height = 200, loop = true, fallback = null }) => {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!document.querySelector('script[src*="lottie-player"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Check if the animation fails to load
    const el = ref.current;
    if (el) {
      const handleError = () => setFailed(true);
      el.addEventListener('error', handleError);
      // Also check after a timeout in case error event doesn't fire
      const timer = setTimeout(() => {
        if (el && (!el.shadowRoot || el.shadowRoot.querySelector('.error'))) {
          setFailed(true);
        }
      }, 5000);
      return () => { el.removeEventListener('error', handleError); clearTimeout(timer); };
    }
  }, [src]);

  if (failed && fallback) return fallback;

  return (
    <lottie-player
      ref={ref}
      src={src}
      background="transparent"
      speed="1"
      style={{ width, height }}
      {...(loop ? { loop: true } : {})}
      autoplay
    />
  );
};

// Lottie animation URLs
const ANIMATIONS = {
  // Hero & General
  learning: 'https://assets3.lottiefiles.com/packages/lf20_swnrn2oy.json',
  videoCall: 'https://assets9.lottiefiles.com/packages/lf20_au98jehv.json',
  success: 'https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json',
  search: 'https://assets10.lottiefiles.com/packages/lf20_rnfwc4vj.json',
  calendar: 'https://assets7.lottiefiles.com/packages/lf20_4xnyhfss.json',
  chat: 'https://assets5.lottiefiles.com/packages/lf20_zjsua8rb.json',
  empty: 'https://assets1.lottiefiles.com/packages/lf20_wnqlfojb.json',
  payment: 'https://assets2.lottiefiles.com/packages/lf20_yzoqyyqf.json',
  books: 'https://assets8.lottiefiles.com/packages/lf20_4XmSkB.json',
  
  // Subjects
  mathematics: 'https://assets9.lottiefiles.com/packages/lf20_4jldpiaq.json',
  english: 'https://assets3.lottiefiles.com/packages/lf20_1cazwtnc.json',
  physics: 'https://assets5.lottiefiles.com/packages/lf20_yyjaansa.json',
  chemistry: 'https://assets2.lottiefiles.com/packages/lf20_sz7prkob.json',
  biology: 'https://assets4.lottiefiles.com/packages/lf20_oyi9a28g.json',
  geography: 'https://assets7.lottiefiles.com/packages/lf20_svy4ivvy.json',
  history: 'https://assets6.lottiefiles.com/packages/lf20_w51pcehl.json',
  computerScience: 'https://assets1.lottiefiles.com/packages/lf20_w98qte06.json',
  languages: 'https://assets8.lottiefiles.com/packages/lf20_xlmz9xwm.json',
  business: 'https://assets10.lottiefiles.com/packages/lf20_5tl1xxnz.json',
  
  // Achievements & Progress
  certificate: 'https://assets4.lottiefiles.com/packages/lf20_touohxv0.json',
  trophy: 'https://assets9.lottiefiles.com/packages/lf20_hbggagxh.json',
  graduationCap: 'https://assets3.lottiefiles.com/packages/lf20_dmgflbmq.json',
  starBadge: 'https://assets5.lottiefiles.com/packages/lf20_obhkmrdl.json',
  rocket: 'https://assets2.lottiefiles.com/packages/lf20_x62chJ.json',
  stars: 'https://assets6.lottiefiles.com/packages/lf20_ky24lsiz.json',
  medal: 'https://assets7.lottiefiles.com/packages/lf20_wcnjmdp1.json',
  confetti: 'https://assets8.lottiefiles.com/packages/lf20_lz8v892i.json',
  lightbulb: 'https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json',
  target: 'https://assets10.lottiefiles.com/packages/lf20_myejiggj.json',
  
  // Interactions
  typing: 'https://assets2.lottiefiles.com/packages/lf20_u25cckyh.json',
  teacher: 'https://assets4.lottiefiles.com/packages/lf20_xlkxtmul.json',
  waving: 'https://assets6.lottiefiles.com/packages/lf20_v1yudlrx.json',
  notification: 'https://assets7.lottiefiles.com/packages/lf20_bkfarmxg.json',
  handshake: 'https://assets8.lottiefiles.com/packages/lf20_puciaact.json',
  clock: 'https://assets5.lottiefiles.com/packages/lf20_a2chheio.json',
};

// ============ COMPONENTS ============
const Stars = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= rating ? '#f59e0b' : '#e2e8f0'}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Fallback avatar (initials) used both as the default src and the onError swap
// so a broken avatar_url doesn't leave a blank/broken-image box.
const initialsAvatar = (name, opts = '') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=10b981&color=fff${opts}`;

// grade_levels reached the DB in three shapes over time: a real array, a
// JSON-stringified array ('["Grade 2","Grade 3"]'), or a plain comma string.
// Normalize all of them to a clean array so chips and filters never show raw JSON.
const gradeList = (g) => {
  if (!g) return [];
  if (Array.isArray(g)) return g;
  if (typeof g === 'string') {
    try {
      const parsed = JSON.parse(g);
      if (Array.isArray(parsed)) return parsed;
    } catch { /* not JSON — fall through */ }
    return g.split(',').map(s => s.replace(/[[\]"]/g, '').trim()).filter(Boolean);
  }
  return [g];
};

const Avatar = ({ src, name, size = 40 }) => (
  <img
    src={src || initialsAvatar(name)}
    alt={name}
    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = initialsAvatar(name); }}
    className="rounded-full object-cover bg-slate-200" style={{ width: size, height: size }} />
);

// ============ PRIVACY POLICY PAGE ============
const PrivacyPolicyPage = ({ onBack }) => (
  <div className="min-h-screen bg-white">
    <div className="max-w-3xl mx-auto px-5 py-12">
      <button onClick={onBack} className="mb-6 text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 text-sm mb-8">Last updated: 20 March 2026</p>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-700 text-[15px] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">1. Data Controller</h2>
          <p>Tutagora Ltd ("Tutagora", "we", "us") is the data controller responsible for your personal data. We are registered in Kenya and operate the platform at tutagora.com.</p>
          <p><strong>Contact:</strong> tutaeducators@gmail.com | +254 759 240 692 | Nairobi, Kenya</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">2. Data We Collect</h2>
          <p><strong>For all users:</strong> Full name, email address, password (stored securely hashed), profile photo, and role (student or tutor).</p>
          <p><strong>For students:</strong> Booking history, payment records, chat messages with tutors, AI learning progress (XP, streaks, practice data), and tutor reviews.</p>
          <p><strong>For tutors:</strong> Phone number, bio, qualifications, subjects taught, hourly rate, availability schedule, national ID document (for identity verification), teaching certificates, earnings data, and verification status.</p>
          <p><strong>Automatically collected:</strong> We do not use cookies for tracking. Basic usage data may be collected by our hosting provider.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">3. How We Use Your Data</h2>
          <p>We process your personal data for the following purposes: providing the tutoring platform and matching students with tutors; processing payments for lesson bookings; verifying tutor identity and qualifications (KYC); sending booking confirmations and platform notifications; improving the platform experience; and complying with legal obligations.</p>
          <p>The legal basis for processing is: your consent (for account creation and sensitive data like ID documents), performance of a contract (for lesson bookings and payments), and legitimate interests (for platform security and improvement).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">4. Third-Party Data Sharing</h2>
          <p>We share personal data with the following third-party service providers who process data on our behalf:</p>
          <p><strong>Supabase</strong> (database and authentication) - stores all user data. <strong>Paystack</strong> (payment processing, Nigeria/Global) - receives email and payment amounts for card transactions. <strong>Resend</strong> (email delivery, US) - receives names and email addresses for booking confirmations. <strong>Agora</strong> (video calls, Global) - processes audio/video streams during live lessons.</p>
          <p>We do not sell your personal data to any third party.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">5. Cross-Border Data Transfers</h2>
          <p>Some of our service providers process data outside Kenya. Where data is transferred outside Kenya, we ensure appropriate safeguards are in place in accordance with the Kenya Data Protection Act, 2019. By using Tutagora, you consent to the transfer of your data to these providers for the purposes described above.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">6. Data Retention</h2>
          <p>We retain your personal data for as long as your account is active. If you delete your account, we will erase your personal data within 30 days, except where we are required to retain it by law (e.g., payment records for tax purposes, which are kept for 7 years). Tutor verification documents are deleted within 30 days of account deletion or verification rejection.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">7. Your Rights</h2>
          <p>Under the Kenya Data Protection Act, 2019 (Part IV), you have the right to: access your personal data; rectify inaccurate data; request erasure of your data (right to be forgotten); request a portable copy of your data; object to processing of your data; and withdraw consent at any time.</p>
          <p>To exercise any of these rights, email us at <strong>levitty@tutagora.com</strong> or use the account settings in your dashboard. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">8. Data Security</h2>
          <p>We implement technical and organizational measures to protect your data, including: password hashing, row-level database security restricting access to your own data, private storage with signed URLs for sensitive documents, and contact information filtering in messages to prevent data leaks.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">9. Children's Data</h2>
          <p>Tutagora is intended for users aged 13 and above. Students under 18 should have parental consent before creating an account. We do not knowingly collect data from children under 13.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">10. Complaints</h2>
          <p>If you believe your data protection rights have been violated, you may lodge a complaint with the Office of the Data Protection Commissioner (ODPC) at <strong>complaints@odpc.go.ke</strong> or visit <strong>odpc.go.ke</strong>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">11. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of significant changes by email or a prominent notice on the platform. Continued use after changes constitutes acceptance.</p>
        </section>
      </div>
    </div>
  </div>
);

// ============ COOKIE / PRIVACY BANNER ============
const PrivacyBanner = ({ onAccept, onNavigate }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-40 shadow-lg">
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <p className="text-sm text-slate-300 flex-1">
        We use essential data to provide our tutoring service. By continuing, you agree to our{' '}
        <button onClick={() => onNavigate('privacy')} className="text-emerald-400 underline hover:text-emerald-300">Privacy Policy</button>{' '}
        in accordance with Kenya's Data Protection Act, 2019.
      </p>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={onAccept} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">
          Accept
        </button>
      </div>
    </div>
  </div>
);

// ============ ACCOUNT SETTINGS / DATA RIGHTS ============
const AccountSettings = ({ profile, user, onClose, onLogout }) => {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleExportData = async () => {
    setExporting(true);
    setMessage('');
    try {
      // Gather all user data from Supabase
      const [profileRes, bookingsRes, paymentsRes, messagesRes, reviewsRes, progressRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id),
        supabase.from('bookings').select('*').or(`student_id.eq.${user.id},tutor_id.eq.${user.id}`),
        supabase.from('payments').select('*').or(`student_id.eq.${user.id},tutor_id.eq.${user.id}`),
        supabase.from('messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
        supabase.from('reviews').select('*').or(`student_id.eq.${user.id},tutor_id.eq.${user.id}`),
        supabase.from('ai_tutor_progress').select('*').eq('user_id', user.id),
      ]);

      let tutorData = null;
      if (profile?.role === 'tutor') {
        const tutorRes = await supabase.from('tutors').select('*').eq('user_id', user.id);
        tutorData = tutorRes.data;
      }

      const exportData = {
        exported_at: new Date().toISOString(),
        platform: 'Tutagora',
        data_subject: profile?.full_name || user.email,
        profile: profileRes.data,
        tutor_profile: tutorData,
        bookings: bookingsRes.data,
        payments: paymentsRes.data,
        messages: messagesRes.data,
        reviews: reviewsRes.data,
        ai_progress: progressRes.data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tutagora-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Your data has been downloaded.');
    } catch (err) {
      setMessage('Error exporting data. Please try again or contact levitty@tutagora.com');
    }
    setExporting(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    setMessage('');
    try {
      // Delete user data from tables
      await Promise.all([
        supabase.from('messages').delete().or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
        supabase.from('reviews').delete().or(`student_id.eq.${user.id},tutor_id.eq.${user.id}`),
        supabase.from('ai_tutor_progress').delete().eq('user_id', user.id),
      ]);

      // Delete tutor-specific data
      if (profile?.role === 'tutor') {
        // Delete storage files
        const { data: files } = await supabase.storage.from('tutor-documents').list(user.id);
        if (files?.length) {
          await supabase.storage.from('tutor-documents').remove(files.map(f => `${user.id}/${f.name}`));
        }
        // tutors.id is the row's own UUID (not the auth user id); availability
        // references that. Look it up by user_id, then delete by the real id.
        const { data: tutorRow } = await supabase.from('tutors').select('id').eq('user_id', user.id).maybeSingle();
        if (tutorRow?.id) {
          await supabase.from('availability').delete().eq('tutor_id', tutorRow.id);
        }
        await supabase.from('tutors').delete().eq('user_id', user.id);
      }

      // Delete avatar
      const { data: avatarFiles } = await supabase.storage.from('avatars').list(user.id);
      if (avatarFiles?.length) {
        await supabase.storage.from('avatars').remove(avatarFiles.map(f => `${user.id}/${f.name}`));
      }

      // Mark profile as deleted (keep shell for referential integrity, but clear PII)
      await supabase.from('profiles').update({
        full_name: 'Deleted User',
        avatar_url: null,
        email: null,
      }).eq('id', user.id);

      // Sign out
      await supabase.auth.signOut();
      onLogout();
      alert('Your account has been deleted. Some anonymized records may be retained for legal compliance.');
    } catch (err) {
      setMessage('Error deleting account. Please contact levitty@tutagora.com for assistance.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Account & Data Settings</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {message && <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-xl">{message}</div>}

          {/* Data Export */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Export Your Data</h3>
            <p className="text-sm text-slate-500 mb-3">Download a copy of all your personal data stored on Tutagora. This includes your profile, bookings, payments, messages, and learning progress.</p>
            <button onClick={handleExportData} disabled={exporting}
              className="px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors">
              {exporting ? 'Preparing download...' : 'Download My Data (JSON)'}
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Delete Account */}
          <div>
            <h3 className="font-semibold text-red-600 mb-2">Delete Account</h3>
            <p className="text-sm text-slate-500 mb-3">Permanently delete your account and all associated personal data. This action cannot be undone. Some anonymized transaction records may be retained for legal compliance (up to 7 years for payment records as required by Kenya tax law).</p>
            <div className="bg-red-50 p-4 rounded-xl space-y-3">
              <p className="text-sm text-red-700">Type <strong>DELETE</strong> to confirm:</p>
              <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="Type DELETE"
                className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              <button onClick={handleDeleteAccount} disabled={deleting || deleteConfirm !== 'DELETE'}
                className="px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {deleting ? 'Deleting...' : 'Permanently Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <Lottie src={ANIMATIONS.books} width={100} height={100} />
  </div>
);

// ============ AUTH CONTEXT ============
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Check if there's a pending role from Google OAuth signup
        const pendingRole = localStorage.getItem('tutagora_pending_role');
        const pendingName = localStorage.getItem('tutagora_pending_name');
        if (pendingRole && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          // Update the profile with the selected role
          const updateData = { role: pendingRole };
          if (pendingName) updateData.full_name = pendingName;
          await supabase.from('profiles').update(updateData).eq('id', session.user.id);
          localStorage.removeItem('tutagora_pending_role');
          localStorage.removeItem('tutagora_pending_name');
        }
        fetchProfile(session.user.id);
      }
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    // First get the profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      setLoading(false);
      return;
    }

    // Then get the tutor data if this is a tutor
    if (profileData?.role === 'tutor') {
      const { data: tutorData } = await supabase
        .from('tutors')
        .select('*')
        .eq('user_id', userId);
      
      profileData.tutors = tutorData || [];
    }
    
    setProfile(profileData);
    setLoading(false);
  };

  const signUp = async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } }
    });
    if (error) throw error;
    // Send welcome email
    sendEmail('welcome', email, { name: fullName }).catch(() => {});
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://tutagora.com/dashboard' }
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://tutagora.com/dashboard'
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, signUp, signIn, signInWithGoogle, resetPassword, signOut, refetchProfile: () => user && fetchProfile(user.id) };
};

// ============ DATABASE HOOKS ============
const useTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    const { data, error } = await supabase
      .from('tutors')
      .select(`*, profiles(full_name, avatar_url, email), availability(*)`)
      .eq('verification_status', 'approved')
      .order('rating', { ascending: false });

    if (error) console.error('Error fetching tutors:', error);
    if (data) setTutors(data);
    setLoading(false);
  };

  return { tutors, loading, refetch: fetchTutors };
};

const useBookings = (userId, role, tutorId = null) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId, tutorId]);

  // Real-time subscription for new/updated bookings
  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel('bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, tutorId]);

  const fetchBookings = async () => {
    let query = supabase
      .from('bookings')
      .select(`*, tutors(*, profiles(full_name, avatar_url, email)), profiles!bookings_student_id_fkey(full_name, avatar_url, email)`)
      .order('lesson_date', { ascending: true });
    
    if (role === 'tutor' && tutorId) {
      // Use the tutor ID directly if available
      query = query.eq('tutor_id', tutorId);
    } else if (role === 'tutor') {
      // Fallback: look up tutor ID from user ID
      const { data: tutorData } = await supabase.from('tutors').select('id').eq('user_id', userId).single();
      if (tutorData) {
        query = query.eq('tutor_id', tutorData.id);
      } else {
        setBookings([]);
        setLoading(false);
        return;
      }
    } else {
      query = query.eq('student_id', userId);
    }

    const { data, error } = await query;
    if (error) console.error('Error fetching bookings:', error);
    if (data) setBookings(data);
    setLoading(false);
  };

  const createBooking = async (tutorId, subject, date, time) => {
    // First create the booking
    const { data, error } = await supabase.from('bookings').insert({
      student_id: userId,
      tutor_id: tutorId,
      subject,
      lesson_date: date,
      start_time: time,
      status: 'pending'
    }).select(`*, tutors(*, profiles(full_name, email)), profiles!bookings_student_id_fkey(full_name, email)`).single();

    if (error) throw error;

    // Send in-app message to tutor (emails sent after payment in PaymentModal)
    if (data) {
      await sendBookingNotifications(data, userId);
    }

    fetchBookings();
    return data;
  };

  return { bookings, loading, createBooking, refetch: fetchBookings };
};

// ============ BOOKING NOTIFICATIONS ============
const sendBookingNotifications = async (booking, studentId) => {
  try {
    const tutorUserId = booking.tutors?.user_id;
    const tutorName = booking.tutors?.profiles?.full_name || 'Tutor';
    const tutorEmail = booking.tutors?.profiles?.email;
    const studentName = booking.profiles?.full_name || 'Student';
    const studentEmail = booking.profiles?.email;
    const lessonDate = booking.lesson_date;
    const lessonTime = booking.start_time?.slice(0, 5);
    const subject = booking.subject;
    const lessonDateFormatted = new Date(lessonDate).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Send in-app message to tutor (emails are sent after payment confirmation in PaymentModal)
    if (tutorUserId) {
      await supabase.from('messages').insert({
        sender_id: studentId,
        receiver_id: tutorUserId,
        content: `New Booking\n\nHi ${tutorName.split(' ')[0]}, I've booked a ${subject} lesson with you on ${lessonDate} at ${lessonTime}.\n\nLooking forward to our session!\n\n- ${studentName}`
      });
    }

    console.log('Booking in-app notification sent successfully');
  } catch (err) {
    console.error('Error sending booking notifications:', err);
  }
};

// ============ LESSON START NOTIFICATION ============
const sendLessonStartNotification = async (booking) => {
  try {
    const studentId = booking.student_id;
    const studentEmail = booking.profiles?.email;
    const studentName = booking.profiles?.full_name || 'Student';
    const tutorName = booking.tutors?.profiles?.full_name || 'Tutor';
    const subject = booking.subject || 'Lesson';
    const tutorUserId = booking.tutors?.user_id || booking.tutor_id;

    // 1. Send in-app message to student
    if (studentId && tutorUserId) {
      await supabase.from('messages').insert({
        sender_id: tutorUserId,
        receiver_id: studentId,
        content: `Your ${subject} lesson is starting now! Click "Join Lesson" in your dashboard to connect.\n\n- ${tutorName}`
      });
    }

    // 2. Send email notification to student
    if (studentEmail) {
      await sendEmail('lesson-reminder', studentEmail, {
        participantName: studentName,
        otherName: tutorName,
        subject,
        time: 'now',
        participantType: 'student'
      });
    }

    console.log('Lesson start notification sent to student');
  } catch (err) {
    console.error('Error sending lesson start notification:', err);
  }
};

// ============ AUTH MODAL ============
const AuthModal = ({ mode, setMode, onClose, onAuth, initialRole }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: initialRole || 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [view, setView] = useState(mode); // 'login', 'register', 'forgot'

  // Sync view with mode prop
  React.useEffect(() => { setView(mode); setError(''); setSuccess(''); }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (view === 'register') {
        await onAuth.signUp(form.email, form.password, form.name, form.role);
        setSuccess('Account created! Check your email for a confirmation link.');
      } else if (view === 'forgot') {
        await onAuth.resetPassword(form.email);
        setSuccess('Password reset link sent! Check your email.');
      } else {
        await onAuth.signIn(form.email, form.password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    // If registering, require role selection first
    if (view === 'register' && !form.role) {
      setError('Please select whether you are a Student or Tutor before continuing.');
      return;
    }
    setLoading(true);
    try {
      // Store the selected role before OAuth redirect so we can apply it after
      if (view === 'register' && form.role) {
        localStorage.setItem('tutagora_pending_role', form.role);
        localStorage.setItem('tutagora_pending_name', form.name || '');
      }
      await onAuth.signInWithGoogle();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors" aria-label="Close">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">T</div>
          <h2 className="text-2xl font-bold text-slate-900">
            {view === 'forgot' ? 'Reset password' : view === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {view === 'forgot' ? "We'll send you a reset link" : view === 'login' ? 'Sign in to your account' : 'Join Tutagora today'}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
        {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100">{success}</div>}

        {/* Role selection for register view - shown above Google button */}
        {view === 'register' && (
          <div className="space-y-3 mb-4">
            <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm({ ...form, role: 'student' })} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${form.role === 'student' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                I'm a Student
              </button>
              <button type="button" onClick={() => setForm({ ...form, role: 'tutor' })} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${form.role === 'tutor' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                I'm a Tutor
              </button>
            </div>
          </div>
        )}

        {/* Google Sign In Button */}
        {view !== 'forgot' && (
          <>
            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors mb-4 disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-sm font-medium text-slate-700">{view === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
            </button>
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400 uppercase">or</span></div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Email address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          {view !== 'forgot' && (
            <input type="password" placeholder="Password (min 6 characters)" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          )}
          {view === 'register' && (
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <span className="text-xs text-slate-500">I agree to Tutagora's <button type="button" onClick={() => window.open('/privacy', '_blank')} className="text-emerald-600 underline">Privacy Policy</button> and consent to the collection and processing of my personal data as described therein, in accordance with Kenya's Data Protection Act, 2019.</span>
            </label>
          )}
          {view === 'login' && (
            <div className="text-right">
              <button type="button" onClick={() => { setView('forgot'); setError(''); setSuccess(''); }} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                Forgot password?
              </button>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 text-sm">
            {loading ? 'Please wait...' : view === 'forgot' ? 'Send Reset Link' : view === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-5 text-sm text-slate-500">
          {view === 'forgot' ? (
            <button onClick={() => { setView('login'); setError(''); setSuccess(''); }} className="text-emerald-600 font-semibold">Back to sign in</button>
          ) : view === 'login' ? (
            <>No account? <button onClick={() => { setView('register'); setMode('register'); setError(''); }} className="text-emerald-600 font-semibold">Sign up</button></>
          ) : (
            <>Have an account? <button onClick={() => { setView('login'); setMode('login'); setError(''); }} className="text-emerald-600 font-semibold">Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
};

// ============ STUDENT DASHBOARD ============
// Compact "momentum" chip — surfaces the learner's level + streak in headers,
// nudging them back into the tutor. Self-contained background so it reads on
// both the light dashboard header and the transparent marketing nav.
const MomentumChipView = ({ level, streak, onClick }) => (
  <button onClick={onClick} title="Open AI Tutor" className="flex items-center gap-1.5 bg-white/90 border border-slate-200 shadow-sm rounded-full pl-2 pr-2.5 py-1 hover:bg-white transition-colors">
    <span className="text-base leading-none">🧠</span>
    <span className="text-xs font-semibold text-slate-700">Lv {level}</span>
    {streak > 0 && <span className="text-xs font-semibold text-orange-500 flex items-center">🔥{streak}</span>}
  </button>
);

const MomentumChip = ({ userId, onClick }) => {
  const [m, setM] = useState(null);
  useEffect(() => {
    if (!userId) return;
    supabase.from('ai_tutor_progress').select('total_xp, current_streak, diagnosed').eq('user_id', userId).maybeSingle()
      .then(({ data }) => { if (data?.diagnosed) setM({ level: getLevel(data.total_xp || 0).level, streak: data.current_streak || 0 }); });
  }, [userId]);
  if (!m) return null;
  return <MomentumChipView level={m.level} streak={m.streak} onClick={onClick} />;
};

const StudentDashboard = ({ profile, bookings, bookingsLoading, onNavigate, onLogout, onStartLesson, onOpenMessages, onRefreshProfile, isAdmin, onOpenAccountSettings }) => {
  const [tab, setTab] = useState('upcoming');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [payments, setPayments] = useState([]);
  const [aiProgress, setAiProgress] = useState(null);
  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const past = bookings.filter(b => b.status === 'completed');
  const nextLesson = [...upcoming].sort((a, b) => `${a.lesson_date}${a.start_time}`.localeCompare(`${b.lesson_date}${b.start_time}`))[0];
  const totalSpent = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const uniqueTutors = [...new Set(past.map(b => b.tutor_id))].length;

  useEffect(() => {
    if (profile?.id) {
      supabase.from('payments').select('amount, status, created_at').eq('student_id', profile.id).eq('status', 'completed')
        .then(({ data }) => setPayments(data || []));
      supabase.from('ai_tutor_progress').select('total_xp, current_streak, diagnosed, progress').eq('user_id', profile.id).maybeSingle()
        .then(({ data }) => {
          if (data) setAiProgress({
            totalXP: data.total_xp || 0,
            currentStreak: data.current_streak || 0,
            diagnosed: !!data.diagnosed,
            dailyXP: data.progress?.dailyXP || 0,
            dailyDate: data.progress?.dailyDate || null,
          });
        });
    }
  }, [profile?.id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">T</div>
            <span className="font-semibold text-slate-900 hidden sm:block">Tutagora</span>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">Student</span>
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => onNavigate('tutors')} className="text-sm text-slate-600 hidden sm:block">Find Tutors</button>
            <button onClick={() => onNavigate('clubs')} className="text-sm text-slate-600 hidden sm:block">Clubs</button>
            <button onClick={() => onNavigate('schools')} className="text-sm text-slate-600 hidden sm:block">For Schools</button>
            {aiProgress?.diagnosed
              ? <MomentumChipView level={getLevel(aiProgress.totalXP).level} streak={aiProgress.currentStreak} onClick={() => onNavigate('ai')} />
              : <button onClick={() => onNavigate('ai')} className="text-sm text-emerald-600 font-medium">AI Tutor</button>}
            <button onClick={() => onNavigate('spreadsheet')} className="text-sm text-blue-600 font-medium">Spreadsheet</button>
            {isAdmin && <button onClick={() => onNavigate('admin')} className="text-sm text-purple-600 font-medium">Admin</button>}
            <MessageButton onClick={onOpenMessages} />
            <div className="flex items-center gap-2">
              <Avatar src={profile?.avatar_url} name={profile?.full_name} size={32} />
              <span className="text-sm font-medium hidden sm:block">{profile?.full_name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6">
        {/* Welcome + Next Lesson spotlight */}
        {nextLesson ? (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 mb-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Lottie src={ANIMATIONS.waving} width={60} height={60} />
              <div>
                <h1 className="text-xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
                <p className="text-emerald-100 text-sm">{upcoming.length} upcoming lesson{upcoming.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">{nextLesson.subject?.[0]}</div>
                <div>
                  <div className="font-semibold">{nextLesson.subject}</div>
                  <div className="text-emerald-100 text-sm">with {nextLesson.tutors?.profiles?.full_name} · {nextLesson.lesson_date} at {nextLesson.start_time?.slice(0,5)}</div>
                </div>
              </div>
              {nextLesson.status === 'confirmed' && (
                <button onClick={() => onStartLesson(nextLesson)} className="px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm">
                  Join Lesson
                </button>
              )}
              {nextLesson.status === 'pending' && (
                <span className="px-3 py-1.5 bg-white/20 text-white text-xs font-medium rounded-full">Pending</span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 mb-6 flex items-center gap-4 text-white">
            <Lottie src={ANIMATIONS.waving} width={60} height={60} />
            <div className="flex-1">
              <h1 className="text-xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
              <p className="text-emerald-100 text-sm">No upcoming lessons — ready to book one?</p>
            </div>
            <button onClick={() => onNavigate('tutors')} className="px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm">
              Find a Tutor
            </button>
          </div>
        )}

        {/* AI Tutor Card — momentum-aware, encouraging entry point */}
        {(() => {
          const started = aiProgress && aiProgress.diagnosed;
          const lvl = started ? getLevel(aiProgress.totalXP).level : 0;
          const lvlInfo = started ? getLevel(aiProgress.totalXP) : null;
          const streak = aiProgress?.currentStreak || 0;
          const goalPct = started ? dailyGoalPercent(aiProgress) : 0;
          const goalMet = started ? dailyGoalMet(aiProgress) : false;
          const cta = !started ? 'Start Learning' : goalMet ? 'Keep Going' : 'Continue';
          const headline = !started
            ? 'Adaptive learning that finds your gaps and fills them'
            : goalMet ? 'Daily goal done — brilliant! A little more never hurts.'
            : streak > 0 ? `You’re on a ${streak}-day streak — keep it alive!`
            : 'Pick up where you left off — small steps add up.';
          return (
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="text-3xl sm:text-4xl">🧠</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-lg">AI Math Tutor</h3>
                      {started && <span className="text-xs font-semibold text-amber-300 bg-amber-500/15 rounded-full px-2 py-0.5">Level {lvl}</span>}
                      {streak > 0 && <span className="text-xs font-semibold text-orange-300 flex items-center gap-0.5">🔥 {streak}d</span>}
                    </div>
                    <p className="text-slate-300 text-sm mt-0.5">{headline}</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('ai')} className="shrink-0 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors text-sm">
                  {cta}
                </button>
              </div>
              {started && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-slate-400 shrink-0">{goalMet ? '☀️ Goal' : '🎯 Today'}</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${goalMet ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${goalPct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{Math.min(todaysXP(aiProgress), DAILY_GOAL_XP)}/{DAILY_GOAL_XP} XP</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="text-2xl font-bold text-slate-900">{past.length}</div>
            <div className="text-xs text-slate-500">Lessons Done</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div className="text-2xl font-bold text-slate-900">{upcoming.length}</div>
            <div className="text-xs text-slate-500">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div className="text-2xl font-bold text-slate-900">{uniqueTutors}</div>
            <div className="text-xs text-slate-500">Tutors Used</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="text-2xl font-bold text-slate-900">KSh {totalSpent.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Total Spent</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button onClick={() => setTab('upcoming')} className={`flex-1 py-3 text-sm font-medium ${tab === 'upcoming' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500'}`}>Upcoming ({upcoming.length})</button>
              <button onClick={() => setTab('history')} className={`flex-1 py-3 text-sm font-medium ${tab === 'history' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500'}`}>History ({past.length})</button>
            </div>

            {bookingsLoading ? <LoadingSpinner /> : (
              tab === 'upcoming' ? (
                upcoming.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-2">
                      <Lottie src={ANIMATIONS.empty} width={150} height={150} />
                    </div>
                    <p className="text-slate-600 font-medium">No upcoming lessons</p>
                    <p className="text-sm text-slate-400 mt-1">Book a lesson to get started</p>
                    <button onClick={() => onNavigate('tutors')} className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">Find a Tutor</button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {upcoming.map(b => (
                      <div key={b.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar src={b.tutors?.profiles?.avatar_url} name={b.tutors?.profiles?.full_name} size={44} />
                          <div>
                            <div className="font-medium text-slate-900">{b.subject}</div>
                            <div className="text-sm text-slate-500">{b.tutors?.profiles?.full_name} · {b.lesson_date} at {b.start_time?.slice(0,5)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{b.status}</span>
                          {b.status === 'confirmed' && (
                            <button onClick={() => onStartLesson(b)} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                              Join
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                past.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">No completed lessons yet</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {past.map(b => (
                      <div key={b.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={b.tutors?.profiles?.avatar_url} name={b.tutors?.profiles?.full_name} size={44} />
                          <div>
                            <div className="font-medium">{b.subject}</div>
                            <div className="text-sm text-slate-500">{b.tutors?.profiles?.full_name} • {b.lesson_date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {b.review ? (
                            <div className="flex items-center gap-1">
                              <Stars rating={b.review.rating} size={12} />
                              <span className="text-xs text-slate-500">Reviewed</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReviewBooking(b)}
                              className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )
            )}
          </div>

          <div className="space-y-4">
            {/* Referral Card */}
            <div className="bg-slate-900 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <h3 className="font-semibold">Refer & Earn</h3>
              </div>
              <p className="text-slate-300 text-sm mb-3">Get KSh 500 for each friend who books their first lesson</p>
              <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                <input
                  type="text"
                  value={`tutagora.com/r/${profile?.id?.slice(0,8) || 'invite'}`}
                  readOnly
                  className="flex-1 bg-transparent text-white text-xs outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://tutagora.com/r/${profile?.id?.slice(0,8) || 'invite'}`);
                    alert('Referral link copied!');
                  }}
                  className="px-3 py-1 bg-white text-slate-900 text-xs font-medium rounded"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Account</h3>
              <div className="space-y-1">
                <button onClick={() => setShowEditProfile(true)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Edit Profile
                </button>
                <button onClick={() => setShowProgress(true)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  My Progress
                </button>
                {onOpenAccountSettings && <button onClick={onOpenAccountSettings} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573-1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Account & Data
                </button>}
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <StudentProfileEditor
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSave={() => { setShowEditProfile(false); onRefreshProfile && onRefreshProfile(); }}
        />
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          profile={profile}
          onClose={() => setReviewBooking(null)}
          onSubmit={() => { setReviewBooking(null); }}
        />
      )}

      {/* Progress Modal */}
      {showProgress && (
        <StudentProgressModal
          profile={profile}
          bookings={bookings}
          onClose={() => setShowProgress(false)}
        />
      )}
    </div>
  );
};

// ============ STUDENT PROGRESS MODAL ============
const StudentProgressModal = ({ profile, bookings, onClose }) => {
  const completed = bookings.filter(b => b.status === 'completed');
  const totalHours = completed.length;
  const subjectCounts = {};
  
  completed.forEach(b => {
    subjectCounts[b.subject] = (subjectCounts[b.subject] || 0) + 1;
  });

  const subjects = Object.entries(subjectCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const streakDays = 7;
  const level = Math.floor(totalHours / 5) + 1;
  const progressToNextLevel = (totalHours % 5) * 20;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Your Progress</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Level with Trophy */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Lottie src={ANIMATIONS.trophy} width={100} height={100} />
            </div>
            <p className="font-bold text-xl text-slate-900">Level {level}</p>
            <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden max-w-[200px] mx-auto">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${progressToNextLevel}%` }} />
            </div>
            <p className="text-sm text-slate-500 mt-2">{5 - (totalHours % 5)} lessons to next level</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{totalHours}</div>
              <div className="text-xs text-slate-500">Hours</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{Object.keys(subjectCounts).length}</div>
              <div className="text-xs text-slate-500">Subjects</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{streakDays}</div>
              <div className="text-xs text-slate-500">Day Streak</div>
            </div>
          </div>

          {/* Top Subjects */}
          {subjects.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Top Subjects</h4>
              <div className="space-y-3">
                {subjects.map(([subject, count], i) => (
                  <div key={subject} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-900">{subject}</span>
                        <span className="text-slate-500">{count} lessons</span>
                      </div>
                      <div className="mt-1.5 bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div className="bg-slate-900 h-full" style={{ width: `${(count / subjects[0][1]) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {totalHours >= 1 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Milestones</h4>
              <div className="flex gap-2 flex-wrap">
                {totalHours >= 1 && <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">First Lesson</span>}
                {totalHours >= 5 && <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">5 Hours</span>}
                {totalHours >= 10 && <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">10 Hours</span>}
                {Object.keys(subjectCounts).length >= 3 && <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">Multi-subject</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ REVIEW MODAL ============
const ReviewModal = ({ booking, profile, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating < 1) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          booking_id: booking.id,
          student_id: profile.id,
          tutor_id: booking.tutor_id,
          rating: rating,
          text: text.trim() || null,
        });

      if (insertError) throw insertError;
      onSubmit();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Rate your lesson</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-6">
          <Avatar src={booking.tutors?.profiles?.avatar_url} name={booking.tutors?.profiles?.full_name} size={48} />
          <div>
            <div className="font-medium">{booking.tutors?.profiles?.full_name}</div>
            <div className="text-sm text-slate-500">{booking.subject} • {booking.lesson_date}</div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3 text-center">How was your lesson?</label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <svg 
                  width={36} 
                  height={36} 
                  viewBox="0 0 20 20" 
                  fill={star <= rating ? '#f59e0b' : '#e2e8f0'}
                  className="transition-colors"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-2">
            {rating === 5 && 'Excellent!'}
            {rating === 4 && 'Very Good'}
            {rating === 3 && 'Good'}
            {rating === 2 && 'Fair'}
            {rating === 1 && 'Poor'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Share your experience (optional)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you like about the lesson? How was the tutor's teaching style?"
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ STUDENT PROFILE EDITOR ============
const StudentProfileEditor = ({ profile, onClose, onSave }) => {
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          avatar_url: form.avatar_url,
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={form.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.full_name || 'U')}&background=10b981&color=fff`}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button type="button" className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">
                📷
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+254 712 345 678"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
            <input
              type="url"
              value={form.avatar_url}
              onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ TUTOR ONBOARDING ============
const TutorOnboarding = ({ profile, onComplete }) => {
  const [step, setStep] = useState(1); // 1 = photo & basics, 2 = bio & details, 3 = document upload, 4 = terms
  const [form, setForm] = useState({
    subjects: [],
    headline: '',
    bio: '',
    hourly_rate: 1000,
    degree: '',
    experience_years: '',
    teaching_style: '',
    languages: 'English, Kiswahili',
    grade_levels: [],
    phone_number: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.avatar_url || null);
  const [idFile, setIdFile] = useState(null);
  const [credentialFile, setCredentialFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file, folder) => {
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/${folder}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('tutor-documents').upload(path, file);
    if (error) throw new Error(`Upload failed: ${error.message}`);
    // Store the path, not a public URL — documents are private and accessed via signed URLs
    return path;
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!form.subjects || form.subjects.length === 0) { setError('Please select at least one subject'); return; }
    if (!form.phone_number || !/^(\+254|07|01)\d{8,9}$/.test(form.phone_number.replace(/\s/g, ''))) { setError('Please enter a valid Kenyan phone number (e.g. 0712345678 or +254712345678)'); return; }
    setError('');
    setStep(2);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (!form.bio || form.bio.length < 100) { setError('Please write at least 100 characters about yourself — parents want to know who you are!'); return; }
    setError('');
    setStep(3);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    if (!idFile) { setError('Please upload your national ID'); return; }
    if (!credentialFile) { setError('Please upload your teaching certificate'); return; }
    setError('');
    setStep(4);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) { setError('You must agree to the Terms of Engagement to continue'); return; }
    // Final safety check — all required fields must be present
    if (!form.subjects?.length) { setError('Please select at least one subject'); return; }
    if (!form.phone_number) { setError('Phone number is required'); return; }
    if (!form.bio || form.bio.length < 100) { setError('A bio of at least 100 characters is required'); return; }
    if (!idFile) { setError('National ID document is required'); return; }
    if (!credentialFile) { setError('Teaching certificate is required'); return; }

    setSaving(true);
    setError('');

    try {
      // Upload photo if provided
      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const photoPath = `${profile.id}/avatar-${Date.now()}.${ext}`;
        await supabase.storage.from('avatars').upload(photoPath, photoFile, { upsert: true });
        const { data: photoUrl } = supabase.storage.from('avatars').getPublicUrl(photoPath);
        await supabase.from('profiles').update({ avatar_url: photoUrl.publicUrl }).eq('id', profile.id);
      }

      const idUrl = await uploadFile(idFile, 'national-id');
      const credUrl = await uploadFile(credentialFile, 'credential');

      const { data: existingTutor } = await supabase
        .from('tutors').select('id').eq('user_id', profile.id).single();

      const tutorPayload = {
        subject: form.subjects[0] || '',
        subjects: form.subjects,
        headline: form.headline,
        bio: form.bio,
        hourly_rate: form.hourly_rate,
        degree: form.degree,
        experience_years: form.experience_years ? parseInt(form.experience_years) : null,
        teaching_style: form.teaching_style,
        languages: form.languages ? form.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
        grade_levels: form.grade_levels,
        phone_number: form.phone_number,
        verified: false,
        verification_status: 'pending',
        id_document_url: idUrl,
        credential_url: credUrl,
      };

      let tutorData;
      if (existingTutor) {
        const { data, error: e } = await supabase.from('tutors').update(tutorPayload)
          .eq('user_id', profile.id).select().single();
        if (e) throw e;
        tutorData = data;
      } else {
        const { data, error: e } = await supabase.from('tutors')
          .insert({ user_id: profile.id, ...tutorPayload }).select().single();
        if (e) throw e;
        tutorData = data;
      }

      const { data: existingAvail } = await supabase
        .from('availability').select('id').eq('tutor_id', tutorData.id).limit(1);
      if (!existingAvail || existingAvail.length === 0) {
        await supabase.from('availability').insert(
          [1, 2, 3, 4, 5].map(day => ({ tutor_id: tutorData.id, day_of_week: day, start_time: '09:00', end_time: '17:00' }))
        );
      }

      // Send "under review" email
      try {
        await sendEmail('tutor-under-review', profile.email, { name: profile.full_name });
      } catch (emailErr) {
        console.error('Failed to send under-review email:', emailErr);
      }

      // Show a clear confirmation screen rather than hard-swapping straight
      // into the dashboard while the profile is still refetching.
      setSubmitted(true);
    } catch (err) {
      console.error('Error creating tutor profile:', err);
      setError(err.message || 'Failed to create profile');
    }
    setSaving(false);
  };

  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'];
  const gradeOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'University'];

  const FileUpload = ({ label, hint, file, onFile }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label} *</label>
      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
        {file ? (
          <div className="flex items-center gap-3 px-4">
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-sm text-slate-700 truncate max-w-[200px]">{file.name}</span>
            <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
          </div>
        ) : (
          <div className="text-center">
            <svg className="w-7 h-7 text-slate-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <span className="text-sm text-slate-500">Click to upload</span>
            <span className="text-xs text-slate-400 block mt-0.5">{hint}</span>
          </div>
        )}
        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => onFile(e.target.files[0])} />
      </label>
    </div>
  );

  const stepLabels = ['Your Info', 'About You', 'Documents', 'Terms'];

  // Confirmation screen after a successful submission.
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-emerald-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-9 h-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Documents submitted!</h1>
          <p className="text-slate-500 mt-2">
            Thanks, {profile?.full_name?.split(' ')[0]}. Your profile and documents are now with our team for review — this usually takes less than 24 hours. We've emailed you a confirmation.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-5 text-left">
            <p className="text-sm text-amber-700"><strong>What happens next?</strong> Once you're approved, your profile goes live in Find Tutors and you can start receiving bookings and creating group classes.</p>
          </div>
          <button onClick={() => onComplete()} className="w-full mt-6 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
            Go to my dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {profile?.full_name?.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-1">
            {step === 1 ? "Let's set up your tutor profile" : step === 2 ? "Tell parents about yourself" : step === 3 ? "Upload your verification documents" : "Review and agree to our terms"}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${step >= i + 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= i + 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>{step > i + 1 ? '✓' : i + 1}</span>
                  {label}
                </div>
                {i < 3 && <div className={`w-4 h-0.5 ${step > i + 1 ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

        {/* Step 1: Photo & basics */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            {/* Photo upload */}
            <div className="flex flex-col items-center mb-2">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-emerald-200 transition-colors">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white group-hover:bg-emerald-600 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoSelect} />
              </label>
              <p className="text-xs text-slate-400 mt-2">Add a photo — profiles with photos get 3x more bookings</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What subjects do you teach? *</label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl min-h-[48px]">
                {subjects.map(s => (
                  <button key={s} type="button" onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      subjects: prev.subjects.includes(s) ? prev.subjects.filter(x => x !== s) : [...prev.subjects, s]
                    }));
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    form.subjects.includes(s) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">{form.subjects.length} selected — tap to add or remove</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
              <input type="tel" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                placeholder="e.g. 0712345678 or +254712345678"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              <p className="text-xs text-slate-400 mt-1">For admin contact only — not shown to students</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Headline *</label>
              <input type="text" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Making calculus intuitive and fun"
                maxLength={80}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              <p className="text-xs text-slate-400 mt-1">{form.headline.length}/80 — this is the first thing parents see</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your qualification *</label>
              <input type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="e.g. BSc Mathematics, University of Nairobi"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (KSh)</label>
                <input type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: parseInt(e.target.value) || 1000 })}
                  min="500" max="10000"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years of experience</label>
                <input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                  placeholder="e.g. 5" min="0" max="50"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
              Next: Tell Parents About You
            </button>
          </form>
        )}

        {/* Step 2: Bio & details */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
              <strong>Your bio is your pitch to parents.</strong> A detailed bio helps parents trust you. Tutors with longer bios get significantly more bookings. Aim for at least 3-4 sentences.
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">About you *</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder={"Write about yourself for parents and students. Include:\n\n• Your teaching experience and background\n• What makes your teaching style effective\n• What grades/levels you teach\n• Any notable achievements or results\n• Why you're passionate about your subject\n\nExample: \"I'm a mathematics graduate from the University of Nairobi with 5 years of tutoring experience. I specialize in helping Form 3 and Form 4 students prepare for KCSE, and my students consistently score A's and B's. My approach is patient and step-by-step — I break down complex problems into simple, relatable examples...\""}
                rows={8}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" required />
              <div className="flex justify-between mt-1">
                <p className={`text-xs ${form.bio.length >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {form.bio.length} characters {form.bio.length < 100 ? `(${100 - form.bio.length} more needed)` : '✓'}
                </p>
                <p className="text-xs text-slate-400">Recommended: 200+ characters</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teaching style</label>
              <select value={form.teaching_style} onChange={(e) => setForm({ ...form, teaching_style: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select your style</option>
                <option value="Patient & step-by-step">Patient & step-by-step</option>
                <option value="Interactive & discussion-based">Interactive & discussion-based</option>
                <option value="Practice-focused with lots of exercises">Practice-focused with lots of exercises</option>
                <option value="Visual & creative explanations">Visual & creative explanations</option>
                <option value="Exam-oriented & results-driven">Exam-oriented & results-driven</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Grade levels you teach</label>
              <div className="flex flex-wrap gap-2">
                {gradeOptions.map(g => (
                  <button key={g} type="button" onClick={() => {
                    const current = form.grade_levels || [];
                    setForm({ ...form, grade_levels: current.includes(g) ? current.filter(x => x !== g) : [...current, g] });
                  }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${(form.grade_levels || []).includes(g) ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Languages</label>
              <input type="text" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })}
                placeholder="e.g. English, Kiswahili"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
              Next: Upload Documents
            </button>
          </form>
        )}

        {/* Step 3: Document upload */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-5">
            <button type="button" onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to bio
            </button>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>Why do we need this?</strong> To keep students safe, we verify every tutor before they appear on the platform. Your documents are kept private and only reviewed by our team.
            </div>

            <FileUpload label="National ID / Passport" hint="Image or PDF, max 5MB" file={idFile} onFile={setIdFile} />
            <FileUpload label="Teaching Certificate / Qualification" hint="Degree cert, teaching license, etc." file={credentialFile} onFile={setCredentialFile} />

            <button type="submit"
              className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
              Next: Review Terms
            </button>
          </form>
        )}

        {/* Step 4: Terms of Engagement */}
        {step === 4 && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
            <button type="button" onClick={() => setStep(3)} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to documents
            </button>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-3">Terms of Engagement</h3>
              <p className="text-sm text-slate-600 mb-4">Please review the following terms before completing your registration:</p>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</span>
                  <div><strong>Platform Fee:</strong> Tutagora takes a 15% service fee on each lesson. You receive 85% of your hourly rate.</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</span>
                  <div><strong>Weekly Payouts:</strong> Earnings are paid out every Friday via mobile money to your registered phone number.</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</span>
                  <div><strong>Platform Exclusivity:</strong> You agree not to solicit students found through Tutagora for off-platform lessons. All bookings and payments must go through the platform.</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">4</span>
                  <div><strong>Cancellation Policy:</strong> You must give at least 24 hours notice when cancelling a lesson. Repeated no-shows may result in account suspension.</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">5</span>
                  <div><strong>Code of Conduct:</strong> Maintain professional behaviour. Share of contact information outside the platform is prohibited. Any violation may lead to permanent removal.</div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 mt-0.5" />
              <span className="text-sm text-slate-700">I have read and agree to the <strong>Terms of Engagement</strong> and <button type="button" onClick={() => window.open('/privacy', '_blank')} className="text-emerald-600 underline font-semibold">Privacy Policy</button>. I understand the platform fee structure and code of conduct. I explicitly consent to the collection and processing of my national ID and teaching certificates for identity verification, in accordance with the Kenya Data Protection Act, 2019.</span>
            </label>

            <button type="submit" disabled={saving || !agreedToTerms}
              className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50">
              {saving ? 'Submitting...' : 'Submit for Verification'}
            </button>

            <p className="text-xs text-center text-slate-400">Your profile will be reviewed within 24 hours</p>
          </form>
        )}
      </div>
    </div>
  );
};

// ============ CLUBS ROUTE (discovery + enrolment modal) ============
const ClubsRoute = ({ user, onNavigate, setShowAuth }) => {
  const [payClass, setPayClass] = useState(null);
  const [bump, setBump] = useState(0);           // re-mount ClubsPage after enrolment to refresh counts
  return (
    <>
      <ClubsPage key={bump} user={user} onNavigate={onNavigate} setShowAuth={setShowAuth} onEnroll={setPayClass} />
      {payClass && (
        <GroupClassEnrollModal gc={payClass} user={user}
          onClose={() => setPayClass(null)}
          onSuccess={() => { setPayClass(null); setBump(b => b + 1); }} />
      )}
    </>
  );
};

// ============ TUTOR DASHBOARD ============
const TutorDashboard = ({ profile, bookings, bookingsLoading, onLogout, onStartLesson, onOpenMessages, onRefreshProfile, onNavigate, isAdmin, onOpenAccountSettings }) => {
  const [tab, setTab] = useState('overview');
  const [resubmitting, setResubmitting] = useState(false);
  const tutor = profile?.tutors?.[0];
  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completed = bookings.filter(b => b.status === 'completed');

  // Auto-refresh profile every 30s while waiting for verification
  useEffect(() => {
    const status = tutor?.verification_status;
    if (status === 'pending' || status === 'under_review') {
      const interval = setInterval(() => onRefreshProfile(), 30000);
      return () => clearInterval(interval);
    }
  }, [tutor?.verification_status]);

  // Verification status (tutor may be null pre-onboarding — derive defensively)
  const verificationStatus = tutor?.verification_status || (tutor?.verified ? 'approved' : 'pending');
  const isPending = verificationStatus === 'pending';
  const isRejected = verificationStatus === 'rejected';
  const isApproved = verificationStatus === 'approved';

  // Group classes state — MUST live above the onboarding early-return. React
  // requires an identical hook count every render; when onboarding completes
  // and the early return stops firing, hooks declared below it would suddenly
  // start executing → React #310 crash right at "go to dashboard".
  const [groupClasses, setGroupClasses] = useState([]);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [classForm, setClassForm] = useState({ title: '', description: '', subject: '', class_type: 'academic', category: '', age_range: '', recurring: false, max_students: 10, price_per_student: 500, lesson_date: '', start_time: '09:00', duration_minutes: 60 });
  const [classLoading, setClassLoading] = useState(false);
  const [classError, setClassError] = useState('');

  useEffect(() => {
    if (tutor?.id && isApproved) {
      supabase.from('group_classes').select('*, group_class_enrollments(id, student_id, profiles:student_id(full_name))').eq('tutor_id', tutor.id).order('lesson_date', { ascending: true }).then(({ data }) => {
        if (data) setGroupClasses(data);
      });
    }
  }, [tutor?.id, isApproved]);

  // Show onboarding if: no tutor profile, incomplete profile (no bio or documents), or re-submitting after rejection
  const needsOnboarding = !tutor || resubmitting || !tutor.bio || !tutor.id_document_url;
  if (needsOnboarding) {
    return <TutorOnboarding profile={profile} onComplete={() => { setResubmitting(false); onRefreshProfile(); }} />;
  }

  const VerificationBanner = () => {
    if (isApproved) return null;
    if (isRejected) return (
      <div className="mx-4 lg:mx-0 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <div>
            <h4 className="font-semibold text-red-800">Verification Rejected</h4>
            <p className="text-sm text-red-600 mt-1">{tutor.rejection_reason || 'Your application was not approved. Please re-upload your documents.'}</p>
            <button onClick={() => setResubmitting(true)} className="mt-2 text-sm font-medium text-red-700 underline">Re-submit documents</button>
          </div>
        </div>
      </div>
    );
    // Pending — show progress steps
    return (
      <div className="mx-4 lg:mx-0 mb-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3 mb-4">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h4 className="font-semibold text-amber-800">Profile Under Review</h4>
            <p className="text-sm text-amber-600 mt-1">Your documents are being reviewed by our team. This usually takes less than 24 hours.</p>
          </div>
        </div>
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
            Profile submitted
          </div>
          <div className="w-6 h-0.5 bg-amber-300" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium animate-pulse">
            <span className="w-5 h-5 bg-amber-400 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
            Under review
          </div>
          <div className="w-6 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-full text-xs font-medium">
            <span className="w-5 h-5 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-[10px]">3</span>
            Go live!
          </div>
        </div>
      </div>
    );
  };

  const handleCreateGroupClass = async (e) => {
    e.preventDefault();
    setClassError('');
    // Guard: a class must be scheduled in the future.
    if (!classForm.lesson_date) { setClassError('Please choose a date for the class.'); return; }
    const when = new Date(`${classForm.lesson_date}T${classForm.start_time || '00:00'}`);
    if (when.getTime() < Date.now()) { setClassError('That date and time is in the past — pick a future slot.'); return; }

    setClassLoading(true);
    const isInterest = classForm.class_type === 'interest';
    if (isInterest && !classForm.category) { setClassError('Please choose a club category.'); setClassLoading(false); return; }
    if (!isInterest && !classForm.subject) { setClassError('Please choose a subject.'); setClassLoading(false); return; }
    const { data, error } = await supabase.from('group_classes').insert({
      tutor_id: tutor.id,
      ...classForm,
      // The DB CHECK enforces this pairing: interest → category (no subject),
      // academic → subject (no category).
      subject:  isInterest ? null : classForm.subject,
      category: isInterest ? classForm.category : null,
      price_per_student: parseInt(classForm.price_per_student),
      max_students: parseInt(classForm.max_students),
      duration_minutes: parseInt(classForm.duration_minutes),
    }).select('*, group_class_enrollments(id)').single();
    if (data) {
      setGroupClasses(prev => [...prev, data]);
      setShowCreateClass(false);
      setClassForm({ title: '', description: '', subject: '', class_type: 'academic', category: '', age_range: '', recurring: false, max_students: 10, price_per_student: 500, lesson_date: '', start_time: '09:00', duration_minutes: 60 });
    }
    if (error) {
      console.error('Error creating group class:', error);
      // Surface the real reason instead of failing silently. The most common
      // cause is the group_classes table/RLS not being set up yet in Supabase.
      setClassError(
        /relation .*group_classes.* does not exist/i.test(error.message || '')
          ? 'Group classes aren’t set up on the server yet (the group_classes table is missing). Run the group_classes migration in Supabase.'
          : (error.message || 'Could not create the class. Please try again.')
      );
    }
    setClassLoading(false);
  };

  // SVG Icons
  const icons = {
    overview: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
    schedule: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    students: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    earnings: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    groupClasses: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    profile: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Schedule', locked: !isApproved },
    { id: 'students', label: 'Students', locked: !isApproved },
    { id: 'groupClasses', label: 'Group Classes', locked: !isApproved },
    { id: 'earnings', label: 'Earnings', locked: !isApproved },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="h-16 px-6 flex items-center border-b border-slate-100">
          <button onClick={() => onNavigate && onNavigate('home')} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">T</div>
            <div className="text-left">
              <div className="font-semibold text-slate-900 text-sm">Tutagora</div>
              <div className="text-xs text-emerald-600 font-medium">Tutor Portal</div>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => !item.locked && setTab(item.id)}
              disabled={item.locked}
              title={item.locked ? 'Available after verification' : ''}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.locked ? 'text-slate-300 cursor-not-allowed' :
                tab === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {icons[item.id]}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size={36} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{profile?.full_name}</div>
              <div className="text-xs text-slate-400 truncate">{tutor?.subject}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile-only logo + home link (sidebar hidden on mobile) */}
            <button onClick={() => onNavigate && onNavigate('home')} className="lg:hidden flex items-center gap-2 mr-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">T</div>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">{navItems.find(n => n.id === tab)?.label}</h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">Tutor</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate && onNavigate('home')} className="text-sm text-slate-500 hover:text-slate-700 hidden sm:block">Home</button>
            <button onClick={() => onNavigate && onNavigate('tutors')} className="text-sm text-slate-500 hover:text-slate-700 hidden sm:block">Find Tutors</button>
            <button onClick={() => onNavigate && onNavigate('spreadsheet')} className="text-sm text-blue-600 font-medium">Spreadsheet</button>
            <button onClick={() => onNavigate && onNavigate('classroom')} className="text-sm text-emerald-600 font-medium">Class Insights</button>
            {isAdmin && <button onClick={() => onNavigate && onNavigate('admin')} className="text-sm text-purple-600 font-medium hidden sm:block">Admin</button>}
            <MessageButton onClick={onOpenMessages} />
            {onOpenAccountSettings && <button onClick={onOpenAccountSettings} className="text-sm text-slate-500 hover:text-slate-700" title="Account & Data Settings">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>}
            <button onClick={onLogout} className="text-sm text-slate-500 hover:text-slate-700">Sign out</button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <VerificationBanner />
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 flex items-center gap-4 text-white">
                <Lottie src={ANIMATIONS.teacher} width={80} height={80} loop={false} />
                <div>
                  <h2 className="text-xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0]}!</h2>
                  <p className="text-slate-300 text-sm">You have {upcoming.length} upcoming lesson{upcoming.length !== 1 ? 's' : ''} this week</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900">{tutor.students_total || completed.length}</div>
                    <div className="text-sm text-slate-500">Total Students</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900">{completed.length}</div>
                    <div className="text-sm text-slate-500">Lessons Completed</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900">{tutor.rating || '—'}</div>
                    <div className="text-sm text-slate-500">Average Rating</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900">KSh {(completed.length * tutor.hourly_rate).toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Earned</div>
                  </div>
                </div>
              </div>

              {/* Upcoming Lessons */}
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Upcoming Lessons</h2>
                  <span className="text-sm text-slate-400">{upcoming.length} scheduled</span>
                </div>
                {bookingsLoading ? <LoadingSpinner /> : upcoming.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-500">No upcoming lessons</p>
                    <p className="text-sm text-slate-400 mt-1">New bookings will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {upcoming.map(b => (
                      <div key={b.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar src={b.profiles?.avatar_url} name={b.profiles?.full_name} size={44} />
                          <div>
                            <div className="font-medium text-slate-900">{b.profiles?.full_name}</div>
                            <div className="text-sm text-slate-500">{b.subject}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-900">{b.lesson_date}</div>
                            <div className="text-sm text-slate-400">{b.start_time?.slice(0,5)}</div>
                          </div>
                          {b.status === 'confirmed' && (
                            <button 
                              onClick={() => onStartLesson(b)} 
                              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                            >
                              Start Lesson
                            </button>
                          )}
                          {b.status === 'pending' && (
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'students' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Your Students</h2>
              </div>
              {completed.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">No students yet</p>
                  <p className="text-sm text-slate-400 mt-1">Students will appear here after lessons</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {/* Group by unique students */}
                  {[...new Map(completed.map(b => [b.student_id, b])).values()].map(b => (
                    <div key={b.student_id} className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar src={b.profiles?.avatar_url} name={b.profiles?.full_name} size={44} />
                        <div>
                          <div className="font-medium text-slate-900">{b.profiles?.full_name}</div>
                          <div className="text-sm text-slate-500">
                            {completed.filter(c => c.student_id === b.student_id).length} lessons completed
                          </div>
                        </div>
                      </div>
                      <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                        View History
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'schedule' && (
            <TutorScheduleManager tutor={tutor} bookings={bookings} />
          )}

          {tab === 'earnings' && (
            <TutorEarningsTab tutor={tutor} completed={completed} />
          )}

          {tab === 'groupClasses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Group Classes</h2>
                <button onClick={() => setShowCreateClass(!showCreateClass)} className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                  {showCreateClass ? 'Cancel' : '+ Create Class'}
                </button>
              </div>

              {showCreateClass && (
                <form onSubmit={handleCreateGroupClass} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="font-semibold text-slate-900">Create a New Group Class</h3>
                  {/* Academic vs interest club */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: 'academic', t: 'Academic class', d: 'A school subject — revision, exam prep' },
                      { v: 'interest', t: 'Interest club', d: 'Chess, coding, art, debate…' },
                    ].map(o => (
                      <button type="button" key={o.v} onClick={() => setClassForm({ ...classForm, class_type: o.v })}
                        className={`text-left rounded-lg border p-3 transition-colors ${classForm.class_type === o.v ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="font-medium text-slate-900 text-sm">{o.t}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{o.d}</div>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">{classForm.class_type === 'interest' ? 'Club Name *' : 'Class Title *'}</label>
                      <input type="text" value={classForm.title} onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                        placeholder={classForm.class_type === 'interest'
                          ? `e.g. ${(CATEGORY_BY_KEY[classForm.category]?.examples || ['Saturday Chess Masters'])[0]}`
                          : 'e.g. KCSE Mathematics Revision'} required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea value={classForm.description} onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                        placeholder="What will students learn in this class?" rows={3}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    {classForm.class_type === 'interest' ? (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                        <select value={classForm.category} onChange={(e) => setClassForm({ ...classForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">Choose a club type</option>
                          {INTEREST_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                        </select>
                        {classForm.category && CATEGORY_BY_KEY[classForm.category]?.examples && (
                          <p className="mt-1.5 text-xs text-slate-400">
                            Great club names are specific: {CATEGORY_BY_KEY[classForm.category].examples.join(' · ')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                        <select value={classForm.subject} onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">Select subject</option>
                          {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}
                    {classForm.class_type === 'interest' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Age range</label>
                          <select value={classForm.age_range} onChange={(e) => setClassForm({ ...classForm, age_range: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Any age</option>
                            {['6–9', '9–12', '12–15', '15–18'].map(a => <option key={a} value={a}>{a} years</option>)}
                          </select>
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input type="checkbox" checked={classForm.recurring}
                              onChange={(e) => setClassForm({ ...classForm, recurring: e.target.checked })}
                              className="w-4 h-4 accent-emerald-600" />
                            <span className="text-sm text-slate-700">Runs <b>weekly</b> — same day &amp; time each week</span>
                          </label>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Max Students (2-20)</label>
                      <input type="number" value={classForm.max_students} onChange={(e) => setClassForm({ ...classForm, max_students: e.target.value })}
                        min="2" max="20" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price per Student (KSh)</label>
                      <input type="number" value={classForm.price_per_student} onChange={(e) => setClassForm({ ...classForm, price_per_student: e.target.value })}
                        min="100" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                      <select value={classForm.duration_minutes} onChange={(e) => setClassForm({ ...classForm, duration_minutes: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="30">30 min</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                      <input type="date" value={classForm.lesson_date} onChange={(e) => setClassForm({ ...classForm, lesson_date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]} required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Time *</label>
                      <input type="time" value={classForm.start_time} onChange={(e) => setClassForm({ ...classForm, start_time: e.target.value })} required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                  {classError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{classError}</div>
                  )}
                  <button type="submit" disabled={classLoading} className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
                    {classLoading ? 'Creating...' : 'Create Group Class'}
                  </button>
                </form>
              )}

              {groupClasses.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <h3 className="font-semibold text-slate-900 mb-1">No group classes yet</h3>
                  <p className="text-sm text-slate-500">Create your first group class to teach multiple students at once and earn more!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupClasses.map(gc => {
                    const enrolled = gc.group_class_enrollments?.length || 0;
                    const spotsLeft = gc.max_students - enrolled;
                    return (
                      <div key={gc.id} className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{gc.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{gc.description}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                            gc.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                            gc.status === 'full' ? 'bg-amber-100 text-amber-700' :
                            gc.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                            'bg-red-100 text-red-700'
                          }`}>{gc.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(gc.lesson_date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span>{gc.start_time} ({gc.duration_minutes} min)</span>
                          <span className="text-emerald-600 font-medium">KSh {gc.price_per_student}/student</span>
                          <span>{enrolled}/{gc.max_students} enrolled ({spotsLeft} spots left)</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{gc.subject}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'profile' && (
            <div className="space-y-6">
              <TutorProfileEditor tutor={tutor} profile={profile} />
              <TutorAvailabilityEditor tutor={tutor} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ============ TUTOR EARNINGS TAB ============
const TutorEarningsTab = ({ tutor, completed }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const PLATFORM_FEE_PERCENT = 15; // Tutagora keeps 15%, tutor gets 85%
  const tutorSharePercent = 100 - PLATFORM_FEE_PERCENT;

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await supabase.from('payments')
        .select('*, bookings(lesson_date, subject, status, profiles:student_id(full_name))')
        .eq('tutor_id', tutor.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      setPayments(data || []);
      setLoading(false);
    };
    fetchPayments();
  }, [tutor.id]);

  const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const tutorEarnings = Math.round(totalRevenue * tutorSharePercent / 100);
  const paidOut = payments.filter(p => p.payout_status === 'paid').reduce((s, p) => s + Math.round((p.amount || 0) * tutorSharePercent / 100), 0);
  const pendingPayout = tutorEarnings - paidOut;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Total Earned</div>
          <div className="text-2xl font-bold text-slate-900">KSh {tutorEarnings.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">{tutorSharePercent}% of KSh {totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Pending Payout</div>
          <div className="text-2xl font-bold text-amber-600">KSh {pendingPayout.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Awaiting payout</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Hourly Rate</div>
          <div className="text-2xl font-bold text-slate-900">KSh {tutor.hourly_rate?.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">You receive KSh {Math.round((tutor.hourly_rate || 0) * tutorSharePercent / 100).toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-sm text-slate-500 mb-1">Lessons Completed</div>
          <div className="text-2xl font-bold text-slate-900">{completed.length}</div>
          <div className="text-xs text-slate-400 mt-1">{payments.length} paid</div>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Payment History</h3>
          <span className="text-sm text-slate-400">{payments.length} payments</span>
        </div>
        {payments.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No payments received yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Subject</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Lesson Fee</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Your Share</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(p => {
                  const share = Math.round((p.amount || 0) * tutorSharePercent / 100);
                  const isPaid = p.payout_status === 'paid';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-sm text-slate-600">{p.bookings?.lesson_date || new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-900">{p.bookings?.profiles?.full_name || '—'}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{p.bookings?.subject || '—'}</td>
                      <td className="px-5 py-3 text-sm text-right text-slate-600">KSh {(p.amount || 0).toLocaleString()}</td>
                      <td className="px-5 py-3 text-sm text-right font-medium text-slate-900">KSh {share.toLocaleString()}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h4 className="font-semibold text-blue-800 text-sm">How payouts work</h4>
            <p className="text-sm text-blue-600 mt-1">Tutors receive {tutorSharePercent}% of each lesson fee. Payouts are processed weekly via mobile money. Tutagora retains {PLATFORM_FEE_PERCENT}% as a platform fee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ TUTOR AVAILABILITY EDITOR ============
const TutorAvailabilityEditor = ({ tutor }) => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const days = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const timeSlots = [];
  for (let h = 6; h <= 22; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
  }

  useEffect(() => {
    fetchAvailability();
  }, [tutor.id]);

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('availability')
      .select('*')
      .eq('tutor_id', tutor.id)
      .order('day_of_week');
    
    // Initialize all days
    const allDays = days.map(day => {
      const existing = data?.find(a => a.day_of_week === day.value);
      return {
        day_of_week: day.value,
        enabled: !!existing,
        start_time: existing?.start_time || '09:00',
        end_time: existing?.end_time || '17:00',
        id: existing?.id || null,
      };
    });
    
    setAvailability(allDays);
    setLoading(false);
  };

  const toggleDay = (dayValue) => {
    setAvailability(prev => prev.map(a => 
      a.day_of_week === dayValue ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const updateTime = (dayValue, field, value) => {
    setAvailability(prev => prev.map(a => 
      a.day_of_week === dayValue ? { ...a, [field]: value } : a
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Delete all existing availability
      await supabase
        .from('availability')
        .delete()
        .eq('tutor_id', tutor.id);

      // Insert enabled days
      const enabledDays = availability
        .filter(a => a.enabled)
        .map(a => ({
          tutor_id: tutor.id,
          day_of_week: a.day_of_week,
          start_time: a.start_time,
          end_time: a.end_time,
        }));

      if (enabledDays.length > 0) {
        await supabase.from('availability').insert(enabledDays);
      }

      setMessage('Availability saved!');
    } catch (err) {
      setMessage('Error saving availability');
      console.error(err);
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-1">Availability Settings</h3>
      <p className="text-sm text-slate-500 mb-4">Set the days and times you're available for lessons</p>
      
      <div className="space-y-2">
        {availability.map(slot => {
          const day = days.find(d => d.value === slot.day_of_week);
          return (
            <div key={slot.day_of_week} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${slot.enabled ? 'bg-slate-50' : 'bg-white border border-slate-100'}`}>
              <button
                onClick={() => toggleDay(slot.day_of_week)}
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  slot.enabled ? 'bg-slate-900 text-white' : 'border border-slate-300'
                }`}
              >
                {slot.enabled && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </button>
              
              <span className={`w-24 font-medium ${slot.enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                {day.label}
              </span>
              
              {slot.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={slot.start_time}
                    onChange={(e) => updateTime(slot.day_of_week, 'start_time', e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                  >
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="text-slate-400">to</span>
                  <select
                    value={slot.end_time}
                    onChange={(e) => updateTime(slot.day_of_week, 'end_time', e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                  >
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Availability'}
        </button>
        {message && <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>{message}</span>}
      </div>
    </div>
  );
};

// ============ TUTOR SCHEDULE MANAGER ============
const TutorScheduleManager = ({ tutor, bookings }) => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  
  const days = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
  ];

  const timeSlots = [];
  for (let h = 6; h <= 22; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
  }

  useEffect(() => {
    fetchAvailability();
  }, [tutor.id]);

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('availability')
      .select('*')
      .eq('tutor_id', tutor.id);
    
    // Create slots for all days
    const allDays = days.map(d => {
      const existing = data?.find(a => a.day_of_week === d.value);
      return {
        day_of_week: d.value,
        start_time: existing?.start_time || '09:00',
        end_time: existing?.end_time || '17:00',
        enabled: !!existing,
      };
    });
    
    setAvailability(allDays);
    setLoading(false);
  };

  const toggleDay = (dayValue) => {
    setAvailability(prev => prev.map(a => 
      a.day_of_week === dayValue ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const updateTime = (dayValue, field, value) => {
    setAvailability(prev => prev.map(a => 
      a.day_of_week === dayValue ? { ...a, [field]: value } : a
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      await supabase.from('availability').delete().eq('tutor_id', tutor.id);

      const enabledDays = availability
        .filter(a => a.enabled)
        .map(a => ({
          tutor_id: tutor.id,
          day_of_week: a.day_of_week,
          start_time: a.start_time,
          end_time: a.end_time,
        }));

      if (enabledDays.length > 0) {
        await supabase.from('availability').insert(enabledDays);
      }

      setMessage('Schedule saved!');
    } catch (err) {
      setMessage('Error saving');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Scheduled Lessons</h3>
          <span className="text-sm text-slate-400">{upcoming.length} upcoming</span>
        </div>
        {upcoming.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-500">No upcoming lessons</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcoming.map(b => (
              <div key={b.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={b.profiles?.avatar_url} name={b.profiles?.full_name} size={40} />
                  <div>
                    <div className="font-medium text-slate-900">{b.profiles?.full_name}</div>
                    <div className="text-sm text-slate-500">{b.subject}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">{b.lesson_date}</div>
                  <div className="text-sm text-slate-400">{b.start_time?.slice(0,5)}</div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Availability */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Weekly Availability</h3>
          <p className="text-sm text-slate-500 mt-1">Set when you're available for lessons</p>
        </div>
        
        <div className="p-5 space-y-2">
          {availability.map(slot => {
            const day = days.find(d => d.value === slot.day_of_week);
            return (
              <div key={slot.day_of_week} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${slot.enabled ? 'bg-slate-50' : ''}`}>
                <button
                  onClick={() => toggleDay(slot.day_of_week)}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    slot.enabled ? 'bg-slate-900 text-white' : 'border border-slate-300'
                  }`}
                >
                  {slot.enabled && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </button>
                
                <span className={`w-28 font-medium text-sm ${slot.enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                  {day.label}
                </span>
                
                {slot.enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      value={slot.start_time}
                      onChange={(e) => updateTime(slot.day_of_week, 'start_time', e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="text-slate-400">to</span>
                    <select
                      value={slot.end_time}
                      onChange={(e) => updateTime(slot.day_of_week, 'end_time', e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">Not available</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
          {message && <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>{message}</span>}
        </div>
      </div>
    </div>
  );
};

// ============ TUTOR PROFILE EDITOR ============
const TutorProfileEditor = ({ tutor, profile }) => {
  const [form, setForm] = useState({
    subject: tutor?.subject || '',
    headline: tutor?.headline || '',
    bio: tutor?.bio || '',
    hourly_rate: tutor?.hourly_rate || 1000,
    degree: tutor?.degree || '',
    experience_years: tutor?.experience_years || '',
    teaching_style: tutor?.teaching_style || '',
    languages: tutor?.languages || 'English, Kiswahili',
    grade_levels: tutor?.grade_levels || [],
  });
  const gradeOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'University'];
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.avatar_url || null);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Upload new photo if changed
      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const photoPath = `${profile.id}/avatar-${Date.now()}.${ext}`;
        await supabase.storage.from('avatars').upload(photoPath, photoFile, { upsert: true });
        const { data: photoUrl } = supabase.storage.from('avatars').getPublicUrl(photoPath);
        await supabase.from('profiles').update({ avatar_url: photoUrl.publicUrl }).eq('id', profile.id);
      }

      const { error } = await supabase.from('tutors').update(form).eq('id', tutor.id);
      setMessage(error ? 'Error saving' : 'Saved!');
    } catch (err) {
      setMessage('Error saving: ' + err.message);
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-5">
      {/* Photo section */}
      <div className="flex items-center gap-4 mb-6">
        <label className="relative cursor-pointer group">
          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-slate-100 group-hover:border-emerald-200 transition-colors">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Avatar src={null} name={profile?.full_name} size={80} />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoSelect} />
        </label>
        <div>
          <h3 className="font-bold text-lg">{profile?.full_name}</h3>
          <p className="text-slate-500 text-sm">{profile?.email}</p>
          <p className="text-xs text-emerald-600 mt-0.5">Click photo to change</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Headline</label>
          <input value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Making calculus intuitive and fun" maxLength={80} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          <p className="text-xs text-slate-400 mt-0.5">{form.headline.length}/80</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">About you (bio)</label>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={6}
            placeholder="Tell parents about your teaching experience, what makes you effective, which levels you teach, and why you love your subject. The more detail, the more bookings you'll get!"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          <p className={`text-xs mt-0.5 ${form.bio.length >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {form.bio.length} characters {form.bio.length < 100 ? '— aim for at least 100' : '✓'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Degree / Qualification</label>
          <input value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Hourly Rate (KSh)</label>
            <input type="number" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Years of experience</label>
            <input type="number" value={form.experience_years} onChange={e => setForm({ ...form, experience_years: e.target.value })} min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teaching style</label>
          <select value={form.teaching_style} onChange={e => setForm({ ...form, teaching_style: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg">
            <option value="">Select your style</option>
            <option value="Patient & step-by-step">Patient & step-by-step</option>
            <option value="Interactive & discussion-based">Interactive & discussion-based</option>
            <option value="Practice-focused with lots of exercises">Practice-focused with lots of exercises</option>
            <option value="Visual & creative explanations">Visual & creative explanations</option>
            <option value="Exam-oriented & results-driven">Exam-oriented & results-driven</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Grade levels</label>
          <div className="flex flex-wrap gap-2">
            {gradeOptions.map(g => (
              <button key={g} type="button" onClick={() => {
                const current = Array.isArray(form.grade_levels) ? form.grade_levels : [];
                setForm({ ...form, grade_levels: current.includes(g) ? current.filter(x => x !== g) : [...current, g] });
              }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(Array.isArray(form.grade_levels) ? form.grade_levels : []).includes(g) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Languages</label>
          <input value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-emerald-500 text-white font-semibold rounded-lg disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {message && <p className={`text-center text-sm ${message.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>{message}</p>}
      </div>
    </div>
  );
};

// ============ HOME PAGE ============
// ============ TEACH PAGE — Tutor Recruitment ============
const TeachPage = ({ onNavigate, setShowAuth }) => {
  const tutorFaqs = [
    { q: 'How much can I earn?', a: 'You set your own hourly rate from KSh 500 to KSh 10,000. Tutagora takes a 15% platform fee and you keep 85%. Teaching just 10 hours a week at KSh 1,000/hr means KSh 34,000/month in your pocket.' },
    { q: 'When do I get paid?', a: 'Payouts are processed every Friday directly to your mobile money. You can track your earnings and payout history from your tutor dashboard.' },
    { q: 'What documents do I need?', a: 'A valid national ID or passport, and a teaching certificate or relevant academic qualification (degree, diploma, or professional certification).' },
    { q: 'How long does verification take?', a: 'Our team typically reviews applications within 24 hours. Once approved, your profile goes live and students can start booking you immediately.' },
    { q: 'Do I need any equipment?', a: 'Just a smartphone or laptop with a stable internet connection. All lessons happen via our built in video call platform with screen sharing and chat.' },
    { q: 'Can I teach multiple subjects?', a: 'Yes! You can select as many subjects as you are qualified to teach. Many of our tutors teach 2 to 3 related subjects.' },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-5 relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold mb-4 border border-emerald-500/30">Now recruiting tutors</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Teach on <span className="text-emerald-400">Tutagora</span>,<br /> earn on your terms
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300 max-w-xl">
              Join Kenya's growing online tutoring platform. Set your own hours, choose your rate, and get paid weekly via mobile money. We bring the students to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 justify-center lg:justify-start">
              <button onClick={() => setShowAuth({ mode: 'register', role: 'tutor' })} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors text-base">
                Apply Now
              </button>
              <button onClick={() => { const el = document.getElementById('how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-colors text-base">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden lg:block flex-shrink-0">
            <Lottie src={ANIMATIONS.teacher} width={380} height={380} loop={false} />
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><span className="text-2xl sm:text-3xl font-bold text-slate-900">85%</span><p className="text-slate-500 text-sm mt-1">You keep per lesson</p></div>
            <div><span className="text-2xl sm:text-3xl font-bold text-slate-900">Weekly</span><p className="text-slate-500 text-sm mt-1">Mobile money payouts</p></div>
            <div><span className="text-2xl sm:text-3xl font-bold text-slate-900">24hrs</span><p className="text-slate-500 text-sm mt-1">Verification time</p></div>
            <div><span className="text-2xl sm:text-3xl font-bold text-emerald-600">Free</span><p className="text-slate-500 text-sm mt-1">To join</p></div>
          </div>
        </div>
      </section>

      {/* Why Tutors Love Tutagora */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why tutors love Tutagora</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">Everything you need to build a tutoring career online</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center">
              <div className="flex justify-center mb-4">
                <Lottie src={ANIMATIONS.payment} width={80} height={80} loop={false} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Earn what you deserve</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Set your own hourly rate from KSh 500 to 10,000. No cap on how many students you can take. The more you teach, the more you earn.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center">
              <div className="flex justify-center mb-4">
                <Lottie src={ANIMATIONS.calendar} width={80} height={80} loop={false} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Your schedule, your rules</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Teach mornings, evenings, or weekends. Block off days when you are busy. Students can only book slots you have made available.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center">
              <div className="flex justify-center mb-4">
                <Lottie src={ANIMATIONS.search} width={80} height={80} loop={false} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Students come to you</h3>
              <p className="text-slate-600 text-sm leading-relaxed">No marketing needed. Parents and students find you through our platform, read your profile, check your availability, and book directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — Step by Step */}
      <section id="how-it-works" className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Start teaching in 3 steps</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">The whole process takes less than 10 minutes</p>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0">
                <Lottie src={ANIMATIONS.typing} width={120} height={120} loop={false} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</span>
                  <h3 className="text-lg font-bold text-slate-900">Create your profile</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">Add your subjects, qualifications, teaching style, and hourly rate. Write a short bio that tells parents why you are the right tutor. Upload a photo — profiles with photos get 3x more bookings.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10">
              <div className="flex-shrink-0">
                <Lottie src={ANIMATIONS.certificate} width={120} height={120} loop={false} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</span>
                  <h3 className="text-lg font-bold text-slate-900">Get verified</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">Upload your national ID and teaching certificate. Our team reviews every application within 24 hours to keep students safe. Once approved, your profile goes live immediately.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0">
                <Lottie src={ANIMATIONS.videoCall} width={120} height={120} loop={false} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</span>
                  <h3 className="text-lg font-bold text-slate-900">Teach and earn</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">Students book your available time slots. Teach one on one via our built in video platform with screen sharing and whiteboard. Get paid every Friday via mobile money.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-12 sm:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What could you earn?</h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">Here is what Tutagora tutors earn at different commitment levels</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="text-center">
                <p className="text-slate-400 text-sm">Part time</p>
                <p className="text-sm text-slate-500 mb-3">5 hrs/week</p>
                <p className="text-3xl font-bold text-white">KSh 17,000</p>
                <p className="text-slate-500 text-sm mt-1">/month</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400"><span>Rate</span><span className="text-white">KSh 1,000/hr</span></div>
                <div className="flex justify-between text-slate-400"><span>Weekly hours</span><span className="text-white">5 hrs</span></div>
                <div className="flex justify-between text-slate-400"><span>Your cut (85%)</span><span className="text-emerald-400">KSh 4,250/wk</span></div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-emerald-900/50 to-slate-800 rounded-2xl p-6 border-2 border-emerald-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">Most popular</div>
              <div className="text-center">
                <p className="text-emerald-400 text-sm font-medium">Regular</p>
                <p className="text-sm text-slate-500 mb-3">10 hrs/week</p>
                <p className="text-4xl font-bold text-white">KSh 34,000</p>
                <p className="text-slate-500 text-sm mt-1">/month</p>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-800 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400"><span>Rate</span><span className="text-white">KSh 1,000/hr</span></div>
                <div className="flex justify-between text-slate-400"><span>Weekly hours</span><span className="text-white">10 hrs</span></div>
                <div className="flex justify-between text-slate-400"><span>Your cut (85%)</span><span className="text-emerald-400">KSh 8,500/wk</span></div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="text-center">
                <p className="text-slate-400 text-sm">Full time</p>
                <p className="text-sm text-slate-500 mb-3">20 hrs/week</p>
                <p className="text-3xl font-bold text-white">KSh 68,000</p>
                <p className="text-slate-500 text-sm mt-1">/month</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400"><span>Rate</span><span className="text-white">KSh 1,000/hr</span></div>
                <div className="flex justify-between text-slate-400"><span>Weekly hours</span><span className="text-white">20 hrs</span></div>
                <div className="flex justify-between text-slate-400"><span>Your cut (85%)</span><span className="text-emerald-400">KSh 17,000/wk</span></div>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-500 text-xs mt-6">Based on KSh 1,000/hr rate. Your actual earnings depend on your rate and hours.</p>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">We handle the rest</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Focus on teaching. We take care of everything else.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: '📹', title: 'Video platform', desc: 'Built in HD video calls with screen sharing' },
              { icon: '💳', title: 'Payment processing', desc: 'Secure card payments via Paystack' },
              { icon: '📅', title: 'Scheduling', desc: 'Students book your available slots' },
              { icon: '📊', title: 'Dashboard', desc: 'Track students, lessons, and earnings' },
              { icon: '🔔', title: 'Notifications', desc: 'Instant alerts for new bookings' },
              { icon: '⭐', title: 'Reviews', desc: 'Build your reputation with ratings' },
              { icon: '👥', title: 'Group classes', desc: 'Create and manage group sessions' },
              { icon: '🛡️', title: 'Verification badge', desc: 'Build trust with parents' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 sm:p-5 text-center">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-semibold text-slate-900 text-sm mt-2">{item.title}</h3>
                <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Frequently asked questions</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Everything you need to know before joining</p>
          </div>
          <div className="space-y-3">
            {tutorFaqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-slate-50">
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.q}</span>
                  <span className="text-slate-400 text-xl ml-4">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-emerald-500 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-5 text-center">
          <div className="flex justify-center mb-4">
            <Lottie src={ANIMATIONS.rocket} width={100} height={100} loop={false} />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to start teaching?</h2>
          <p className="text-emerald-100 text-sm sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">It takes less than 10 minutes to set up your profile. Get verified within 24 hours and start earning this week.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setShowAuth({ mode: 'register', role: 'tutor' })} className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors">
              Apply Now
            </button>
            <button onClick={() => onNavigate('home')} className="px-8 py-4 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 transition-colors">
              Back to Homepage
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-sm">T</div>
            <span className="font-bold">Tutagora</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 Tutagora. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-white">Home</button>
            <button onClick={() => onNavigate('tutors')} className="hover:text-white">Find Tutors</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-white">Privacy Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const HomePage = ({ onNavigate, setShowAuth }) => {
  const { tutors } = useTutors();
  const [openFaq, setOpenFaq] = useState(null);

  const subjects = [
    { name: 'Mathematics', animation: 'mathematics' },
    { name: 'English', animation: 'english' },
    { name: 'Physics', animation: 'physics' },
    { name: 'Chemistry', animation: 'chemistry' },
    { name: 'Biology', animation: 'biology' },
    { name: 'Kiswahili', animation: 'languages' },
    { name: 'History', animation: 'history' },
    { name: 'Geography', animation: 'geography' },
  ];

  const steps = [
    { num: '1', title: 'Find a Tutor', desc: 'Browse our verified tutors by subject, price, and availability' },
    { num: '2', title: 'Book a Lesson', desc: 'Pick a time that works for you and pay securely via card' },
    { num: '3', title: 'Learn Online', desc: 'Join your live video lesson with screen sharing and chat' },
  ];

  const testimonials = [
    { name: 'James Mwangi', location: 'Nairobi', text: 'My son improved from C+ to A- in mathematics within 3 months. The tutor was patient and explained concepts clearly.', rating: 5 },
    { name: 'Faith Wambui', location: 'Mombasa', text: 'I was struggling with physics but my tutor made it so easy to understand. Highly recommend Tutagora!', rating: 5 },
    { name: 'Peter Odhiambo', location: 'Kisumu', text: 'Flexible scheduling and quality tutors. I can learn at my own pace after work.', rating: 4 },
  ];

  const stats = [
    { value: '10,847', label: 'Lessons Completed' },
    { value: '94%', label: 'Student Satisfaction' },
    { value: '15 min', label: 'Avg Response Time' },
    { value: '48 hrs', label: 'Money-back Guarantee' },
  ];

  const faqs = [
    { q: 'How do I book a lesson?', a: 'Simply find a tutor, select an available time slot, and pay securely via card. You\'ll receive a confirmation with a link to join the video lesson.' },
    { q: 'What if I\'m not satisfied with a lesson?', a: 'We offer a 48-hour money-back guarantee. If you\'re not happy with your first lesson with a tutor, we\'ll refund you in full.' },
    { q: 'How do video lessons work?', a: 'Lessons happen via our built-in video platform. Both you and your tutor can share screens, use a virtual whiteboard, and chat in real-time.' },
    { q: 'Can I reschedule a lesson?', a: 'Yes! You can reschedule up to 24 hours before the lesson starts at no extra cost.' },
    { q: 'How do tutors get paid?', a: 'Tutors receive payments weekly via mobile money. We handle all the payment processing securely.' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-5 pt-20 pb-12 sm:py-32 relative flex items-center justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Over 10,000 lessons completed
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Learn from Kenya's <span className="text-emerald-400">best tutors</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300">
              One-on-one online lessons with verified tutors. Book instantly, pay securely, learn from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button onClick={() => onNavigate('tutors')} className="px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors text-sm sm:text-base">
                Find a Tutor
              </button>
              <button onClick={() => onNavigate('teach')} className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-colors text-sm sm:text-base">
                Become a Tutor
              </button>
            </div>
            <div className="flex gap-4 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
              <div><span className="text-xl sm:text-3xl font-bold text-white">{tutors.length || '500'}+</span><span className="text-slate-400 text-xs sm:text-base ml-1 sm:ml-2">Tutors</span></div>
              <div><span className="text-xl sm:text-3xl font-bold text-white">10k+</span><span className="text-slate-400 text-xs sm:text-base ml-1 sm:ml-2">Students</span></div>
              <div className="flex items-center gap-1 sm:gap-2"><span className="text-xl sm:text-3xl font-bold text-white">4.9</span><Stars rating={5} size={14} /></div>
            </div>
          </div>
          {/* Lottie Animation */}
          <div className="hidden lg:block">
            <Lottie src={ANIMATIONS.learning} width={400} height={400} />
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Find tutors by subject</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">Choose from a wide range of subjects taught by expert tutors</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {subjects.map(s => (
              <button 
                key={s.name} 
                onClick={() => onNavigate('tutors')} 
                className="p-6 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg rounded-2xl text-center transition-all group"
              >
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Lottie src={ANIMATIONS[s.animation]} width={70} height={70} />
                </div>
                <div className="font-semibold text-slate-900">{s.name}</div>
                <div className="text-sm text-slate-500 mt-1">View tutors</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How Tutagora works</h2>
            <p className="text-slate-500 mt-3">Get started in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-[120px] h-[120px] bg-emerald-50 rounded-full flex items-center justify-center">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Find a Tutor</h3>
              <p className="text-slate-500">Browse our verified tutors by subject, price, and availability</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-[120px] h-[120px] bg-blue-50 rounded-full flex items-center justify-center">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    <path d="m9 16 2 2 4-4"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book a Lesson</h3>
              <p className="text-slate-500">Pick a time that works for you and pay securely via card</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-[120px] h-[120px] bg-purple-50 rounded-full flex items-center justify-center">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.6 11.6L22 7v10l-6.4-4.5v-1zM4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Learn Online</h3>
              <p className="text-slate-500">Join your live video lesson with screen sharing and chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      {tutors.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Featured Tutors</h2>
                <p className="text-slate-500 mt-2">Learn from our top-rated educators</p>
              </div>
              <button onClick={() => onNavigate('tutors')} className="text-emerald-600 font-semibold hover:text-emerald-700">
                View all →
              </button>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {tutors.slice(0, 4).map(t => (
                <div key={t.id} onClick={() => onNavigate('tutors')} className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                    <Avatar src={t.profiles?.avatar_url} name={t.profiles?.full_name} size={100} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900">{t.profiles?.full_name}</h3>
                    <p className="text-emerald-600 text-sm font-medium">{t.subject}</p>
                    {t.headline && <p className="text-slate-500 text-sm mt-1 line-clamp-2">{t.headline}</p>}
                    <div className="flex items-center gap-2 mt-3">
                      <Stars rating={t.rating || 5} size={14} />
                      <span className="text-sm text-slate-600">{t.rating || '5.0'}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <span className="font-bold text-lg">KSh {t.hourly_rate?.toLocaleString() || '1,000'}</span>
                      <span className="text-slate-400 text-sm">/hour</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-12 sm:py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What our students say</h2>
            <p className="text-slate-400 mt-2 sm:mt-3 text-sm sm:text-base">Join thousands of satisfied learners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6">
                <Stars rating={t.rating} size={16} />
                <p className="text-slate-300 mt-4 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{t.name}</div>
                    <div className="text-slate-400 text-sm">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-16 bg-emerald-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-white">{s.value}</div>
                <div className="text-emerald-100 mt-1 text-xs sm:text-base">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Frequently asked questions</h2>
            <p className="text-slate-500 mt-3">Everything you need to know</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 flex justify-between items-center text-left hover:bg-slate-50"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <span className="text-slate-400 text-xl">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-emerald-500 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-5 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to start learning?</h2>
          <p className="text-emerald-100 text-sm sm:text-lg mb-6 sm:mb-8">Join thousands of students already improving their grades</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate('tutors')} className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors">
              Find a Tutor
            </button>
            <button onClick={() => setShowAuth('register')} className="px-8 py-4 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 transition-colors">
              Sign Up Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-lg">T</div>
                <span className="font-bold text-xl">Tutagora</span>
              </div>
              <p className="text-slate-400">Kenya's leading online tutoring platform. Quality education, accessible to all.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => onNavigate('tutors')} className="hover:text-white">Find Tutors</button></li>
                <li><button onClick={() => setShowAuth('register')} className="hover:text-white">Sign Up</button></li>
                <li><button className="hover:text-white">How It Works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Tutors</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => onNavigate('teach')} className="hover:text-white">Become a Tutor</button></li>
                <li><button onClick={() => onNavigate('teach')} className="hover:text-white">Why Teach</button></li>
                <li><button onClick={() => onNavigate('teach')} className="hover:text-white">Payment Info</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>📧 tutaeducators@gmail.com</li>
                <li>📱 +254 759 240 692</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2026 Tutagora. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('privacy')} className="text-slate-400 text-sm hover:text-white transition-colors">Privacy Policy</button>
              <span className="text-slate-700">|</span>
              <p className="text-slate-500 text-sm">Made in Nairobi</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// ============ TUTORS PAGE ============
const TutorsPage = ({ onSelectTutor, onBack, user, setShowAuth }) => {
  const { tutors, loading } = useTutors();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const subjects = ['All Subjects', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'];
  const grades = ['All Grades', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'University'];
  
  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-1000', label: 'Under KSh 1,000' },
    { value: '1000-1500', label: 'KSh 1,000 - 1,500' },
    { value: '1500-2000', label: 'KSh 1,500 - 2,000' },
    { value: '2000+', label: 'KSh 2,000+' },
  ];

  const filtered = tutors
    .filter(t => {
      // Search filter
      const matchesSearch = !search || 
        t.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.headline?.toLowerCase().includes(search.toLowerCase());
      
      // Subject filter
      const tutorSubjects = t.subjects || [t.subject];
      const matchesSubject = !selectedSubject || selectedSubject === 'All Subjects' || tutorSubjects.includes(selectedSubject);
      
      // Grade filter
      const tutorGrades = gradeList(t.grade_levels);
      const matchesGrade = !selectedGrade || selectedGrade === 'All Grades' || tutorGrades.includes(selectedGrade);

      // Price filter
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const rate = t.hourly_rate || 0;
        if (priceRange === '0-1000') matchesPrice = rate < 1000;
        else if (priceRange === '1000-1500') matchesPrice = rate >= 1000 && rate < 1500;
        else if (priceRange === '1500-2000') matchesPrice = rate >= 1500 && rate < 2000;
        else if (priceRange === '2000+') matchesPrice = rate >= 2000;
      }

      return matchesSearch && matchesSubject && matchesGrade && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-low') return (a.hourly_rate || 0) - (b.hourly_rate || 0);
      if (sortBy === 'price-high') return (b.hourly_rate || 0) - (a.hourly_rate || 0);
      if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0);
      return 0;
    });

  const activeFilters = (selectedSubject && selectedSubject !== 'All Subjects' ? 1 : 0) + (selectedGrade && selectedGrade !== 'All Grades' ? 1 : 0) + (priceRange !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-5">
        <button onClick={onBack} className="text-slate-500 mb-4 flex items-center gap-1"><span>←</span> Back</button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Find a Tutor</h1>
            <p className="text-slate-500 text-sm">{filtered.length} tutors available</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by name, subject, or keyword..." 
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {priceRanges.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Clear Filters */}
            {activeFilters > 0 && (
              <button
                onClick={() => { setSelectedSubject(''); setSelectedGrade(''); setPriceRange('all'); setSearch(''); }}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Clear filters ({activeFilters})
              </button>
            )}
          </div>
        </div>
        
        {/* Results */}
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tutors found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => { setSelectedSubject(''); setPriceRange('all'); setSearch(''); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(t => (
              <div key={t.id} onClick={() => onSelectTutor(t)} className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
                {/* Photo banner */}
                <div className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 relative">
                  {t.top_rated && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 text-emerald-700 text-xs font-semibold rounded-full">Top Rated</span>
                  )}
                  {t.verified && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Verified
                    </span>
                  )}
                </div>
                {/* Avatar overlapping banner — relative+z lifts it above the
                    `relative` banner, which otherwise paints over its top half. */}
                <div className="px-4 -mt-10 mb-3 relative z-10">
                  <img
                    src={t.profiles?.avatar_url || initialsAvatar(t.profiles?.full_name || 'T', '&background=0f766e&size=120&bold=true')}
                    alt={t.profiles?.full_name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = initialsAvatar(t.profiles?.full_name || 'T', '&background=0f766e&size=120&bold=true'); }}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-slate-100"
                  />
                </div>
                <div className="px-4 pb-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{t.profiles?.full_name}</h3>
                  <p className="text-sm text-emerald-600 font-medium">{(t.subjects || [t.subject]).join(', ')} Tutor</p>
                  {t.headline && <p className="text-sm text-slate-500 mt-1">{t.headline}</p>}
                  {t.bio && <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">{t.bio}</p>}

                  {/* Quick info chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {t.degree && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{t.degree}</span>}
                    {t.experience_years && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{t.experience_years}yr exp</span>}
                    {t.teaching_style && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">{t.teaching_style}</span>}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Stars rating={t.rating || 0} size={14} />
                    <span className="text-sm font-medium">{t.rating || 'New'}</span>
                    <span className="text-sm text-slate-400">({t.review_count || 0})</span>
                    {t.lessons_completed > 0 && <span className="text-sm text-slate-400">· {t.lessons_completed} lessons</span>}
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                    <span className="font-bold text-lg">KSh {t.hourly_rate?.toLocaleString() || '1,000'}<span className="text-sm font-normal text-slate-400">/hr</span></span>
                    <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg">View Profile</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Group Classes Section */}
        <GroupClassesBrowse user={user} setShowAuth={setShowAuth} />
      </div>
    </div>
  );
};

// ============ GROUP CLASSES BROWSE (Student-facing) ============
const GroupClassesBrowse = ({ user, setShowAuth }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | academic | interest
  const [catFilter, setCatFilter] = useState('');
  const [myEnrollments, setMyEnrollments] = useState({}); // group_class_id -> true
  const [payClass, setPayClass] = useState(null); // class being enrolled in

  const fetchClasses = useCallback(async () => {
    const { data } = await supabase
      .from('group_classes')
      .select('*, profiles:tutor_id(full_name, avatar_url), group_class_enrollments(id)')
      .eq('status', 'open')
      .gte('lesson_date', new Date().toISOString().split('T')[0])
      .order('lesson_date', { ascending: true });
    if (data) setClasses(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  // Which of these classes has the current student already joined?
  useEffect(() => {
    if (!user?.id) { setMyEnrollments({}); return; }
    supabase
      .from('group_class_enrollments')
      .select('group_class_id')
      .eq('student_id', user.id)
      .then(({ data }) => {
        if (data) setMyEnrollments(Object.fromEntries(data.map(e => [e.group_class_id, true])));
      });
  }, [user?.id, classes]);

  const handleEnrollClick = (gc) => {
    if (!user) { setShowAuth && setShowAuth('signup'); return; }
    setPayClass(gc);
  };

  const handleEnrolled = (classId) => {
    setMyEnrollments(prev => ({ ...prev, [classId]: true }));
    setPayClass(null);
    fetchClasses(); // refresh enrolment counts
  };

  const filtered = classes.filter(c => {
    const ctype = c.class_type || 'academic';
    if (typeFilter !== 'all' && ctype !== typeFilter) return false;
    if (typeFilter === 'academic' && subjectFilter && c.subject !== subjectFilter) return false;
    if (typeFilter === 'interest' && catFilter && c.category !== catFilter) return false;
    return true;
  });
  // Which interest categories actually have open clubs right now?
  const liveCats = INTEREST_CATEGORIES.filter(cat => classes.some(c => c.category === cat.key));

  if (loading) return null;
  if (classes.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Group Classes & Clubs</h2>
        <p className="text-slate-500 text-sm mt-1">Learn together for less — academic classes, or interest clubs kids join for fun.</p>
      </div>
      {/* Academic / Clubs toggle */}
      <div className="flex gap-2 mb-4">
        {[
          { v: 'all', t: 'All' },
          { v: 'academic', t: 'Academic' },
          { v: 'interest', t: '✨ Interest clubs' },
        ].map(o => (
          <button key={o.v} onClick={() => { setTypeFilter(o.v); setSubjectFilter(''); setCatFilter(''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${typeFilter === o.v ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            {o.t}
          </button>
        ))}
      </div>
      {/* Secondary filter: subjects for academic, category chips for clubs */}
      {typeFilter === 'academic' && (
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm mb-5">
          <option value="">All subjects</option>
          {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
      {typeFilter === 'interest' && liveCats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => setCatFilter('')}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${!catFilter ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>All clubs</button>
          {liveCats.map(cat => (
            <button key={cat.key} onClick={() => setCatFilter(cat.key)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${catFilter === cat.key ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(gc => {
          const enrolled = gc.group_class_enrollments?.length || 0;
          const spotsLeft = gc.max_students - enrolled;
          const isFull = spotsLeft <= 0;
          const isEnrolled = !!myEnrollments[gc.id];
          return (
            <div key={gc.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <img src={gc.profiles?.avatar_url || initialsAvatar(gc.profiles?.full_name || 'T')}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = initialsAvatar(gc.profiles?.full_name || 'T'); }}
                  alt={gc.profiles?.full_name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                <div>
                  <p className="font-medium text-slate-900 text-sm">{gc.profiles?.full_name}</p>
                  {gc.class_type === 'interest'
                    ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{categoryEmoji(gc.category)} {categoryLabel(gc.category)}</span>
                    : <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{gc.subject}</span>}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{gc.class_type === 'interest' && gc.recurring ? '🔁 ' : ''}{gc.title}</h3>
              {gc.description && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{gc.description}</p>}
              <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                <span>{new Date(gc.lesson_date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span>{gc.start_time} ({gc.duration_minutes} min)</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 mb-3">
                <div>
                  <span className="font-bold text-lg text-slate-900">KSh {gc.price_per_student}</span>
                  <span className="text-sm text-slate-400">/student</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${spotsLeft <= 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {isFull ? 'Full' : `${spotsLeft} spots left`}
                  </span>
                  <p className="text-xs text-slate-400">{enrolled}/{gc.max_students} enrolled</p>
                </div>
              </div>
              {isEnrolled ? (
                <div className="w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-emerald-50 text-emerald-700 flex items-center justify-center gap-1.5 mt-auto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Enrolled
                </div>
              ) : (
                <button
                  onClick={() => handleEnrollClick(gc)}
                  disabled={isFull}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors mt-auto ${
                    isFull ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {isFull ? 'Class Full' : user ? `Enrol · KSh ${gc.price_per_student}` : 'Sign in to enrol'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {payClass && (
        <GroupClassEnrollModal
          gc={payClass}
          user={user}
          onClose={() => setPayClass(null)}
          onSuccess={() => handleEnrolled(payClass.id)}
        />
      )}
    </div>
  );
};

// ============ GROUP CLASS ENROLMENT (Paystack + server verification) ============
const GroupClassEnrollModal = ({ gc, user, onClose, onSuccess }) => {
  const [step, setStep] = useState('confirm'); // confirm | processing | success | error
  const [error, setError] = useState('');
  const amount = Number(gc.price_per_student) || 0;
  const userEmail = user?.email || '';

  const pay = async () => {
    setError('');
    setStep('processing');
    const reference = `GRP-${gc.id?.slice(0, 8) || ''}-${user?.id?.slice(0, 6) || ''}`;

    // Free class — skip Paystack, enrol directly via the capacity-checked RPC.
    if (amount <= 0) {
      const { error: rpcErr } = await supabase.rpc('enroll_in_group_class', { p_class: gc.id, p_reference: reference, p_amount: 0 });
      if (rpcErr) { setError(rpcErr.message || 'Could not enrol.'); setStep('error'); return; }
      setStep('success');
      setTimeout(() => onSuccess && onSuccess(), 1200);
      return;
    }

    const result = await initiatePaystackPayment({
      email: userEmail,
      amount,
      reference,
      metadata: { group_class_id: gc.id, title: gc.title },
      onSuccess: async (response) => {
        // A paid enrolment is confirmed ONLY by the server (verify-payment
        // checks the Paystack reference + amount with the service role). If the
        // function can't be reached we do NOT self-confirm — the money is safe
        // with Paystack and the webhook/retry will reconcile it.
        let confirmed = false;
        try {
          const { data, error: vErr } = await supabase.functions.invoke('verify-payment', {
            body: { reference: response.reference, group_class_id: gc.id, student_id: user.id },
          });
          confirmed = !vErr && data?.verified === true;
        } catch (e) {
          confirmed = false;
        }

        if (!confirmed) {
          setError('Payment received — we’re confirming your place now. If it doesn’t appear in a minute, contact support with your M-Pesa message and we’ll sort it out.');
          setStep('error');
          return;
        }
        setStep('success');
        setTimeout(() => onSuccess && onSuccess(), 1500);
      },
      onClose: () => { setStep('confirm'); setError('Payment was cancelled. You can try again.'); },
    });

    if (!result.success) {
      setError(result.error || 'Failed to start payment');
      setStep('confirm');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">Join Group Class</h2>
              <p className="text-emerald-100 text-sm mt-1">{gc.title}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl">&#10005;</button>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold">KSh {amount.toLocaleString()}</span>
            <span className="text-emerald-100">/student</span>
          </div>
        </div>

        <div className="p-5">
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Tutor</span><span className="text-slate-900 font-medium">{gc.profiles?.full_name || 'Tutor'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Subject</span><span className="text-slate-900 font-medium">{gc.subject || 'General'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="text-slate-900 font-medium">{new Date(gc.lesson_date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="text-slate-900 font-medium">{gc.start_time} ({gc.duration_minutes} min)</span></div>
                <div className="border-t border-slate-200 pt-2 flex justify-between"><span className="text-slate-700 font-semibold">Total</span><span className="text-emerald-600 font-bold">KSh {amount.toLocaleString()}</span></div>
              </div>
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <button onClick={pay} className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
                {amount <= 0 ? 'Join for Free' : `Pay KSh ${amount.toLocaleString()}`}
              </button>
              {amount > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-400">Secured by</span>
                  <span className="text-xs font-semibold text-blue-600">Paystack</span>
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-500 text-sm">Confirming your enrolment…</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-semibold text-slate-900">You're enrolled!</h3>
              <p className="text-slate-500 text-sm">See you in class on {new Date(gc.lesson_date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
            </div>
          )}

          {step === 'error' && (
            <div className="py-6 space-y-4">
              <div className="p-4 bg-red-50 rounded-xl text-center text-red-600 text-sm">{error || 'Something went wrong.'}</div>
              <button onClick={() => { setStep('confirm'); setError(''); }} className="w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ TUTOR PROFILE VIEW ============
const TutorProfileView = ({ tutor, onBack, onBook, user, setShowAuth, onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booking, setBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch reviews for this tutor
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles:student_id(full_name, avatar_url)')
        .eq('tutor_id', tutor.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) setReviews(data);
      setLoadingReviews(false);
    };
    fetchReviews();
  }, [tutor.id]);
  
  const getSlots = (date) => {
    if (!date || !tutor.availability) return [];
    const dayAvail = tutor.availability.filter(a => a.day_of_week === date.getDay());
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return dayAvail.flatMap(a => {
      const slots = [];
      let h = parseInt(a.start_time.split(':')[0]);
      const end = parseInt(a.end_time.split(':')[0]);
      while (h < end) {
        // Don't offer slots that have already passed today.
        if (!isToday || h > now.getHours()) slots.push(`${h.toString().padStart(2, '0')}:00`);
        h++;
      }
      return slots;
    });
  };
  
  const slots = getSlots(selectedDate);

  const handleBook = async () => {
    if (!user) { setShowAuth('register'); return; }
    setBooking(true);
    try {
      // Create booking first (as pending)
      const bookingData = await onBook(tutor.id, tutor.subject, selectedDate.toISOString().split('T')[0], selectedTime);
      setPendingBooking({
        ...bookingData,
        id: bookingData?.id || Date.now().toString(),
        student_id: user.id,
        tutor_id: tutor.id,
        lesson_date: selectedDate.toISOString().split('T')[0],
        lesson_time: selectedTime,
      });
      setShowPayment(true);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setBooking(false);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setPendingBooking(null);
    // Navigate to student dashboard after successful payment
    if (onNavigate) {
      onNavigate('dashboard');
    } else {
      onBack();
    }
  };

  // Closing the payment modal WITHOUT paying: remove the just-created unpaid
  // booking so an abandoned checkout doesn't leave a phantom "pending" lesson
  // that looks booked. Best-effort and safe — only the student's own still
  // -pending row is removed (the UUID guard skips the non-DB fallback id, and
  // the status filter means a booking that just got confirmed is never deleted).
  const handlePaymentCancel = async () => {
    setShowPayment(false);
    const id = pendingBooking?.id;
    if (id && user?.id && /^[0-9a-f-]{36}$/i.test(String(id))) {
      try {
        await supabase.from('bookings').delete()
          .eq('id', id).eq('student_id', user.id).eq('status', 'pending');
      } catch (e) {
        console.warn('Could not clean up abandoned booking:', e);
      }
    }
    setPendingBooking(null);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Back button */}
      <div className="max-w-3xl mx-auto px-5 py-4">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm">
          ← Back to tutors
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-5 pb-20">
        {/* Header - photo banner + info */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8">
          <div className="h-28 bg-gradient-to-r from-emerald-500 to-emerald-600 relative">
            {tutor.verified && (
              <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified Tutor
              </span>
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-end gap-5 mb-4">
              <img
                src={tutor.profiles?.avatar_url || initialsAvatar(tutor.profiles?.full_name || 'T', '&size=160&bold=true')}
                alt={tutor.profiles?.full_name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = initialsAvatar(tutor.profiles?.full_name || 'T', '&size=160&bold=true'); }}
                className="w-28 h-28 -mt-14 relative z-10 rounded-full object-cover border-4 border-white shadow-lg bg-slate-100"
              />
              <div className="flex-1 pb-1">
                <h1 className="text-2xl font-bold text-slate-900">{tutor.profiles?.full_name}</h1>
                <p className="text-emerald-600 font-medium">{(tutor.subjects || [tutor.subject]).join(', ')} Tutor</p>
                {tutor.headline && <p className="text-slate-500 text-sm mt-0.5">{tutor.headline}</p>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <Stars rating={tutor.rating || 0} size={16} />
                <span className="font-medium text-sm">{tutor.rating || 'New'}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-sm">{tutor.review_count || 0} reviews</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-sm">{tutor.lessons_completed || 0} lessons</span>
              {tutor.experience_years && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-sm">{tutor.experience_years} years experience</span>
                </>
              )}
            </div>
            {/* Quick info chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {tutor.degree && <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{tutor.degree}</span>}
              {tutor.teaching_style && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">{tutor.teaching_style}</span>}
              {tutor.languages && (Array.isArray(tutor.languages) ? tutor.languages : [tutor.languages]).map(l => (
                <span key={l} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">{l}</span>
              ))}
              {gradeList(tutor.grade_levels).map(g => (
                <span key={g} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">{g}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left - main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* About */}
            {(tutor.bio || tutor.headline) && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">About me</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{tutor.bio || tutor.headline}</p>
              </div>
            )}

            {/* What I teach */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">What I teach</h2>
              <div className="flex flex-wrap gap-2">
                {[...new Set((Array.isArray(tutor.subjects) && tutor.subjects.length ? tutor.subjects : [tutor.subject]).filter(Boolean))].map(sub => (
                  <span key={sub} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">{sub}</span>
                ))}
                {tutor.specialties?.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Reviews {reviews.length > 0 && <span className="text-slate-400 font-normal">({reviews.length})</span>}
              </h2>
              {loadingReviews ? (
                <p className="text-slate-500">Loading...</p>
              ) : reviews.length === 0 ? (
                <p className="text-slate-500">No reviews yet</p>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.profiles?.full_name || 'S')}&background=64748b&color=fff`}
                          alt=""
                          className="w-9 h-9 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{review.profiles?.full_name}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Stars rating={review.rating} size={12} />
                            <span>{new Date(review.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      {review.text && <p className="text-slate-600 text-sm leading-relaxed">{review.text}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right - booking card */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <span className="text-2xl font-bold text-slate-900">KSh {tutor.hourly_rate?.toLocaleString()}</span>
                  <span className="text-slate-500 text-sm ml-1">/ hour</span>
                </div>
              </div>

              {/* Date picker */}
              <p className="text-sm font-medium text-slate-700 mb-2">Pick a day</p>
              <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                {days.map((d, i) => {
                  const hasSlots = getSlots(d).length > 0;
                  const isSelected = selectedDate?.toDateString() === d.toDateString();
                  return (
                    <button 
                      key={i} 
                      onClick={() => { setSelectedDate(d); setSelectedTime(null); }} 
                      disabled={!hasSlots}
                      className={`flex-shrink-0 w-12 py-2 rounded-lg text-center transition-colors ${
                        isSelected 
                          ? 'bg-slate-900 text-white' 
                          : hasSlots 
                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-700' 
                            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-xs">{d.toLocaleDateString('en', { weekday: 'short' }).slice(0,3)}</div>
                      <div className="font-semibold">{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              {selectedDate && slots.length > 0 && (
                <>
                  <p className="text-sm font-medium text-slate-700 mb-2">Pick a time</p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {slots.map(t => (
                      <button 
                        key={t} 
                        onClick={() => setSelectedTime(t)} 
                        className={`py-2 rounded-lg text-sm transition-colors ${
                          selectedTime === t 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Book button */}
              <button 
                onClick={handleBook} 
                disabled={!selectedTime || booking} 
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  selectedTime 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {booking ? 'Booking...' : selectedTime ? `Book for KSh ${tutor.hourly_rate?.toLocaleString()}` : 'Select a time to book'}
              </button>

              {/* Message button */}
              <button 
                onClick={async () => {
                  if (!user) { setShowAuth('register'); return; }
                  const result = await startConversation(user.id, tutor.user_id, `Hi! I'm interested in ${tutor.subject} lessons.`);
                  if (result.success) alert('Message sent! Check your messages.');
                }}
                className="w-full py-3 mt-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Send a message
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                You won't be charged until the lesson is confirmed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingBooking && (
        <PaymentModal
          booking={pendingBooking}
          tutor={tutor}
          user={user}
          onClose={handlePaymentCancel}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

// ============ NAVIGATION ============
const Nav = ({ user, profile, onNavigate, setShowAuth, scrolled, isAdmin }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-5 h-14 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <img src="/logo.png" alt="Tutagora" className="w-8 h-8 object-contain rounded-lg" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/favicon.svg'; }} />
          <span className={`font-semibold ${scrolled ? 'text-slate-900' : 'text-white'}`}>Tutagora</span>
        </button>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => onNavigate('tutors')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>Find Tutors</button>
          <button onClick={() => onNavigate('consulting')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>Consulting</button>
          <button onClick={() => onNavigate('clubs')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>Clubs</button>
          <button onClick={() => onNavigate('schools')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>For Schools</button>
          {isAdmin && <button onClick={() => onNavigate('admin')} className={`text-sm ${scrolled ? 'text-purple-600' : 'text-purple-300'}`}>Admin</button>}
          {user && profile?.role === 'student' && <MomentumChip userId={profile?.id} onClick={() => onNavigate('ai')} />}
          {user ? (
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
              <Avatar src={profile?.avatar_url} name={profile?.full_name} size={32} />
            </button>
          ) : (
            <>
              <button onClick={() => setShowAuth('login')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>Sign in</button>
              <button onClick={() => setShowAuth('register')} className={`px-4 py-2 rounded-full text-sm font-semibold ${scrolled ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>Get Started</button>
            </>
          )}
        </div>
        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {user && profile?.role === 'student' && <MomentumChip userId={profile?.id} onClick={() => onNavigate('ai')} />}
          {user && (
            <button onClick={() => onNavigate('dashboard')}>
              <Avatar src={profile?.avatar_url} name={profile?.full_name} size={28} />
            </button>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`p-1 ${scrolled ? 'text-slate-700' : 'text-white'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className={`md:hidden ${scrolled ? 'bg-white border-t border-slate-100' : 'bg-slate-900/95 backdrop-blur-sm'} px-4 py-4 space-y-2`}>
          <button onClick={() => { onNavigate('tutors'); setMobileOpen(false); }} className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>Find Tutors</button>
          <button onClick={() => { onNavigate('consulting'); setMobileOpen(false); }} className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>Consulting</button>
          <button onClick={() => { onNavigate('clubs'); setMobileOpen(false); }} className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>Clubs</button>
          <button onClick={() => { onNavigate('schools'); setMobileOpen(false); }} className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>For Schools</button>
          {isAdmin && <button onClick={() => { onNavigate('admin'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-purple-400 hover:bg-white/10">Admin</button>}
          {!user && (
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setShowAuth('login'); setMobileOpen(false); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${scrolled ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-white'}`}>Sign in</button>
              <button onClick={() => { setShowAuth('register'); setMobileOpen(false); }} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold">Get Started</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// ============ ADMIN DASHBOARD ============
const ADMIN_EMAILS = ['mutualevy@gmail.com'];

const AdminDashboard = ({ onLogout, onBack }) => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ tutors: 0, students: 0, bookings: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [allTutors, setAllTutors] = useState([]);
  const [verifyFilter, setVerifyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(null);
  const [remindedIds, setRemindedIds] = useState({}); // user id -> 'sending' | 'sent' | 'error'

  // Email a tutor who started signing up but never finished uploading docs.
  const handleRemindTutor = async (u) => {
    if (!u?.email) return;
    setRemindedIds(prev => ({ ...prev, [u.id]: 'sending' }));
    try {
      await sendEmail('tutor-document-reminder', u.email, { name: u.full_name || 'there' });
      setRemindedIds(prev => ({ ...prev, [u.id]: 'sent' }));
    } catch (e) {
      console.error('Reminder failed:', e);
      setRemindedIds(prev => ({ ...prev, [u.id]: 'error' }));
    }
  };

  const PLATFORM_FEE_PERCENT = 15;
  const TUTOR_SHARE_PERCENT = 100 - PLATFORM_FEE_PERCENT;

  // Verify admin access server-side before loading any data
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        setAuthorized(true);
        fetchAdminData();
      } else {
        setAuthorized(false);
        setLoading(false);
        onBack();
      }
    };
    checkAdmin();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);

    const [tutorsRes, studentsRes, bookingsRes, paymentsRes, pendingRes] = await Promise.all([
      supabase.from('tutors').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
      supabase.from('bookings').select('*, profiles:student_id(full_name, email), tutors(subject, hourly_rate, profiles(full_name, email))').order('created_at', { ascending: false }).limit(100),
      supabase.from('payments').select('*, bookings(lesson_date, subject, status), tutor:tutor_id(subject, hourly_rate, profiles(full_name, email, phone))').eq('status', 'completed').order('created_at', { ascending: false }),
      supabase.from('tutors').select('*, profiles(full_name, avatar_url, email)')
        .in('verification_status', ['pending', 'under_review'])
        .not('id_document_url', 'is', null)
        .not('bio', 'is', null)
        .order('created_at', { ascending: false }),
    ]);

    const totalRevenue = paymentsRes.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    setStats({
      tutors: tutorsRes.count || 0,
      students: studentsRes.count || 0,
      bookings: bookingsRes.data?.length || 0,
      revenue: totalRevenue,
    });

    setBookings(bookingsRes.data || []);
    setAllPayments(paymentsRes.data || []);
    setPendingTutors(pendingRes.data || []);

    // Fetch profiles and tutors separately and merge in code. The embedded
    // form (profiles.select('*, tutors(*)')) errors out when PostgREST can't
    // resolve the profiles→tutors relationship, which returned an EMPTY users
    // list even though the data exists. Two plain selects are robust.
    const [profilesRes, allTutorsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('tutors').select('*'),
    ]);

    if (profilesRes.error) console.warn('Admin profiles load error:', profilesRes.error.message);
    if (allTutorsRes.error) console.warn('Admin tutors load error:', allTutorsRes.error.message);

    // Index tutor rows by the profile/user id (schema uses tutors.id = user id,
    // and some rows also carry user_id — cover both).
    const tutorByUser = {};
    (allTutorsRes.data || []).forEach(t => {
      if (t.id) tutorByUser[t.id] = t;
      if (t.user_id) tutorByUser[t.user_id] = t;
    });
    const profileById = {};
    (profilesRes.data || []).forEach(p => { profileById[p.id] = p; });

    const merged = (profilesRes.data || []).map(p => ({
      ...p,
      tutors: tutorByUser[p.id] ? [tutorByUser[p.id]] : [],
    }));

    setUsers(merged);

    // Pending verification queue, derived the same robust way (the embedded
    // tutors→profiles query also fails, which emptied the Verification tab).
    // Every tutor with their profile + a derived status, so the admin can
    // review ALL of them (not just the pending queue).
    const tutorsDetailed = (allTutorsRes.data || []).map(t => ({
      ...t,
      profiles: profileById[t.id] || profileById[t.user_id] || null,
      _status: (!t.id_document_url || !t.bio)
        ? 'incomplete'
        : (t.verification_status || 'pending'),
    }));
    setAllTutors(tutorsDetailed);

    const pending = tutorsDetailed.filter(t => ['pending', 'under_review'].includes(t._status));
    setPendingTutors(pending);

    setLoading(false);
  };

  const handleMarkPaid = async (paymentId) => {
    setPayoutLoading(paymentId);
    await supabase.from('payments').update({ payout_status: 'paid', payout_date: new Date().toISOString() }).eq('id', paymentId);
    setAllPayments(prev => prev.map(p => p.id === paymentId ? { ...p, payout_status: 'paid', payout_date: new Date().toISOString() } : p));
    setPayoutLoading(null);
  };

  const handleMarkAllPaidForTutor = async (tutorId) => {
    setPayoutLoading(tutorId);
    const unpaid = allPayments.filter(p => p.tutor_id === tutorId && p.payout_status !== 'paid');
    for (const p of unpaid) {
      await supabase.from('payments').update({ payout_status: 'paid', payout_date: new Date().toISOString() }).eq('id', p.id);
    }
    setAllPayments(prev => prev.map(p => p.tutor_id === tutorId ? { ...p, payout_status: 'paid', payout_date: new Date().toISOString() } : p));
    setPayoutLoading(null);
  };

  const handleApproveTutor = async (tutorId) => {
    setActionLoading(tutorId);
    // Try updating by id first, then by user_id as fallback
    const { error } = await supabase.from('tutors').update({ verification_status: 'approved', verified: true, rejection_reason: null }).eq('id', tutorId);
    if (error) {
      await supabase.from('tutors').update({ verification_status: 'approved', verified: true, rejection_reason: null }).eq('user_id', tutorId);
    }
    // Send approval email
    const tutor = allTutors.find(t => t.id === tutorId);
    if (tutor?.profiles?.email) {
      try {
        await sendEmail('tutor-approved', tutor.profiles.email, { name: tutor.profiles.full_name });
      } catch (err) { console.error('Failed to send approval email:', err); }
    }
    setPendingTutors(prev => prev.filter(t => t.id !== tutorId));
    setAllTutors(prev => prev.map(t => t.id === tutorId ? { ...t, verification_status: 'approved', verified: true, _status: 'approved' } : t));
    setActionLoading(null);
  };

  const handleRejectTutor = async (tutorId) => {
    if (!rejectReason.trim()) return;
    setActionLoading(tutorId);
    const { error } = await supabase.from('tutors').update({ verification_status: 'rejected', verified: false, rejection_reason: rejectReason }).eq('id', tutorId);
    if (error) {
      await supabase.from('tutors').update({ verification_status: 'rejected', verified: false, rejection_reason: rejectReason }).eq('user_id', tutorId);
    }
    // Send rejection email
    const tutor = allTutors.find(t => t.id === tutorId);
    if (tutor?.profiles?.email) {
      try {
        await sendEmail('tutor-rejected', tutor.profiles.email, { name: tutor.profiles.full_name, reason: rejectReason });
      } catch (err) { console.error('Failed to send rejection email:', err); }
    }
    setPendingTutors(prev => prev.filter(t => t.id !== tutorId));
    setAllTutors(prev => prev.map(t => t.id === tutorId ? { ...t, verification_status: 'rejected', verified: false, rejection_reason: rejectReason, _status: 'rejected' } : t));
    setRejectingId(null);
    setRejectReason('');
    setActionLoading(null);
  };

  const verifyCounts = {
    all: allTutors.length,
    pending: allTutors.filter(t => t._status === 'pending' || t._status === 'under_review').length,
    incomplete: allTutors.filter(t => t._status === 'incomplete').length,
    approved: allTutors.filter(t => t._status === 'approved').length,
    rejected: allTutors.filter(t => t._status === 'rejected').length,
  };
  const shownTutors = allTutors.filter(t =>
    verifyFilter === 'all' ? true
    : verifyFilter === 'pending' ? (t._status === 'pending' || t._status === 'under_review')
    : t._status === verifyFilter
  );

  if (!authorized) return loading ? <LoadingSpinner /> : null;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-slate-400 hover:text-white">← Back</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold">T</div>
              <span className="font-semibold">Tutagora Admin</span>
            </div>
          </div>
          <button onClick={onLogout} className="text-slate-400 hover:text-white text-sm">Sign Out</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-200/50 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'payouts', label: `Payouts${allPayments.filter(p => p.payout_status !== 'paid').length ? ` (${allPayments.filter(p => p.payout_status !== 'paid').length})` : ''}` },
            { id: 'verification', label: `Verification${pendingTutors.length ? ` (${pendingTutors.length})` : ''}` },
            { id: 'users', label: 'Users' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'analytics', label: 'Analytics' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                tab === t.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {/* Overview Tab */}
            {tab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.tutors}</div>
                    <div className="text-sm text-slate-500">Total Tutors</div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.students}</div>
                    <div className="text-sm text-slate-500">Total Students</div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.bookings}</div>
                    <div className="text-sm text-slate-500">Total Bookings</div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">KSh {stats.revenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Revenue</div>
                  </div>
                </div>

                {/* Pending Payouts Alert */}
                {(() => {
                  const unpaidTotal = allPayments.filter(p => p.payout_status !== 'paid').reduce((s, p) => s + Math.round((p.amount || 0) * TUTOR_SHARE_PERCENT / 100), 0);
                  const unpaidCount = allPayments.filter(p => p.payout_status !== 'paid').length;
                  if (unpaidCount === 0) return null;
                  return (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                        <div>
                          <div className="font-semibold text-amber-800">KSh {unpaidTotal.toLocaleString()} in pending tutor payouts</div>
                          <div className="text-sm text-amber-600">{unpaidCount} lesson{unpaidCount !== 1 ? 's' : ''} need payout</div>
                        </div>
                      </div>
                      <button onClick={() => setTab('payouts')} className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600">
                        View Payouts
                      </button>
                    </div>
                  );
                })()}

                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-900">Recent Bookings</div>
                    <div className="divide-y divide-slate-100">
                      {bookings.slice(0, 5).map(b => (
                        <div key={b.id} className="px-5 py-4 flex justify-between items-center">
                          <div>
                            <div className="font-medium text-slate-900">{b.subject}</div>
                            <div className="text-sm text-slate-500">{b.lesson_date}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            b.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                            b.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>{b.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-4 border-b border-slate-100 font-semibold">New Users</div>
                    <div className="divide-y divide-slate-100">
                      {users.slice(0, 5).map(u => (
                        <div key={u.id} className="p-4 flex items-center gap-3">
                          <Avatar src={u.avatar_url} name={u.full_name} size={40} />
                          <div className="flex-1">
                            <div className="font-medium">{u.full_name}</div>
                            <div className="text-sm text-slate-500">{u.email}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            u.role === 'tutor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>{u.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (() => {
              const incompleteTutors = users.filter(u => u.role === 'tutor' && (() => { const t = u.tutors?.[0]; return !t || !t.bio || !t.id_document_url; })() && u.email);
              return (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 justify-between items-center">
                  <span className="font-semibold">All Users ({users.length})</span>
                  {incompleteTutors.length > 0 && (
                    <button
                      onClick={async () => { for (const u of incompleteTutors) { if (remindedIds[u.id] !== 'sent') await handleRemindTutor(u); } }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Remind {incompleteTutors.length} incomplete tutor{incompleteTutors.length !== 1 ? 's' : ''} to upload docs
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Joined</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => {
                        const tutor = u.tutors?.[0];
                        const isIncomplete = u.role === 'tutor' && (!tutor?.bio || !tutor?.id_document_url);
                        const status = u.role === 'student' ? null : !tutor ? 'no profile' : isIncomplete ? 'incomplete' : tutor.verification_status || 'pending';
                        const reminded = remindedIds[u.id];
                        return (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar src={u.avatar_url} name={u.full_name} size={36} />
                              <span className="font-medium">{u.full_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              u.role === 'tutor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3">
                            {status && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                status === 'incomplete' ? 'bg-red-100 text-red-600' :
                                status === 'no profile' ? 'bg-slate-100 text-slate-500' :
                                status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>{status}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-sm">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {isIncomplete && u.email ? (
                              <button
                                onClick={() => handleRemindTutor(u)}
                                disabled={reminded === 'sending' || reminded === 'sent'}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                  reminded === 'sent' ? 'bg-emerald-50 text-emerald-700 cursor-default' :
                                  reminded === 'error' ? 'bg-red-50 text-red-600' :
                                  'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                }`}
                              >
                                {reminded === 'sending' ? 'Sending…' : reminded === 'sent' ? '✓ Reminder sent' : reminded === 'error' ? 'Failed — retry' : 'Send reminder'}
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              );
            })()}

            {/* Payouts Tab */}
            {tab === 'payouts' && (() => {
              // Group payments by tutor
              const byTutor = {};
              allPayments.forEach(p => {
                const tid = p.tutor_id;
                if (!byTutor[tid]) {
                  byTutor[tid] = {
                    tutorId: tid,
                    tutorName: p.tutor?.profiles?.full_name || 'Unknown',
                    tutorEmail: p.tutor?.profiles?.email || '',
                    tutorPhone: p.tutor?.profiles?.phone || '',
                    payments: [],
                    totalRevenue: 0,
                    totalTutorShare: 0,
                    unpaidShare: 0,
                    paidShare: 0,
                  };
                }
                const share = Math.round((p.amount || 0) * TUTOR_SHARE_PERCENT / 100);
                byTutor[tid].payments.push(p);
                byTutor[tid].totalRevenue += (p.amount || 0);
                byTutor[tid].totalTutorShare += share;
                if (p.payout_status === 'paid') {
                  byTutor[tid].paidShare += share;
                } else {
                  byTutor[tid].unpaidShare += share;
                }
              });
              const tutorPayouts = Object.values(byTutor).sort((a, b) => b.unpaidShare - a.unpaidShare);
              const totalUnpaid = tutorPayouts.reduce((s, t) => s + t.unpaidShare, 0);
              const totalPaid = tutorPayouts.reduce((s, t) => s + t.paidShare, 0);
              const platformFees = allPayments.reduce((s, p) => s + Math.round((p.amount || 0) * PLATFORM_FEE_PERCENT / 100), 0);

              return (
                <div className="space-y-6">
                  {/* Payout summary cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <div className="text-sm text-slate-500 mb-1">Pending Payouts</div>
                      <div className="text-2xl font-bold text-amber-600">KSh {totalUnpaid.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">Owed to tutors</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <div className="text-sm text-slate-500 mb-1">Already Paid Out</div>
                      <div className="text-2xl font-bold text-emerald-600">KSh {totalPaid.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">Transferred via mobile money</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <div className="text-sm text-slate-500 mb-1">Platform Fees</div>
                      <div className="text-2xl font-bold text-purple-600">KSh {platformFees.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">{PLATFORM_FEE_PERCENT}% of revenue</div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <div className="text-sm text-slate-500 mb-1">Total Revenue</div>
                      <div className="text-2xl font-bold text-slate-900">KSh {stats.revenue.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">{allPayments.length} payments</div>
                    </div>
                  </div>

                  {/* Per-tutor payout table */}
                  {tutorPayouts.length === 0 ? (
                    <div className="bg-white rounded-xl p-10 shadow-sm text-center text-slate-500">No payments to process yet</div>
                  ) : (
                    tutorPayouts.map(tp => (
                      <div key={tp.tutorId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{tp.tutorName}</h3>
                            <div className="text-sm text-slate-500">{tp.tutorEmail}{tp.tutorPhone ? ` · ${tp.tutorPhone}` : ''}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-slate-500">Owed</div>
                              <div className={`font-bold ${tp.unpaidShare > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                KSh {tp.unpaidShare.toLocaleString()}
                              </div>
                            </div>
                            {tp.unpaidShare > 0 && (
                              <button
                                onClick={() => handleMarkAllPaidForTutor(tp.tutorId)}
                                disabled={payoutLoading === tp.tutorId}
                                className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                              >
                                {payoutLoading === tp.tutorId ? 'Marking...' : 'Mark All Paid'}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Subject</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Lesson Fee</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Tutor Share ({TUTOR_SHARE_PERCENT}%)</th>
                                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500 uppercase">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {tp.payments.map(p => {
                                const share = Math.round((p.amount || 0) * TUTOR_SHARE_PERCENT / 100);
                                const isPaid = p.payout_status === 'paid';
                                return (
                                  <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-600">{p.bookings?.lesson_date || new Date(p.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900">{p.bookings?.subject || '—'}</td>
                                    <td className="px-4 py-3 text-sm text-right text-slate-600">KSh {(p.amount || 0).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">KSh {share.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {isPaid ? 'Paid' : 'Pending'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      {!isPaid && (
                                        <button onClick={() => handleMarkPaid(p.id)} disabled={payoutLoading === p.id}
                                          className="text-xs text-emerald-600 font-medium hover:text-emerald-700 disabled:opacity-50">
                                          {payoutLoading === p.id ? '...' : 'Mark Paid'}
                                        </button>
                                      )}
                                      {isPaid && p.payout_date && (
                                        <span className="text-xs text-slate-400">{new Date(p.payout_date).toLocaleDateString()}</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })()}

            {/* Bookings Tab */}
            {tab === 'bookings' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold">All Bookings ({bookings.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tutor</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Subject</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Time</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{b.profiles?.full_name || '—'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{b.tutors?.profiles?.full_name || '—'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{b.subject}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{b.lesson_date}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{b.start_time?.slice(0, 5)}</td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600">KSh {(b.tutors?.hourly_rate || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Verification Tab */}
            {tab === 'verification' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="font-semibold text-slate-900 text-lg">Tutor Verifications</h3>
                  <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg flex-wrap">
                    {[['all','All'],['pending','Pending'],['incomplete','Incomplete'],['approved','Approved'],['rejected','Rejected']].map(([k,label]) => (
                      <button key={k} onClick={() => setVerifyFilter(k)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${verifyFilter===k ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>{label} ({verifyCounts[k]})</button>
                    ))}
                  </div>
                </div>
                {shownTutors.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                    <p className="text-slate-500">No tutors in this filter.</p>
                  </div>
                ) : (
                  shownTutors.map(t => (
                    <div key={t.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar src={t.profiles?.avatar_url} name={t.profiles?.full_name} size={48} />
                            <div>
                              <h4 className="font-semibold text-slate-900">{t.profiles?.full_name}</h4>
                              <p className="text-sm text-slate-500">{t.profiles?.email}</p>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                {(t.subjects || [t.subject]).map(s => (
                                  <span key={s} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>
                                ))}
                                <span className="text-xs text-slate-400">KSh {t.hourly_rate}/hr</span>
                              </div>
                              {t.phone_number && <p className="text-xs text-slate-500 mt-1">Phone: {t.phone_number}</p>}
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            t._status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                            t._status === 'incomplete' ? 'bg-slate-100 text-slate-500' :
                            t._status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>{t._status}</span>
                        </div>

                        {t.degree && <p className="mt-3 text-sm text-slate-600"><strong>Qualification:</strong> {t.degree}</p>}
                        {t.bio && <p className="mt-1 text-sm text-slate-500">{t.bio}</p>}

                        {/* Document links — uses signed URLs for private bucket */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          {t.id_document_url && (
                            <button onClick={async () => {
                              let path = t.id_document_url;
                              // If it's a full URL (legacy), extract the storage path from it
                              if (path.startsWith('http')) {
                                const match = path.match(/tutor-documents\/(.+)$/);
                                if (match) path = match[1];
                                else { window.open(path, '_blank'); return; }
                              }
                              const { data, error } = await supabase.storage.from('tutor-documents').createSignedUrl(path, 300);
                              if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                              else alert('Could not load document. ' + (error?.message || ''));
                            }}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors cursor-pointer">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                              View National ID
                            </button>
                          )}
                          {t.credential_url && (
                            <button onClick={async () => {
                              let path = t.credential_url;
                              // If it's a full URL (legacy), extract the storage path from it
                              if (path.startsWith('http')) {
                                const match = path.match(/tutor-documents\/(.+)$/);
                                if (match) path = match[1];
                                else { window.open(path, '_blank'); return; }
                              }
                              const { data, error } = await supabase.storage.from('tutor-documents').createSignedUrl(path, 300);
                              if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                              else alert('Could not load document. ' + (error?.message || ''));
                            }}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors cursor-pointer">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              View Certificate
                            </button>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-4 flex items-center gap-3">
                          {rejectingId === t.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                              <button onClick={() => handleRejectTutor(t.id)} disabled={!rejectReason.trim() || actionLoading === t.id}
                                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50">
                                Confirm
                              </button>
                              <button onClick={() => { setRejectingId(null); setRejectReason(''); }}
                                className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                            </div>
                          ) : (
                            <>
                              {t._status !== 'approved' && (
                                <button onClick={() => handleApproveTutor(t.id)} disabled={actionLoading === t.id}
                                  className="px-5 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50">
                                  {actionLoading === t.id ? 'Approving...' : 'Approve'}
                                </button>
                              )}
                              <button onClick={() => setRejectingId(t.id)}
                                className="px-5 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">
                                {t._status === 'approved' ? 'Revoke' : 'Reject'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {tab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold mb-4">Bookings by Status</h4>
                    <div className="space-y-3">
                      {['confirmed', 'completed', 'pending', 'cancelled'].map(status => {
                        const count = bookings.filter(b => b.status === status).length;
                        const percent = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
                        return (
                          <div key={status}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{status}</span>
                              <span className="text-slate-500">{count} ({percent}%)</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  status === 'completed' ? 'bg-emerald-500' :
                                  status === 'confirmed' ? 'bg-blue-500' :
                                  status === 'cancelled' ? 'bg-red-500' :
                                  'bg-amber-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold mb-4">Popular Subjects</h4>
                    <div className="space-y-3">
                      {Object.entries(
                        bookings.reduce((acc, b) => {
                          acc[b.subject] = (acc[b.subject] || 0) + 1;
                          return acc;
                        }, {})
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([subject, count]) => (
                          <div key={subject} className="flex justify-between items-center">
                            <span>{subject}</span>
                            <span className="px-2 py-1 bg-slate-100 rounded text-sm">{count}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h4 className="font-semibold mb-4">User Breakdown</h4>
                    <div className="flex items-center justify-center gap-8 py-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{stats.tutors}</div>
                        <div className="text-sm text-slate-500">Tutors</div>
                      </div>
                      <div className="w-px h-12 bg-slate-200" />
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{stats.students}</div>
                        <div className="text-sm text-slate-500">Students</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============ MAIN APP ============
function AppInner() {
  const auth = useAuth();
  const tutorId = auth.profile?.tutors?.[0]?.id;
  const { bookings, loading: bookingsLoading, createBooking, refetch: refetchBookings } = useBookings(auth.user?.id, auth.profile?.role, tutorId);
  
  const [page, setPage] = useState(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'consulting') return 'consulting';
    if (path === 'tutors') return 'tutors';
    if (path === 'teach') return 'teach';
    if (path === 'dashboard') return 'dashboard';
    if (path === 'ai') return 'ai';
    if (path === 'schools') return 'schools';
    if (path === 'clubs') return 'clubs';
    if (path === 'spreadsheet') return 'spreadsheet';
    if (path === 'admin') return 'admin';
    return 'home';
  });
  const [showAuth, setShowAuth] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(() => !localStorage.getItem('tutagora_privacy_accepted'));

  // Admin emails — ONLY these accounts can access the admin dashboard
  const ADMIN_LIST = ['mutualevy@gmail.com'];
  // Use auth.user.email (from Supabase auth, always reliable) — never trust profile email for admin checks
  const currentUserEmail = (auth.user?.email || '').toLowerCase();
  const isAdmin = currentUserEmail && ADMIN_LIST.includes(currentUserEmail);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Browser back/forward button support
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path === 'consulting') setPage('consulting');
      else if (path === 'tutors') setPage('tutors');
      else if (path === 'teach') setPage('teach');
      else if (path === 'dashboard') setPage('dashboard');
      else if (path === 'ai') setPage('ai');
      else if (path === 'schools') setPage('schools');
      else if (path === 'clubs') setPage('clubs');
      else if (path === 'spreadsheet') setPage('spreadsheet');
      else if (path === 'admin') setPage('admin');
      else if (path === 'privacy') setPage('privacy');
      else setPage('home');
      setSelectedTutor(null);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = (p) => { setPage(p); setSelectedTutor(null); window.scrollTo(0, 0); window.history.pushState({}, '', p === 'home' ? '/' : '/' + p); };
  const handleLogout = async () => { await auth.signOut(); setPage('home'); };
  const handleStartLesson = (booking) => {
    setActiveLesson(booking);
    // If tutor starts the lesson, notify the student
    if (auth.profile?.role === 'tutor') {
      sendLessonStartNotification(booking).catch(err => console.error('Lesson notification failed:', err));
    }
  };
  const handleEndLesson = async () => {
    // Mark booking as completed when lesson ends
    if (activeLesson?.id) {
      try {
        await supabase.from('bookings').update({ status: 'completed' }).eq('id', activeLesson.id);
        refetchBookings();
      } catch (err) {
        console.error('Error marking lesson as completed:', err);
      }
    }
    setActiveLesson(null);
  };
  const handleOpenMessages = () => setShowMessages(true);

  if (auth.loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  // Active video lesson
  if (activeLesson) {
    return <VideoRoom booking={activeLesson} user={{ id: auth.user?.id, name: auth.profile?.full_name, role: auth.profile?.role }} onEnd={handleEndLesson} />;
  }

  // Privacy Policy Page
  if (page === 'privacy') {
    return <PrivacyPolicyPage onBack={() => handleNavigate('home')} />;
  }

  // Consulting Page
  if (page === 'consulting') {
    return <ConsultingPage onBack={() => handleNavigate('home')} />;
  }

  // AI Tutor
  if (page === 'ai') {
    return <AIMastery onBack={() => handleNavigate('dashboard')} userId={auth.user?.id} studentName={auth.profile?.full_name} />;
  }

  // HOREB for Schools — B2B pitch page
  if (page === 'schools') {
    return <SchoolsPage onNavigate={handleNavigate} />;
  }

  // Interest-led clubs — discovery page
  if (page === 'clubs') {
    return <ClubsRoute user={auth.user} onNavigate={handleNavigate} setShowAuth={setShowAuth} />;
  }

  // Teacher / class insights dashboard
  if (page === 'classroom') {
    return <TeacherDashboard onBack={() => handleNavigate('dashboard')} teacherProfile={auth.profile} />;
  }

  // Spreadsheet
  if (page === 'spreadsheet') {
    return <Spreadsheet standalone={true} onBack={() => handleNavigate('dashboard')} />;
  }

  // Admin Dashboard — redirect non-admins
  if (page === 'admin') {
    if (!isAdmin) {
      handleNavigate('home');
      return null;
    }
    return <AdminDashboard onLogout={handleLogout} onBack={() => handleNavigate('home')} />;
  }

  // Dashboard routing
  if (auth.user && page === 'dashboard') {
    if (auth.profile?.role === 'tutor') {
      return (
        <>
          <TutorDashboard profile={auth.profile} bookings={bookings} bookingsLoading={bookingsLoading} onLogout={handleLogout} onStartLesson={handleStartLesson} onOpenMessages={handleOpenMessages} onRefreshProfile={auth.refetchProfile} onNavigate={handleNavigate} isAdmin={isAdmin} onOpenAccountSettings={() => setShowAccountSettings(true)} />
          {showMessages && <Messaging currentUser={auth.profile} onClose={() => setShowMessages(false)} />}
          {showAccountSettings && <AccountSettings profile={auth.profile} user={auth.user} onClose={() => setShowAccountSettings(false)} onLogout={handleLogout} />}
        </>
      );
    }
    return (
      <>
        <StudentDashboard profile={auth.profile} bookings={bookings} bookingsLoading={bookingsLoading} onNavigate={handleNavigate} onLogout={handleLogout} onStartLesson={handleStartLesson} onOpenMessages={handleOpenMessages} onRefreshProfile={auth.refetchProfile} isAdmin={isAdmin} onOpenAccountSettings={() => setShowAccountSettings(true)} />
        {showMessages && <Messaging currentUser={auth.profile} onClose={() => setShowMessages(false)} />}
        {showAccountSettings && <AccountSettings profile={auth.profile} user={auth.user} onClose={() => setShowAccountSettings(false)} onLogout={handleLogout} />}
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav user={auth.user} profile={auth.profile} onNavigate={handleNavigate} setShowAuth={setShowAuth} scrolled={scrolled || page !== 'home'} isAdmin={isAdmin} />
      
      {page === 'home' && !selectedTutor && <HomePage onNavigate={handleNavigate} setShowAuth={setShowAuth} />}
      {page === 'teach' && <TeachPage onNavigate={handleNavigate} setShowAuth={setShowAuth} />}
      {page === 'tutors' && !selectedTutor && <TutorsPage onSelectTutor={setSelectedTutor} onBack={() => handleNavigate('home')} user={auth.user} setShowAuth={setShowAuth} />}
      {selectedTutor && <TutorProfileView tutor={selectedTutor} onBack={() => setSelectedTutor(null)} onBook={createBooking} user={auth.user} setShowAuth={setShowAuth} onNavigate={handleNavigate} />}
      
      {showAuth && <AuthModal mode={typeof showAuth === 'object' ? showAuth.mode : showAuth} setMode={setShowAuth} onClose={() => setShowAuth(null)} onAuth={auth} initialRole={typeof showAuth === 'object' ? showAuth.role : undefined} />}
      {showAccountSettings && <AccountSettings profile={auth.profile} user={auth.user} onClose={() => setShowAccountSettings(false)} onLogout={handleLogout} />}
      {showPrivacyBanner && <PrivacyBanner onAccept={() => { localStorage.setItem('tutagora_privacy_accepted', 'true'); setShowPrivacyBanner(false); }} onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
