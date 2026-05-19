import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, FileText, BookOpen, GraduationCap, ArrowLeft, LogOut, Edit2, Save, Camera, X, Upload } from 'lucide-react';
import '../App.css';

const PRESET_AVATARS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
];

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);

  // Manage Profile Data
  const [student, setStudent] = useState({
    name: localStorage.getItem('user_name') || "Jane Doe",
    branch: localStorage.getItem('user_branch') || "CSE",
    year: localStorage.getItem('user_year') || "2",
    avatar: localStorage.getItem('user_avatar') || ""
  });

  const [myTips, setMyTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch full user profile details on mount to sync with database
  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      fetch(`/api/users/profile?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setStudent({
              name: data.name || localStorage.getItem('user_name') || "Jane Doe",
              branch: data.branch || localStorage.getItem('user_branch') || "CSE",
              year: data.year || localStorage.getItem('user_year') || "2",
              avatar: data.avatar || localStorage.getItem('user_avatar') || ""
            });
            // Update local storage to keep in sync
            if (data.name) localStorage.setItem('user_name', data.name);
            if (data.branch) localStorage.setItem('user_branch', data.branch);
            if (data.year) localStorage.setItem('user_year', data.year);
            localStorage.setItem('user_avatar', data.avatar || '');
          }
        })
        .catch(err => console.error('Failed to fetch profile details on load:', err));
    }
  }, []);

  useEffect(() => {
    fetch('/api/tips')
      .then(res => res.json())
      .then(data => {
        const currentUser = localStorage.getItem('user_name') || 'Jane Doe';
        const filtered = data.filter(t => t.author === currentUser || t.author.includes('(You)'));
        setMyTips(filtered);
      })
      .catch(err => console.error('Failed to fetch tips:', err));
  }, []);

  const totalMyPosts = myTips.length;
  const totalCred = myTips.reduce((acc, tip) => acc + (tip.credibilityScore || 0), 0);
  const avgCredibility = totalMyPosts > 0 ? Math.round(totalCred / totalMyPosts) : 0;



  const handleSaveEdit = async (id) => {
    const titleVal = document.getElementById(`edit-title-${id}`).value;
    const contentVal = document.getElementById(`edit-content-${id}`).value;
    const categoryVal = document.getElementById(`edit-category-${id}`).value;
    const urgencyVal = document.getElementById(`edit-urgency-${id}`).value;
    const deadlineVal = document.getElementById(`edit-deadline-${id}`).value;

    if (!titleVal || !contentVal) {
      alert('Title and Content cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`/api/tips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleVal,
          content: contentVal,
          category: categoryVal.charAt(0).toUpperCase() + categoryVal.slice(1),
          urgency: urgencyVal,
          deadline: deadlineVal || 'TBA'
        })
      });
      const updatedTip = await res.json();
      setMyTips(prev => prev.map(t => t.id === id ? { ...t, ...updatedTip } : t));
      setEditingTipId(null);
    } catch (err) {
      console.error('Failed to update tip:', err);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    
    const email = localStorage.getItem('user_email') || 'student@university.edu';
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: student.name,
          branch: student.branch,
          year: student.year,
          avatar: student.avatar
        })
      });
      const data = await res.json();
      if (!data.error) {
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_branch', data.branch);
        localStorage.setItem('user_year', data.year);
        localStorage.setItem('user_avatar', data.avatar || '');
      }
    } catch (err) {
      console.error('Failed to save profile updates:', err);
      // Fallback
      localStorage.setItem('user_name', student.name);
      localStorage.setItem('user_branch', student.branch);
      localStorage.setItem('user_year', student.year);
      localStorage.setItem('user_avatar', student.avatar || '');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    navigate('/login');
  };

  return (
    <div className="app-container animate-page-in" style={{ alignItems: 'center', paddingTop: '60px', paddingBottom: '60px', overflowY: 'auto' }}>
      <button 
        className="btn-secondary" 
        style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Back to Feed
      </button>

      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div 
                className="user-avatar profile-avatar-container" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  fontSize: '2rem', 
                  background: student.avatar && student.avatar.startsWith('linear-gradient') ? student.avatar : 'var(--primary-accent)',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => setIsChangingAvatar(true)}
                title="Change Profile Picture"
              >
                {student.avatar && !student.avatar.startsWith('linear-gradient') ? (
                  <img src={student.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  student.name.charAt(0)
                )}
                <div className="avatar-overlay">
                  <Camera size={20} color="white" />
                </div>
              </div>
              <div>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="glass-input" 
                    value={student.name} 
                    onChange={e => setStudent({...student, name: e.target.value})} 
                    style={{ fontSize: '1.4rem', fontWeight: 'bold', padding: '4px 12px', marginBottom: '4px' }} 
                  />
                ) : (
                  <h1 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-main)' }}>{student.name}</h1>
                )}
                <p style={{ color: 'var(--secondary-accent)', fontWeight: '500', fontSize: '1.1rem' }}>CollegeIntel Contributor</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {isEditing ? (
                <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 16px' }}>
                  <Save size={16} /> Save
                </button>
              ) : (
                <button className="btn-secondary" onClick={() => setIsEditing(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 16px' }}>
                  <Edit2 size={16} /> Edit
                </button>
              )}
              <button className="btn-icon" onClick={handleLogout} title="Logout">
                <LogOut size={24} color="var(--urgency-high)" />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={24} color="var(--primary-accent)" />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Branch</div>
                {isEditing ? (
                  <select 
                    className="glass-input" 
                    value={student.branch} 
                    onChange={e => setStudent({...student, branch: e.target.value})} 
                    style={{ padding: '4px 8px', marginTop: '4px' }}
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="IT">IT</option>
                    <option value="AI">AI</option>
                    <option value="DS">DS</option>
                    <option value="AI&DS">AI&DS</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                  </select>
                ) : (
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{student.branch}</div>
                )}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <GraduationCap size={24} color="var(--secondary-accent)" />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Year</div>
                {isEditing ? (
                  <select 
                    className="glass-input" 
                    value={student.year} 
                    onChange={e => setStudent({...student, year: e.target.value})}
                    style={{ padding: '4px 8px', marginTop: '4px' }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                ) : (
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{student.year}</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <FileText size={24} color="var(--secondary-accent)" />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-accent)' }}>Total Posts</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>{totalMyPosts}</div>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <Award size={24} color="var(--urgency-low)" />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--urgency-low)' }}>Credibility Score</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>{totalMyPosts > 0 ? `${avgCredibility}/100` : 'Pending'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Posted Tips Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary-accent)" /> My Shared Intelligence ({totalMyPosts})
          </h2>
          
          {totalMyPosts === 0 ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              You haven't shared any academic or career intelligence yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myTips.map(tip => {
                if (editingTipId === tip.id) {
                  return (
                    <div key={tip.id} className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                        Edit Intelligence
                      </h3>
                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Title</label>
                        <input type="text" id={`edit-title-${tip.id}`} defaultValue={tip.title} className="glass-input" />
                      </div>
                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Context & Advice</label>
                        <textarea id={`edit-content-${tip.id}`} defaultValue={tip.content} className="glass-input" rows={3}></textarea>
                      </div>
                      <div className="form-row" style={{ marginBottom: '10px' }}>
                        <div className="form-group">
                          <label>Category</label>
                          <select id={`edit-category-${tip.id}`} className="glass-input" defaultValue={tip.category.toLowerCase()}>
                            <option value="internships">Internships</option>
                            <option value="academics">Academics</option>
                            <option value="scholarships">Scholarships</option>
                            <option value="campus-life">Campus Life</option>
                            <option value="club">Club</option>
                            <option value="placement">Placement</option>
                            <option value="research">Research</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Urgency</label>
                          <select id={`edit-urgency-${tip.id}`} className="glass-input" defaultValue={tip.urgency}>
                            <option value="high">High</option>
                            <option value="med">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Deadline Date</label>
                          <input type="text" id={`edit-deadline-${tip.id}`} defaultValue={tip.deadline} className="glass-input" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '14px', justifyContent: 'flex-end' }}>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleSaveEdit(tip.id)}>
                          Save Changes
                        </button>
                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} onClick={() => setEditingTipId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={tip.id} className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="tip-category" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid var(--border-color)' }}>
                        {tip.category}
                      </span>
                      <span className={`urgency-badge urgency-${tip.urgency}`} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {tip.urgency.toUpperCase()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)', fontWeight: 'bold' }}>{tip.title}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>{tip.content}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                      <span style={{ color: 'var(--urgency-low)', fontWeight: 'bold' }}>
                        Credibility: {((tip.confirmedCount || 0) + (tip.outdatedCount || 0) + (tip.misleadingCount || 0)) === 0 ? 'Pending (0 votes)' : `${tip.credibilityScore}/100`}
                      </span>
                      <span>Deadline: {tip.deadline}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                      <button 
                        className="action-btn" 
                        onClick={() => setEditingTipId(tip.id)} 
                        style={{ color: 'var(--urgency-med)', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={() => setDeleteConfirmId(tip.id)} 
                        style={{ color: 'var(--urgency-high)', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Premium Glass Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel animate-scale-up" style={{ padding: '30px', maxWidth: '400px', width: '90%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Delete Intelligence?</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete this intelligence tip? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="btn-primary" 
                style={{ background: 'var(--urgency-high)', borderColor: 'var(--urgency-high)', padding: '10px 20px', fontSize: '0.9rem' }}
                onClick={async () => {
                  const id = deleteConfirmId;
                  setDeleteConfirmId(null);
                  try {
                    await fetch(`/api/tips/${id}`, { method: 'DELETE' });
                    setMyTips(prev => prev.filter(t => t.id !== id));
                  } catch (err) {
                    console.error('Failed to delete tip:', err);
                  }
                }}
              >
                Yes, Delete
              </button>
              <button 
                className="btn-secondary" 
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Premium Glass Profile Picture Selection Modal */}
      {isChangingAvatar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel animate-scale-up" style={{ padding: '30px', maxWidth: '450px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Choose Profile Picture</h3>
              <button 
                onClick={() => setIsChangingAvatar(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Select a gorgeous linear gradient preset matching our sleek theme, or upload your own custom photo.
            </p>

            {/* Current Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <div 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  background: student.avatar && student.avatar.startsWith('linear-gradient') ? student.avatar : 'var(--primary-accent)',
                  fontSize: '2.2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {student.avatar && !student.avatar.startsWith('linear-gradient') ? (
                  <img src={student.avatar} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  student.name.charAt(0)
                )}
              </div>
            </div>

            {/* Preset Colors Grid */}
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Gradient Presets</span>
              <div className="presets-grid">
                {PRESET_AVATARS.map((preset, idx) => (
                  <div 
                    key={idx}
                    className={`preset-avatar-option ${student.avatar === preset ? 'selected' : ''}`}
                    style={{ background: preset }}
                    onClick={() => setStudent(prev => ({ ...prev, avatar: preset }))}
                  >
                    {student.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Upload Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Custom Photo</span>
              <label className="custom-file-upload">
                <Upload size={16} color="var(--primary-accent)" />
                <span>Choose custom photo...</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setStudent(prev => ({ ...prev, avatar: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                onClick={() => {
                  setStudent(prev => ({ ...prev, avatar: '' }));
                }}
              >
                Clear Avatar
              </button>
              <button 
                className="btn-primary" 
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                onClick={async () => {
                  setIsChangingAvatar(false);
                  const email = localStorage.getItem('user_email') || 'student@university.edu';
                  try {
                    const res = await fetch('/api/users/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email,
                        name: student.name,
                        branch: student.branch,
                        year: student.year,
                        avatar: student.avatar
                      })
                    });
                    const data = await res.json();
                    if (!data.error) {
                      localStorage.setItem('user_avatar', data.avatar || '');
                    }
                  } catch (err) {
                    console.error('Failed to save avatar change:', err);
                    localStorage.setItem('user_avatar', student.avatar || '');
                  }
                }}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
