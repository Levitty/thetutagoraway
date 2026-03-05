# Tutagora AI Math Tutor Integration

## Files Included
- `AIMastery.jsx` - The complete AI tutor component (self-contained)
- `App.jsx.patch` - Shows exactly what to change in your App.jsx

## Quick Integration (3 steps)

### Step 1: Copy the file
Copy `AIMastery.jsx` to your `src/` folder:
```
tutagora-app/
  src/
    App.jsx
    AIMastery.jsx  ← put it here
    supabase.js
    ...
```

### Step 2: Add import to App.jsx
At the top of your App.jsx, add this import (line 6):
```javascript
import { AIMastery } from './AIMastery';
```

### Step 3: Add route in App.jsx
Find the `// Dashboard routing` section in your App.jsx (around line 2900) and add the AI route BEFORE the dashboard check:

```javascript
  // AI Tutor route
  if (page === 'ai') {
    return <AIMastery onBack={() => handleNavigate('home')} />;
  }

  // Admin Dashboard (existing code)
  if (page === 'admin' && isAdmin) {
```

That's it! The nav links are already in the StudentDashboard component.

## What the AI Tutor Does

1. **Diagnostic Test** - 16 adaptive questions to find student's level
2. **Gap Detection** - Identifies weak prerequisites blocking progress
3. **Personalized Path** - Recommends what to learn next
4. **Spaced Repetition** - Reviews skills before they decay
5. **35 Math Skills** - Grade 6-7 Kenya CBC aligned

## Access
Students can access via:
- Dashboard → "AI Tutor" button in header
- Dashboard → "Start Learning" on the AI card
