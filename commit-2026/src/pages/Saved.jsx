import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowLeft, Clock, CheckCircle, MapPin } from 'lucide-react';
import { MOCK_TIPS } from './Home';
import '../App.css';

export default function Saved() {
  const navigate = useNavigate();
  const [savedPostIds, setSavedPostIds] = useState(() => JSON.parse(localStorage.getItem('saved_posts') || '[]'));

  const handleUnsave = (id) => {
    const next = savedPostIds.filter(p => p !== id);
    setSavedPostIds(next);
    localStorage.setItem('saved_posts', JSON.stringify(next));
  };

  const savedTips = MOCK_TIPS.filter(tip => savedPostIds.includes(tip.id));

  return (
    <div className="app-container" style={{ alignItems: 'center', paddingTop: '60px' }}>
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
                      <span style={{ fontWeight: 'bold', color: tip.credibilityScore >= 80 ? 'var(--urgency-low)' : (tip.credibilityScore >= 50 ? 'var(--urgency-med)' : 'var(--urgency-high)') }}>
                        Credibility: {tip.credibilityScore}/100
                      </span>
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
                  <button className="action-btn upvote">
                    ▲ {tip.upvotes}
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleUnsave(tip.id)}
                    style={{ color: 'var(--primary-accent)' }}
                  >
                    <Bookmark size={16} fill="currentColor" /> Saved
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
