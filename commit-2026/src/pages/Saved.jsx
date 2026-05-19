import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowLeft, Clock, CheckCircle, MapPin, BellRing, Calendar } from 'lucide-react';
import { MOCK_TIPS } from './Home';
import '../App.css';

export default function Saved() {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [savedPostIds, setSavedPostIds] = useState(() => JSON.parse(localStorage.getItem('saved_posts') || '[]'));

  useEffect(() => {
    const fetchTips = () => {
      fetch('/api/tips')
        .then(res => res.json())
        .then(data => setTips(data))
        .catch(err => {
          console.error('Failed to load saved page tips:', err);
        });
    };

    fetchTips();
    const interval = setInterval(fetchTips, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUnsave = (id) => {
    const next = savedPostIds.filter(p => p !== id);
    setSavedPostIds(next);
    localStorage.setItem('saved_posts', JSON.stringify(next));
  };

  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem('post_reminders_map') || '{}'));
  const [activePickerId, setActivePickerId] = useState(null);

  const handleSaveReminder = async (id, dateTimeStr) => {
    setReminders(prev => {
      const next = { ...prev, [id]: dateTimeStr };
      localStorage.setItem('post_reminders_map', JSON.stringify(next));
      return next;
    });

    const userEmail = localStorage.getItem('user_email') || 'student@university.edu';
    const formatted = formatDateTime(dateTimeStr);
    
    try {
      await fetch(`/api/tips/${id}/reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, dateTimeStr })
      });
    } catch (err) {
      console.error('Failed to sync reminder with backend:', err);
    }

    alert(`📧 Email Scheduled Successfully!\n\nWe have scheduled a reminder email for this post. It will be sent to:\n➡️ ${userEmail}\n\nScheduled Time: ${formatted}`);
    setActivePickerId(null);
  };

  const handleRemoveReminder = async (id) => {
    setReminders(prev => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem('post_reminders_map', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`/api/tips/${id}/reminder`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to sync reminder deletion with backend:', err);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const savedTips = tips.filter(tip => savedPostIds.includes(tip.id));

  return (
    <div className="app-container animate-page-in" style={{ alignItems: 'center', paddingTop: '60px' }}>
      <button 
        className="btn-secondary" 
        style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Back to Feed
      </button>

      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h1 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>
          <Bookmark size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> 
          Saved Pages
        </h1>

        {savedTips.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bookmark size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>You haven't saved any posts yet.</p>
            <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Browse Intelligence Feed</button>
          </div>
        ) : (
          <div className="tips-container">
            {savedTips.map((tip, idx) => (
              <div key={tip.id} className="tip-card glass-panel animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="tip-header">
                  <div className="tip-meta">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>#{tip.id}</span>
                    <span className="tip-category">{tip.category}</span>
                    <span className={`urgency-badge urgency-${tip.urgency}`}>
                      <Clock size={14} /> 
                      {tip.urgency.toUpperCase()}
                    </span>
                  </div>
                  {tip.verified && (
                    <span className="verified-badge">
                      <CheckCircle size={14} /> Verified by Peers
                    </span>
                  )}
                </div>
                
                <h3 className="tip-title">{tip.title}</h3>
                <p className="tip-content">{tip.content}</p>
                
                <div className="tip-footer">
                  <div className="tip-footer-left" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                    <span className="tip-author" style={{ color: 'var(--secondary-accent)' }}>Posted by: {tip.author}</span>
                    <div className="tip-credibility" style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
                      {((tip.confirmedCount || 0) + (tip.outdatedCount || 0) + (tip.misleadingCount || 0)) === 0 ? (
                        <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>
                          Credibility: Pending (0 votes)
                        </span>
                      ) : (
                        <span style={{ fontWeight: 'bold', color: tip.credibilityScore >= 80 ? 'var(--urgency-low)' : (tip.credibilityScore >= 50 ? 'var(--urgency-med)' : 'var(--urgency-high)') }}>
                          Credibility: {tip.credibilityScore}/100
                        </span>
                      )}
                    </div>
                    <span className="tip-deadline" style={{ marginTop: '4px' }}>
                      <MapPin size={14} /> Deadline: {tip.deadline}
                    </span>
                  </div>
                  <div className="tip-tags">
                    {tip.tags.map(t => <span key={t} className="tag small">{t}</span>)}
                  </div>
                </div>

                <div className="tip-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleUnsave(tip.id)}
                    style={{ color: 'var(--primary-accent)' }}
                  >
                    <Bookmark size={16} fill="currentColor" /> Saved
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      if (reminders[tip.id]) {
                        handleRemoveReminder(tip.id);
                      } else {
                        setActivePickerId(activePickerId === tip.id ? null : tip.id);
                      }
                    }}
                    style={{ color: reminders[tip.id] ? 'var(--urgency-med)' : 'inherit', display: 'flex', gap: '6px', alignItems: 'center' }}
                  >
                    <BellRing size={16} fill={reminders[tip.id] ? 'currentColor' : 'none'} /> {reminders[tip.id] ? 'Reminder Set' : 'Set Reminder'}
                  </button>
                </div>

                {reminders[tip.id] && (
                  <div className="animate-slide-down" style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--urgency-med)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                    <span>🔔 Reminder Scheduled: {formatDateTime(reminders[tip.id])}</span>
                  </div>
                )}

                {activePickerId === tip.id && (
                  <div className="glass-panel animate-slide-down" style={{ marginTop: '12px', padding: '14px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Set Reminder:</span>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 10px' }}>
                      <Calendar size={14} style={{ color: 'var(--primary-accent)' }} />
                      <input 
                        type="date" 
                        id={`date-${tip.id}`}
                        className="glass-input" 
                        style={{ border: 'none', background: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 10px' }}>
                      <Clock size={14} style={{ color: 'var(--primary-accent)' }} />
                      <input 
                        type="time" 
                        id={`time-${tip.id}`}
                        className="glass-input" 
                        style={{ border: 'none', background: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none' }}
                      />
                    </div>

                    <button 
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => {
                        const dateVal = document.getElementById(`date-${tip.id}`).value;
                        const timeVal = document.getElementById(`time-${tip.id}`).value;
                        if (dateVal && timeVal) {
                          handleSaveReminder(tip.id, `${dateVal}T${timeVal}`);
                        } else {
                          alert('Please select both Date and Time.');
                        }
                      }}
                    >
                      Set
                    </button>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => setActivePickerId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
