import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

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
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*, tutors(*)')
      .eq('id', userId)
      .single();
    
    if (data) setProfile(data);
    setLoading(false);
  };

  const signUp = async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, signUp, signIn, signOut, refetchProfile: () => user && fetchProfile(user.id) };
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
      .eq('verified', true)
      .order('rating', { ascending: false });
    
    if (data) setTutors(data);
    setLoading(false);
  };

  return { tutors, loading, refetch: fetchTutors };
};

const useBookings = (userId, role) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    let query = supabase
      .from('bookings')
      .select(`*, tutors(*, profiles(full_name, avatar_url)), profiles!bookings_student_id_fkey(full_name, avatar_url)`)
      .order('lesson_date', { ascending: true });
    
    if (role === 'tutor') {
      const { data: tutorData } = await supabase.from('tutors').select('id').eq('user_id', userId).single();
      if (tutorData) query = query.eq('tutor_id', tutorData.id);
    } else {
      query = query.eq('student_id', userId);
    }

    const { data, error } = await query;
    if (data) setBookings(data);
    setLoading(false);
  };

  const createBooking = async (tutorId, subject, date, time) => {
    const { data, error } = await supabase.from('bookings').insert({
      student_id: userId,
      tutor_id: tutorId,
      subject,
      lesson_date: date,
      start_time: time,
      status: 'confirmed'
    }).select().single();
    
    if (error) throw error;
    fetchBookings();
    return data;
  };

  return { bookings, loading, createBooking, refetch: fetchBookings };
};

// ============ AUTH MODAL ============
const AuthModal = ({ mode, setMode, onClose, onAuth }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (mode === 'register') {
        await onAuth.signUp(form.email, form.password, form.name, form.role);
        alert('Check your email for confirmation link!');
        onClose();
      } else {
        await onAuth.signIn(form.email, form.password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">T</div>
          <h2 className="text-xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg" required />
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm({ ...form, role: 'student' })} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${form.role === 'student' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Student</button>
                <button type="button" onClick={() => setForm({ ...form, role: 'tutor' })} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${form.role === 'tutor' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Tutor</button>
              </div>
            </>
          )}
          <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg" />
          <input type="password" placeholder="Password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-500">
          {mode === 'login' ? "No account? " : "Have an account? "}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-emerald-600 font-semibold">{mode === 'login' ? 'Sign up' : 'Sign in'}</button>
        </p>
      </div>
    </div>
  );
};

