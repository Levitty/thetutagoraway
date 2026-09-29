// Lesson notes: the whiteboard pages saved at the end of a lesson, shown to
// the family on their dashboard. Stored privately in the "lesson-notes"
// bucket under <booking id>/page-<n>.jpg; only the family, the tutor and
// admins can see them, and the family can delete them.
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const bucket = () => supabase.storage.from('lesson-notes');
const pageNo = (name) => Number((name.match(/page-(\d+)/) || [])[1] || 0);

// Which of these lessons have notes: { bookingId: ['page-1.jpg', ...] }.
export function useLessonNotes(bookingIds) {
  const [notes, setNotes] = useState({});
  const key = bookingIds.join(',');
  useEffect(() => {
    if (!bookingIds.length) return;
    let alive = true;
    Promise.all(bookingIds.map(id => bucket().list(id, { limit: 50 })
      .then(({ data }) => [id, (data || []).map(f => f.name).filter(n => /^page-\d+\.jpg$/.test(n)).sort((a, b) => pageNo(a) - pageNo(b))])
      .catch(() => [id, []])))
      .then(rows => { if (alive) setNotes(Object.fromEntries(rows.filter(([, files]) => files.length))); });
    return () => { alive = false; };
  }, [key]);
  return [notes, setNotes];
}

export function LessonNotesModal({ booking, files, onClose, onDeleted }) {
  const [urls, setUrls] = useState([]);
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => {
    const paths = files.map(f => `${booking.id}/${f}`);
    bucket().createSignedUrls(paths, 3600).then(({ data, error }) => {
      if (error) setErr("The notes couldn't be opened. Please try again.");
      else setUrls((data || []).map(d => d.signedUrl).filter(Boolean));
    });
  }, [booking.id, files.join(',')]);

  const remove = async () => {
    if (!window.confirm('Delete these lesson notes? This cannot be undone.')) return;
    setBusy(true);
    const { error } = await bucket().remove(files.map(f => `${booking.id}/${f}`));
    setBusy(false);
    if (error) { setErr("They couldn't be deleted. Please try again."); return; }
    onDeleted?.(); onClose();
  };

  const tutor = booking.tutors?.profiles?.full_name || 'the tutor';
  return (
    <div className="tg-modal" onClick={onClose}>
      <div className="sheet notes" onClick={e => e.stopPropagation()} role="dialog" aria-label="Lesson notes">
        <button type="button" className="close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="kicker">Lesson notes</div>
        <h2 className="display">{booking.subject}{booking.learner_name ? ` with ${booking.learner_name}` : ''}</h2>
        <p className="muted" style={{ margin: '0 0 14px', fontWeight: 600 }}>The whiteboard from {tutor}'s lesson on {booking.lesson_date}.</p>
        {err && <div className="msg err">{err}</div>}
        {urls.length > 0 ? (
          <>
            <div className="notepage"><img src={urls[i]} alt={`Page ${i + 1} of the whiteboard`} /></div>
            {urls.length > 1 && (
              <div className="notenav">
                <button type="button" className="btn line sm" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</button>
                <span>Page {i + 1} of {urls.length}</span>
                <button type="button" className="btn line sm" disabled={i >= urls.length - 1} onClick={() => setI(i + 1)}>Next</button>
              </div>
            )}
            <div className="noteacts">
              <a className="btn sm" href={urls[i]} download={`lesson-${booking.lesson_date}-page-${i + 1}.jpg`} target="_blank" rel="noreferrer">Save this page</a>
              <button type="button" className="linkbtn" onClick={remove} disabled={busy}>{busy ? 'Deleting…' : 'Delete these notes'}</button>
            </div>
          </>
        ) : !err && <p className="muted">Opening the notes…</p>}
      </div>
    </div>
  );
}
