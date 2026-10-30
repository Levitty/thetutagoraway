import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// The admin screen is lazy on purpose: it pulls in supabase-js, and the tenant
// page — loaded on a cheap phone, on mobile data, possibly every month — must
// not carry the landlord's bundle to show a meter number box.
const Admin = lazy(() => import('./Admin.jsx'));

const isAdmin = window.location.pathname.replace(/\/+$/, '').endsWith('/admin')
  || new URLSearchParams(window.location.search).has('admin');

createRoot(document.getElementById('root')).render(
  isAdmin
    ? <Suspense fallback={null}><Admin /></Suspense>
    : <App />
);
