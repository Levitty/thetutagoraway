// Local preview only (not committed): the learner's home with example data.
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { StudentHome } from './family/StudentSpace.jsx';
const q = new URLSearchParams(location.search);
const grade = Number(q.get('grade') || 5);
const mode = { name: grade === 7 ? 'Wanjiru Kamau' : 'Amani Otieno', grade, learnerId: 'preview-' + grade };
createRoot(document.getElementById('root')).render(<StudentHome mode={mode} bookings={[]} onPractice={() => alert('Practice')} onWriting={() => alert('Writing')} onJoin={() => {}} onLock={() => {}} />);
