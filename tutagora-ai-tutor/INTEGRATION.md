# AI Tutor Integration Instructions

## Files Included
- **src/AIMastery.jsx** - The complete AI Math Tutor component (self-contained)

## How to Integrate

### Step 1: Copy AIMastery.jsx
Copy `src/AIMastery.jsx` to your project's `src/` folder.

### Step 2: Update App.jsx (3 changes)

**Change 1 - Add Import (at top of file, after other imports):**
\`\`\`javascript
import { AIMastery } from './AIMastery';
\`\`\`

**Change 2 - Add Route (in the main App component, after admin dashboard check):**
Find this section in your App() function:
\`\`\`javascript
  // Admin Dashboard
  if (page === 'admin' && isAdmin) {
    return <AdminDashboard onLogout={handleLogout} onBack={() => handleNavigate('home')} />;
  }
\`\`\`

Add this AFTER it:
\`\`\`javascript
  // AI Tutor
  if (page === 'ai') {
    return <AIMastery onBack={() => handleNavigate('dashboard')} />;
  }
\`\`\`

**Change 3 - Add Nav Link (in StudentDashboard header):**
Find this in the StudentDashboard header:
\`\`\`javascript
<button onClick={() => onNavigate('tutors')} className="text-sm text-slate-600">Find Tutors</button>
\`\`\`

Add this AFTER it:
\`\`\`javascript
<button onClick={() => onNavigate('ai')} className="text-sm text-emerald-600 font-medium">AI Tutor</button>
\`\`\`

### Step 3: (Optional) Add AI Tutor Card to Dashboard
In the StudentDashboard component, after the stats grid and before the main content grid, add:
\`\`\`javascript
{/* AI Tutor Card */}
<div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 mb-6 flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="text-4xl">🧠</div>
    <div>
      <h3 className="text-white font-bold text-lg">AI Math Tutor</h3>
      <p className="text-slate-300 text-sm">Adaptive learning that finds your gaps and fills them</p>
    </div>
  </div>
  <button 
    onClick={() => onNavigate('ai')} 
    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors"
  >
    Start Learning
  </button>
</div>
\`\`\`

## That's It!
The AI Tutor is self-contained - it includes all 35 skills, the adaptive engine, problem generators, and spaced repetition system in a single file.

Progress is saved to localStorage automatically.