// ============ STUDENT DASHBOARD ============
const StudentDashboard = ({ profile, bookings, bookingsLoading, onNavigate, onLogout }) => {
  const [tab, setTab] = useState('upcoming');
  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const past = bookings.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">T</div>
            <span className="font-semibold">Tutagora</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('tutors')} className="text-sm text-slate-600">Find Tutors</button>
            <div className="flex items-center gap-2">
              <Avatar src={profile?.avatar_url} name={profile?.full_name} size={32} />
              <span className="text-sm font-medium hidden sm:block">{profile?.full_name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6">
        <h1 className="text-xl font-bold mb-1">Welcome back, {profile?.full_name?.split(' ')[0]}! 👋</h1>
        <p className="text-slate-500 text-sm mb-6">Manage your lessons and track progress</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: '📚', val: past.length, label: 'Completed' },
            { icon: '📅', val: upcoming.length, label: 'Upcoming' },
            { icon: '⭐', val: '4.8', label: 'Avg Rating' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold">{s.val}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button onClick={() => setTab('upcoming')} className={`flex-1 py-3 text-sm font-medium ${tab === 'upcoming' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-500'}`}>Upcoming ({upcoming.length})</button>
              <button onClick={() => setTab('history')} className={`flex-1 py-3 text-sm font-medium ${tab === 'history' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-500'}`}>History ({past.length})</button>
            </div>

            {bookingsLoading ? <LoadingSpinner /> : (
              tab === 'upcoming' ? (
                upcoming.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="text-3xl mb-2">📅</div>
                    <p className="text-slate-500">No upcoming lessons</p>
                    <button onClick={() => onNavigate('tutors')} className="mt-3 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg">Find a Tutor</button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {upcoming.map(b => (
                      <div key={b.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={b.tutors?.profiles?.avatar_url} name={b.tutors?.profiles?.full_name} size={44} />
                          <div>
                            <div className="font-medium">{b.subject}</div>
                            <div className="text-sm text-slate-500">{b.tutors?.profiles?.full_name} • {b.lesson_date} at {b.start_time?.slice(0,5)}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
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
                        <span className="text-xs text-emerald-600">Completed</span>
                      </div>
                    ))}
                  </div>
                )
              )
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold mb-3">Account</h3>
              <div className="space-y-1">
                {['👤 Edit Profile', '💳 Payments', '🔔 Notifications'].map((item, i) => (
                  <button key={i} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">{item}</button>
                ))}
                <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">🚪 Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ TUTOR DASHBOARD ============
const TutorDashboard = ({ profile, bookings, bookingsLoading, onLogout }) => {
  const [tab, setTab] = useState('overview');
  const tutor = profile?.tutors?.[0];
  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completed = bookings.filter(b => b.status === 'completed');

  if (!tutor) return <div className="p-8 text-center">Setting up your tutor profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-slate-900 text-white p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold">T</div>
          <div><div className="font-semibold text-sm">Tutagora</div><div className="text-xs text-slate-400">Tutor Portal</div></div>
        </div>
        <nav className="space-y-1">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'students', icon: '👥', label: 'Students' },
            { id: 'earnings', icon: '💰', label: 'Earnings' },
            { id: 'profile', icon: '👤', label: 'Profile' },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${tab === item.id ? 'bg-white/10' : 'text-slate-400 hover:text-white'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size={32} />
            <div className="flex-1 min-w-0 text-xs font-medium truncate">{profile?.full_name}</div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-5">
          <h1 className="font-semibold">{tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
          <button onClick={onLogout} className="text-sm text-slate-500">Sign out</button>
        </header>

        <div className="p-5">
          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: '👥', val: tutor.students_total || 0, label: 'Students' },
                  { icon: '📚', val: tutor.lessons_completed || 0, label: 'Lessons' },
                  { icon: '⭐', val: tutor.rating || 'N/A', label: 'Rating' },
                  { icon: '💰', val: `KSh ${(completed.length * tutor.hourly_rate).toLocaleString()}`, label: 'Earned' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className="text-xl font-bold">{s.val}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-4 border-b border-slate-100 font-semibold">Upcoming Lessons</div>
                {bookingsLoading ? <LoadingSpinner /> : upcoming.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No upcoming lessons</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {upcoming.map(b => (
                      <div key={b.id} className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar src={b.profiles?.avatar_url} name={b.profiles?.full_name} size={40} />
                          <div>
                            <div className="font-medium">{b.subject}</div>
                            <div className="text-sm text-slate-500">{b.profiles?.full_name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{b.lesson_date}</div>
                          <div className="text-xs text-slate-500">{b.start_time?.slice(0,5)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'students' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
              Student management coming soon
            </div>
          )}

          {tab === 'earnings' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Total Earned</div>
                  <div className="text-2xl font-bold">KSh {(completed.length * tutor.hourly_rate).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Hourly Rate</div>
                  <div className="text-2xl font-bold">KSh {tutor.hourly_rate?.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Lessons Completed</div>
                  <div className="text-2xl font-bold">{completed.length}</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <TutorProfileEditor tutor={tutor} profile={profile} />
          )}
        </div>
      </main>
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
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('tutors')
      .update(form)
      .eq('id', tutor.id);
    
    setSaving(false);
    setMessage(error ? 'Error saving' : 'Saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-4 mb-6">
        <Avatar src={profile?.avatar_url} name={profile?.full_name} size={64} />
        <div>
          <h3 className="font-bold text-lg">{profile?.full_name}</h3>
          <p className="text-slate-500 text-sm">{profile?.email}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Headline</label>
          <input value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Making calculus intuitive" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Degree / Qualification</label>
          <input value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hourly Rate (KSh)</label>
          <input type="number" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-emerald-500 text-white font-semibold rounded-lg disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {message && <p className="text-center text-sm text-emerald-600">{message}</p>}
      </div>
    </div>
  );
};

// ============ HOME PAGE ============
const HomePage = ({ onNavigate, setShowAuth }) => (
  <>
    <section className="min-h-screen flex items-center bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="max-w-6xl mx-auto px-5 py-32 relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Now with real accounts!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Learn from Kenya's <span className="text-emerald-400">best tutors</span></h1>
          <p className="mt-5 text-lg text-slate-300">One-on-one lessons with verified tutors. Book instantly, learn from anywhere.</p>
          <div className="flex gap-4 mt-8">
            <button onClick={() => onNavigate('tutors')} className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full">Find a Tutor</button>
            <button onClick={() => setShowAuth('register')} className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20">Get Started</button>
          </div>
        </div>
      </div>
    </section>
    <footer className="bg-slate-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold">T</div><span className="font-semibold">Tutagora</span></div>
        <p className="text-slate-400 text-sm">Made with ❤️ in Nairobi</p>
      </div>
    </footer>
  </>
);

// ============ TUTORS PAGE ============
const TutorsPage = ({ onSelectTutor, onBack }) => {
  const { tutors, loading } = useTutors();
  const [search, setSearch] = useState('');
  
  const filtered = tutors.filter(t => 
    t.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-5">
        <button onClick={onBack} className="text-slate-500 mb-4 flex items-center gap-1"><span>←</span> Back</button>
        <h1 className="text-2xl font-bold mb-4">Find a Tutor</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tutors..." className="w-full max-w-sm px-4 py-2.5 border border-slate-200 rounded-lg mb-6" />
        
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No tutors found. Check back soon!</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map(t => (
              <div key={t.id} onClick={() => onSelectTutor(t)} className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center">
                  <Avatar src={t.profiles?.avatar_url} name={t.profiles?.full_name} size={80} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{t.profiles?.full_name}</h3>
                  <p className="text-sm text-slate-500">{t.subject}</p>
                  {t.headline && <p className="text-sm text-slate-600 mt-1">{t.headline}</p>}
                  <div className="flex items-center gap-2 mt-2"><Stars rating={t.rating || 0} /><span className="text-sm">{t.rating || 'New'}</span></div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-slate-100">
                    <span className="font-bold">{t.currency} {t.hourly_rate?.toLocaleString()}</span>
                    <span className="text-sm text-slate-400">/hr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============ TUTOR PROFILE VIEW ============
const TutorProfileView = ({ tutor, onBack, onBook, user, setShowAuth }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booking, setBooking] = useState(false);
  
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
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
      await onBook(tutor.id, tutor.subject, selectedDate.toISOString().split('T')[0], selectedTime);
      alert('Booking confirmed!');
      onBack();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setBooking(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-5">
        <button onClick={onBack} className="text-slate-500 mb-4 flex items-center gap-1"><span>←</span> Back</button>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex gap-4">
                <Avatar src={tutor.profiles?.avatar_url} name={tutor.profiles?.full_name} size={72} />
                <div>
                  <h1 className="text-xl font-bold">{tutor.profiles?.full_name}</h1>
                  <p className="text-slate-500">{tutor.degree || tutor.subject}</p>
                  <div className="flex items-center gap-2 mt-2"><Stars rating={tutor.rating || 0} /><span className="font-medium">{tutor.rating || 'New'}</span><span className="text-slate-400">({tutor.review_count || 0} reviews)</span></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-slate-600 text-sm">{tutor.bio || tutor.headline || 'No bio yet.'}</p>
              {tutor.specialties?.length > 0 && (
                <>
                  <h3 className="font-semibold mt-4 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">{tutor.specialties.map((s, i) => <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">{s}</span>)}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-slate-200 h-fit sticky top-20">
            <div className="text-center pb-4 border-b border-slate-100 mb-4">
              <div className="text-2xl font-bold">{tutor.currency} {tutor.hourly_rate?.toLocaleString()}</div>
              <div className="text-sm text-slate-500">per hour</div>
            </div>
            <h4 className="font-medium text-sm mb-2">Select date</h4>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {days.map((d, i) => {
                const hasSlots = getSlots(d).length > 0;
                const isSelected = selectedDate?.toDateString() === d.toDateString();
                return (
                  <button key={i} onClick={() => { setSelectedDate(d); setSelectedTime(null); }} disabled={!hasSlots} 
                    className={`py-2 rounded-lg text-center text-xs ${isSelected ? 'bg-emerald-500 text-white' : hasSlots ? 'bg-slate-50 hover:bg-slate-100' : 'text-slate-300'}`}>
                    <div>{d.toLocaleDateString('en', { weekday: 'short' }).slice(0,2)}</div>
                    <div className="font-semibold">{d.getDate()}</div>
                  </button>
                );
              })}
            </div>
            {selectedDate && slots.length > 0 && (
              <>
                <h4 className="font-medium text-sm mb-2">Select time</h4>
                <div className="grid grid-cols-3 gap-1 mb-4">
                  {slots.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)} className={`py-2 rounded-lg text-sm ${selectedTime === t ? 'bg-emerald-500 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>{t}</button>
                  ))}
                </div>
              </>
            )}
            <button onClick={handleBook} disabled={!selectedTime || booking} className={`w-full py-3 rounded-lg font-semibold ${selectedTime ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {booking ? 'Booking...' : selectedTime ? 'Book Lesson' : 'Select a time'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ NAVIGATION ============
const Nav = ({ user, profile, onNavigate, setShowAuth, scrolled }) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
    <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
      <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${scrolled ? 'bg-slate-900 text-white' : 'bg-white/10 text-white'}`}>T</div>
        <span className={`font-semibold ${scrolled ? 'text-slate-900' : 'text-white'}`}>Tutagora</span>
      </button>
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('tutors')} className={`text-sm ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>Find Tutors</button>
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
    </div>
  </nav>
);

// ============ MAIN APP ============
export default function App() {
  const auth = useAuth();
  const { bookings, loading: bookingsLoading, createBooking } = useBookings(auth.user?.id, auth.profile?.role);
  
  const [page, setPage] = useState('home');
  const [showAuth, setShowAuth] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleNavigate = (p) => { setPage(p); setSelectedTutor(null); window.scrollTo(0, 0); };
  const handleLogout = async () => { await auth.signOut(); setPage('home'); };

  if (auth.loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  // Dashboard routing
  if (auth.user && page === 'dashboard') {
    if (auth.profile?.role === 'tutor') {
      return <TutorDashboard profile={auth.profile} bookings={bookings} bookingsLoading={bookingsLoading} onLogout={handleLogout} />;
    }
    return <StudentDashboard profile={auth.profile} bookings={bookings} bookingsLoading={bookingsLoading} onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      <Nav user={auth.user} profile={auth.profile} onNavigate={handleNavigate} setShowAuth={setShowAuth} scrolled={scrolled || page !== 'home'} />
      
      {page === 'home' && !selectedTutor && <HomePage onNavigate={handleNavigate} setShowAuth={setShowAuth} />}
      {page === 'tutors' && !selectedTutor && <TutorsPage onSelectTutor={setSelectedTutor} onBack={() => handleNavigate('home')} />}
      {selectedTutor && <TutorProfileView tutor={selectedTutor} onBack={() => setSelectedTutor(null)} onBook={createBooking} user={auth.user} setShowAuth={setShowAuth} />}
      
      {showAuth && <AuthModal mode={showAuth} setMode={setShowAuth} onClose={() => setShowAuth(null)} onAuth={auth} />}
    </div>
  );
}
