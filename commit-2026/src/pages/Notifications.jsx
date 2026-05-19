import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Trash2 } from 'lucide-react';
import '../App.css';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Post Confirmed! ✅',
    message: 'Your tip on "Goldman Sachs Mock Interviews" has been confirmed by 5 senior peers.',
    time: '2 hours ago',
    read: false,
    type: 'confirm'
  },
  {
    id: 2,
    title: 'Upcoming Deadline ⚠️',
    message: 'Reminder: The application for "Google STEP Program" closes in 2 days.',
    time: '5 hours ago',
    read: false,
    type: 'deadline'
  },
  {
    id: 3,
    title: 'New Scholarship Alert 🎓',
    message: 'A new scholarship "First-Gen STEM Grant" was posted for CSE students.',
    time: '1 day ago',
    read: true,
    type: 'info'
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Bell size={24} style={{ verticalAlign: 'middle' }} /> 
            Notifications
          </h1>
          {notifications.length > 0 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" onClick={markAllAsRead} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                Mark all as read
              </button>
              <button className="btn-secondary" onClick={clearAll} style={{ fontSize: '0.85rem', padding: '6px 12px', color: 'var(--urgency-high)' }}>
                Clear all
              </button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>You have no notifications at the moment.</p>
            <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Back to Feed</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((notif, idx) => (
              <div 
                key={notif.id} 
                className="glass-panel animate-fade-in" 
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  borderLeft: notif.read ? '1px solid var(--border-color)' : '4px solid var(--primary-accent)',
                  background: notif.read ? 'var(--glass-bg)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  animationDelay: `${idx * 0.05}s`
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, marginRight: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1rem' }}>{notif.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {notif.time}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{notif.message}</p>
                </div>
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '6px' }}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
