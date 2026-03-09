import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { VideoRoom } from './VideoRoom';
import { PaymentModal } from './PaymentModal';
import { Messaging, MessageButton, startConversation } from './Messaging';
import { AIMastery } from './ai-tutor/AIMastery.jsx';
import { ConsultingPage } from './ConsultingPage.jsx';
import { Spreadsheet } from './Spreadsheet.jsx';
import { sendEmail } from './email.js';

// ============ LOTTIE ANIMATION COMPONENT ============
const Lottie = ({ src, width = 200, height = 200, loop = true }) => {
  useEffect(() => {
    if (!document.querySelector('script[src*="lottie-player"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <lottie-player
      src={src}
      background="transparent"
      speed="1"
      style={{ width, height }}
      loop={loop}
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

const Avatar = ({ src, name, size = 40 }) => (
  <img src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=10b981&color=fff`} alt={name} className="rounded-full object-cover bg-slate-200" style={{ width: size, height: size }} />
);

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
      if (session?.user) fetchProfile(session.user.id);
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

    // 1. Send in-app message to tutor
    if (tutorUserId) {
      await supabase.from('messages').insert({
        sender_id: studentId,
        receiver_id: tutorUserId,
        content: `New Booking\n\nHi ${tutorName.split(' ')[0]}, I've booked a ${subject} lesson with you on ${lessonDate} at ${lessonTime}.\n\nLooking forward to our session!\n\n- ${studentName}`
      });
    }

    // Email notifications are sent after payment success in PaymentModal
    console.log('Booking in-app notification sent successfully');
  } catch (err) {
    console.error('Error sending booking notifications:', err);
  }
};

// ============ AUTH MODAL ============
const AuthModal = ({ mode, setMode, onClose, onAuth }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
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
    setLoading(true);
    try {
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
          {view === 'register' && (
            <>
              <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" required />
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm({ ...form, role: 'student' })} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${form.role === 'student' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  I'm a Student
                </button>
                <button type="button" onClick={() => setForm({ ...form, role: 'tutor' })} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${form.role === 'tutor' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  I'm a Tutor
                </button>
              </div>
            </>
          )}
          <input type="email" placeholder="Email address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          {view !== 'forgot' && (
            <input type="password" placeholder="Password (min 6 characters)" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
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
const StudentDashboard = ({ profile, bookings, bookingsLoading, onNavigate, onLogout, onStartLesson, onOpenMessages, onRefreshProfile, isAdmin }) => {
  const [tab, setTab] = useState('upcoming');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [payments, setPayments] = useState([]);
  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const past = bookings.filter(b => b.status === 'completed');
  const nextLesson = [...upcoming].sort((a, b) => `${a.lesson_date}${a.start_time}`.localeCompare(`${b.lesson_date}${b.start_time}`))[0];
  const totalSpent = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const uniqueTutors = [...new Set(past.map(b => b.tutor_id))].length;

  useEffect(() => {
    if (profile?.id) {
      supabase.from('payments').select('amount, status, created_at').eq('student_id', profile.id).eq('status', 'completed')
        .then(({ data }) => setPayments(data || []));
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
            <button onClick={() => onNavigate('ai')} className="text-sm text-emerald-600 font-medium">AI Tutor</button>
            <button onClick={() => onNavigate('spreadsheet')} className="text-sm text-blue-600 font-medium hidden sm:block">Spreadsheet</button>
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

        {/* AI Tutor Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl sm:text-4xl">🧠</div>
            <div>
              <h3 className="text-white font-bold text-lg">AI Math Tutor</h3>
              <p className="text-slate-300 text-sm hidden sm:block">Adaptive learning that finds your gaps and fills them</p>
            </div>
          </div>
          <button onClick={() => onNavigate('ai')} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors text-sm">
            Start Learning
          </button>
        </div>

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
    grade_levels: '',
    phone_number: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.avatar_url || null);
  const [idFile, setIdFile] = useState(null);
  const [credentialFile, setCredentialFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file, folder) => {
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/${folder}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('tutor-documents').upload(path, file);
    if (error) throw new Error(`Upload failed: ${error.message}`);
    const { data: urlData } = supabase.storage.from('tutor-documents').getPublicUrl(path);
    return urlData.publicUrl;
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
        languages: form.languages,
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

      onComplete();
    } catch (err) {
      console.error('Error creating tutor profile:', err);
      setError(err.message || 'Failed to create profile');
    }
    setSaving(false);
  };

  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'];

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
              <label className="block text-sm font-medium text-slate-700 mb-1">Grade levels you teach</label>
              <input type="text" value={form.grade_levels} onChange={(e) => setForm({ ...form, grade_levels: e.target.value })}
                placeholder="e.g. Grade 4-8, Form 1-4, University"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
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
                  <div><strong>Weekly Payouts:</strong> Earnings are paid out every Friday via M-Pesa to your registered phone number.</div>
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
              <span className="text-sm text-slate-700">I have read and agree to the <strong>Terms of Engagement</strong>. I understand the platform fee structure and the code of conduct.</span>
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

// ============ TUTOR DASHBOARD ============
const TutorDashboard = ({ profile, bookings, bookingsLoading, onLogout, onStartLesson, onOpenMessages, onRefreshProfile, onNavigate, isAdmin }) => {
  const [tab, setTab] = useState('overview');
  const tutor = profile?.tutors?.[0];
  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completed = bookings.filter(b => b.status === 'completed');

  // Show onboarding if no tutor profile exists
  if (!tutor) {
    return <TutorOnboarding profile={profile} onComplete={onRefreshProfile} />;
  }

  // Verification status
  const verificationStatus = tutor.verification_status || (tutor.verified ? 'approved' : 'pending');
  const isPending = verificationStatus === 'pending';
  const isRejected = verificationStatus === 'rejected';
  const isApproved = verificationStatus === 'approved';

  const VerificationBanner = () => {
    if (isApproved) return null;
    if (isRejected) return (
      <div className="mx-4 lg:mx-0 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <div>
            <h4 className="font-semibold text-red-800">Verification Rejected</h4>
            <p className="text-sm text-red-600 mt-1">{tutor.rejection_reason || 'Your application was not approved. Please re-upload your documents.'}</p>
            <button onClick={() => { /* Could trigger re-onboarding */ }} className="mt-2 text-sm font-medium text-red-700 underline">Re-submit documents</button>
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

  // Group classes state
  const [groupClasses, setGroupClasses] = useState([]);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [classForm, setClassForm] = useState({ title: '', description: '', subject: '', max_students: 10, price_per_student: 500, lesson_date: '', start_time: '09:00', duration_minutes: 60 });
  const [classLoading, setClassLoading] = useState(false);

  useEffect(() => {
    if (tutor?.id && isApproved) {
      supabase.from('group_classes').select('*, group_class_enrollments(id, student_id, profiles:student_id(full_name))').eq('tutor_id', tutor.id).order('lesson_date', { ascending: true }).then(({ data }) => {
        if (data) setGroupClasses(data);
      });
    }
  }, [tutor?.id, isApproved]);

  const handleCreateGroupClass = async (e) => {
    e.preventDefault();
    setClassLoading(true);
    const { data, error } = await supabase.from('group_classes').insert({
      tutor_id: tutor.id,
      ...classForm,
      price_per_student: parseInt(classForm.price_per_student),
      max_students: parseInt(classForm.max_students),
      duration_minutes: parseInt(classForm.duration_minutes),
    }).select('*, group_class_enrollments(id)').single();
    if (data) {
      setGroupClasses(prev => [...prev, data]);
      setShowCreateClass(false);
      setClassForm({ title: '', description: '', subject: '', max_students: 10, price_per_student: 500, lesson_date: '', start_time: '09:00', duration_minutes: 60 });
    }
    if (error) console.error('Error creating group class:', error);
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
            <button onClick={() => onNavigate && onNavigate('spreadsheet')} className="text-sm text-blue-600 font-medium hidden sm:block">Spreadsheet</button>
            {isAdmin && <button onClick={() => onNavigate && onNavigate('admin')} className="text-sm text-purple-600 font-medium hidden sm:block">Admin</button>}
            <MessageButton onClick={onOpenMessages} />
            <button onClick={onLogout} className="text-sm text-slate-500 hover:text-slate-700">Sign out</button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <VerificationBanner />
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 flex items-center gap-4 text-white">
                <Lottie src={ANIMATIONS.teacher} width={80} height={80} />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Class Title *</label>
                      <input type="text" value={classForm.title} onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                        placeholder="e.g. KCSE Mathematics Revision" required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea value={classForm.description} onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                        placeholder="What will students learn in this class?" rows={3}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                      <select value={classForm.subject} onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })} required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">Select subject</option>
                        {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
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
          <div className="text-xs text-slate-400 mt-1">Awaiting M-Pesa transfer</div>
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
            <p className="text-sm text-blue-600 mt-1">Tutors receive {tutorSharePercent}% of each lesson fee. Payouts are processed weekly via M-Pesa. Tutagora retains {PLATFORM_FEE_PERCENT}% as a platform fee.</p>
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
    grade_levels: tutor?.grade_levels || '',
  });
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
          <input value={form.grade_levels} onChange={e => setForm({ ...form, grade_levels: e.target.value })} placeholder="e.g. Grade 4-8, Form 1-4" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
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
    { num: '2', title: 'Book a Lesson', desc: 'Pick a time that works for you and pay securely via M-Pesa or card' },
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
    { q: 'How do I book a lesson?', a: 'Simply find a tutor, select an available time slot, and pay via M-Pesa or card. You\'ll receive a confirmation with a link to join the video lesson.' },
    { q: 'What if I\'m not satisfied with a lesson?', a: 'We offer a 48-hour money-back guarantee. If you\'re not happy with your first lesson with a tutor, we\'ll refund you in full.' },
    { q: 'How do video lessons work?', a: 'Lessons happen via our built-in video platform. Both you and your tutor can share screens, use a virtual whiteboard, and chat in real-time.' },
    { q: 'Can I reschedule a lesson?', a: 'Yes! You can reschedule up to 24 hours before the lesson starts at no extra cost.' },
    { q: 'How do tutors get paid?', a: 'Tutors receive payments weekly via M-Pesa. We handle all the payment processing securely.' },
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
              <button onClick={() => setShowAuth('register')} className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-colors text-sm sm:text-base">
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
                <Lottie src={ANIMATIONS.search} width={120} height={120} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Find a Tutor</h3>
              <p className="text-slate-500">Browse our verified tutors by subject, price, and availability</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <Lottie src={ANIMATIONS.calendar} width={120} height={120} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book a Lesson</h3>
              <p className="text-slate-500">Pick a time that works for you and pay securely via M-Pesa or card</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <Lottie src={ANIMATIONS.videoCall} width={120} height={120} />
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
                <li><button onClick={() => setShowAuth('register')} className="hover:text-white">Become a Tutor</button></li>
                <li><button className="hover:text-white">Tutor Guidelines</button></li>
                <li><button className="hover:text-white">Payment Info</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>📧 hello@tutagora.com</li>
                <li>📱 +254 700 000 000</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2024 Tutagora. All rights reserved.</p>
            <p className="text-slate-500 text-sm">Made in Nairobi</p>
          </div>
        </div>
      </footer>
    </>
  );
};

// ============ TUTORS PAGE ============
const TutorsPage = ({ onSelectTutor, onBack }) => {
  const { tutors, loading } = useTutors();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const subjects = ['All Subjects', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'];
  
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
      
      // Price filter
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const rate = t.hourly_rate || 0;
        if (priceRange === '0-1000') matchesPrice = rate < 1000;
        else if (priceRange === '1000-1500') matchesPrice = rate >= 1000 && rate < 1500;
        else if (priceRange === '1500-2000') matchesPrice = rate >= 1500 && rate < 2000;
        else if (priceRange === '2000+') matchesPrice = rate >= 2000;
      }
      
      return matchesSearch && matchesSubject && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-low') return (a.hourly_rate || 0) - (b.hourly_rate || 0);
      if (sortBy === 'price-high') return (b.hourly_rate || 0) - (a.hourly_rate || 0);
      if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0);
      return 0;
    });

  const activeFilters = (selectedSubject && selectedSubject !== 'All Subjects' ? 1 : 0) + (priceRange !== 'all' ? 1 : 0);

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
                onClick={() => { setSelectedSubject(''); setPriceRange('all'); setSearch(''); }}
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
              <div key={t.id} onClick={() => onSelectTutor(t)} className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all">
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
                {/* Avatar overlapping banner */}
                <div className="px-4 -mt-10 mb-3">
                  <img
                    src={t.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.profiles?.full_name || 'T')}&background=10b981&color=fff&size=120&bold=true`}
                    alt={t.profiles?.full_name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>
                <div className="px-4 pb-4">
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
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="font-bold text-lg">KSh {t.hourly_rate?.toLocaleString() || '1,000'}<span className="text-sm font-normal text-slate-400">/hr</span></span>
                    <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg">View Profile</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Group Classes Section */}
        <GroupClassesBrowse />
      </div>
    </div>
  );
};

// ============ GROUP CLASSES BROWSE (Student-facing) ============
const GroupClassesBrowse = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase
        .from('group_classes')
        .select('*, profiles:tutor_id(full_name, avatar_url), group_class_enrollments(id)')
        .eq('status', 'open')
        .gte('lesson_date', new Date().toISOString().split('T')[0])
        .order('lesson_date', { ascending: true });
      if (data) setClasses(data);
      setLoading(false);
    };
    fetchClasses();
  }, []);

  const filtered = subjectFilter ? classes.filter(c => c.subject === subjectFilter) : classes;

  if (loading) return null;
  if (classes.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Group Classes</h2>
          <p className="text-slate-500 text-sm mt-1">Join a class with other students at a lower price</p>
        </div>
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm">
          <option value="">All Subjects</option>
          {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Kiswahili', 'History', 'Geography', 'Computer Science', 'Business Studies'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(gc => {
          const enrolled = gc.group_class_enrollments?.length || 0;
          const spotsLeft = gc.max_students - enrolled;
          return (
            <div key={gc.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <img src={gc.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(gc.profiles?.full_name || 'T')}&background=10b981&color=fff`}
                  alt={gc.profiles?.full_name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-slate-900 text-sm">{gc.profiles?.full_name}</p>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{gc.subject}</span>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{gc.title}</h3>
              {gc.description && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{gc.description}</p>}
              <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                <span>{new Date(gc.lesson_date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span>{gc.start_time} ({gc.duration_minutes} min)</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div>
                  <span className="font-bold text-lg text-slate-900">KSh {gc.price_per_student}</span>
                  <span className="text-sm text-slate-400">/student</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${spotsLeft <= 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {spotsLeft} spots left
                  </span>
                  <p className="text-xs text-slate-400">{enrolled}/{gc.max_students} enrolled</p>
                </div>
              </div>
            </div>
          );
        })}
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
    return dayAvail.flatMap(a => {
      const slots = [];
      let h = parseInt(a.start_time.split(':')[0]);
      const end = parseInt(a.end_time.split(':')[0]);
      while (h < end) { slots.push(`${h.toString().padStart(2, '0')}:00`); h++; }
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
            <div className="flex items-end gap-5 -mt-14 mb-4">
              <img
                src={tutor.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.profiles?.full_name || 'T')}&background=10b981&color=fff&size=160&bold=true`}
                alt={tutor.profiles?.full_name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
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
              {tutor.languages && <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">{tutor.languages}</span>}
              {tutor.grade_levels && <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">{tutor.grade_levels}</span>}
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
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">{tutor.subject}</span>
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
          onClose={() => setShowPayment(false)}
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
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${scrolled ? 'bg-slate-900 text-white' : 'bg-white/10 text-white'}`}>T</div>
          <span className={`font-semibold ${scrolled ? 'text-slate-900' : 'text-white'}`}>Tutagora</span>
        </button>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => onNavigate('tutors')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>Find Tutors</button>
          <button onClick={() => onNavigate('consulting')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>Consulting</button>
          {isAdmin && <button onClick={() => onNavigate('admin')} className={`text-sm ${scrolled ? 'text-purple-600' : 'text-purple-300'}`}>Admin</button>}
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
const AdminDashboard = ({ onLogout, onBack }) => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ tutors: 0, students: 0, bookings: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(null);

  const PLATFORM_FEE_PERCENT = 15;
  const TUTOR_SHARE_PERCENT = 100 - PLATFORM_FEE_PERCENT;

  useEffect(() => {
    fetchAdminData();
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

    const { data: usersData } = await supabase
      .from('profiles')
      .select('*, tutors(*)')
      .order('created_at', { ascending: false })
      .limit(100);

    setUsers(usersData || []);
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
    await supabase.from('tutors').update({ verification_status: 'approved', verified: true, rejection_reason: null }).eq('id', tutorId);
    // Send approval email
    const tutor = pendingTutors.find(t => t.id === tutorId);
    if (tutor?.profiles?.email) {
      try {
        await sendEmail('tutor-approved', tutor.profiles.email, { name: tutor.profiles.full_name });
      } catch (err) { console.error('Failed to send approval email:', err); }
    }
    setPendingTutors(prev => prev.filter(t => t.id !== tutorId));
    setActionLoading(null);
  };

  const handleRejectTutor = async (tutorId) => {
    if (!rejectReason.trim()) return;
    setActionLoading(tutorId);
    await supabase.from('tutors').update({ verification_status: 'rejected', verified: false, rejection_reason: rejectReason }).eq('id', tutorId);
    // Send rejection email
    const tutor = pendingTutors.find(t => t.id === tutorId);
    if (tutor?.profiles?.email) {
      try {
        await sendEmail('tutor-rejected', tutor.profiles.email, { name: tutor.profiles.full_name, reason: rejectReason });
      } catch (err) { console.error('Failed to send rejection email:', err); }
    }
    setPendingTutors(prev => prev.filter(t => t.id !== tutorId));
    setRejectingId(null);
    setRejectReason('');
    setActionLoading(null);
  };

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
                          <div className="text-sm text-amber-600">{unpaidCount} lesson{unpaidCount !== 1 ? 's' : ''} need payout via M-Pesa</div>
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
            {tab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-semibold">All Users ({users.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => (
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
                          <td className="px-4 py-3 text-slate-500 text-sm">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
                      <div className="text-xs text-slate-400 mt-1">Transferred via M-Pesa</div>
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
                <h3 className="font-semibold text-slate-900 text-lg">Pending Tutor Verifications</h3>
                {pendingTutors.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                    <svg className="w-12 h-12 text-emerald-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-slate-500">No pending verifications. All caught up!</p>
                  </div>
                ) : (
                  pendingTutors.map(t => (
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
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">{t.verification_status}</span>
                        </div>

                        {t.degree && <p className="mt-3 text-sm text-slate-600"><strong>Qualification:</strong> {t.degree}</p>}
                        {t.bio && <p className="mt-1 text-sm text-slate-500">{t.bio}</p>}

                        {/* Document links */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          {t.id_document_url && (
                            <a href={t.id_document_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                              View National ID
                            </a>
                          )}
                          {t.credential_url && (
                            <a href={t.credential_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              View Certificate
                            </a>
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
                              <button onClick={() => handleApproveTutor(t.id)} disabled={actionLoading === t.id}
                                className="px-5 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50">
                                {actionLoading === t.id ? 'Approving...' : 'Approve'}
                              </button>
                              <button onClick={() => setRejectingId(t.id)}
                                className="px-5 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">
                                Reject
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
export default function App() {
  const auth = useAuth();
  const tutorId = auth.profile?.tutors?.[0]?.id;
  const { bookings, loading: bookingsLoading, createBooking, refetch: refetchBookings } = useBookings(auth.user?.id, auth.profile?.role, tutorId);
  
  const [page, setPage] = useState(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'consulting') return 'consulting';
    if (path === 'tutors') return 'tutors';
    if (path === 'dashboard') return 'dashboard';
    if (path === 'ai') return 'ai';
    if (path === 'spreadsheet') return 'spreadsheet';
    if (path === 'admin') return 'admin';
    return 'home';
  });
  const [showAuth, setShowAuth] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showMessages, setShowMessages] = useState(false);

  // Admin emails (add your email here)
  const adminEmails = ['tutaeducators@gmail.com', 'mutualevy@gmail.com'];
  const isAdmin = auth.profile?.email && adminEmails.includes(auth.profile.email);

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
      else if (path === 'dashboard') setPage('dashboard');
      else if (path === 'ai') setPage('ai');
      else if (path === 'spreadsheet') setPage('spreadsheet');
      else if (path === 'admin') setPage('admin');
      else setPage('home');
      setSelectedTutor(null);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = (p) => { setPage(p); setSelectedTutor(null); window.scrollTo(0, 0); window.history.pushState({}, '', p === 'home' ? '/' : '/' + p); };
  const handleLogout = async () => { await auth.signOut(); setPage('home'); };
  const handleStartLesson = (booking) => setActiveLesson(booking);
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

  // Consulting Page
  if (page === 'consulting') {
    return <ConsultingPage onBack={() => handleNavigate('home')} />;
  }

  // AI Tutor
  if (page === 'ai') {
    return <AIMastery onBack={() => handleNavigate('dashboard')} userId={auth.user?.id} />;
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
          <TutorDashboard profile={auth.profile} bookings={bookings} bookingsLoading={bookingsLoading} onLogout={handleLogout} onStartLesson={handleStartLesson} onOpenMessages={handleOpenMessages} onRefreshProfile={auth.refetchProfile} onNavigate={handleNavigate} isAdmin={isAdmin} />
          {showMessages && <Messaging currentUser={auth.profile} onClose={() => setShowMessages(false)} />}
        </>
      );
    }
    return (
      <>
        <StudentDashboard profile={auth.profile} bookings={bookings} bookingsLoading={bookingsLoading} onNavigate={handleNavigate} onLogout={handleLogout} onStartLesson={handleStartLesson} onOpenMessages={handleOpenMessages} onRefreshProfile={auth.refetchProfile} isAdmin={isAdmin} />
        {showMessages && <Messaging currentUser={auth.profile} onClose={() => setShowMessages(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav user={auth.user} profile={auth.profile} onNavigate={handleNavigate} setShowAuth={setShowAuth} scrolled={scrolled || page !== 'home'} isAdmin={isAdmin} />
      
      {page === 'home' && !selectedTutor && <HomePage onNavigate={handleNavigate} setShowAuth={setShowAuth} />}
      {page === 'tutors' && !selectedTutor && <TutorsPage onSelectTutor={setSelectedTutor} onBack={() => handleNavigate('home')} />}
      {selectedTutor && <TutorProfileView tutor={selectedTutor} onBack={() => setSelectedTutor(null)} onBook={createBooking} user={auth.user} setShowAuth={setShowAuth} onNavigate={handleNavigate} />}
      
      {showAuth && <AuthModal mode={showAuth} setMode={setShowAuth} onClose={() => setShowAuth(null)} onAuth={auth} />}
    </div>
  );
}
