import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, FileText, BookOpen, GraduationCap, ArrowLeft, LogOut, Edit2, Save } from 'lucide-react';
import '../App.css';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Manage Profile Data
  const [student, setStudent] = useState({
    name: "Jane Doe",
    branch: "CSE",
    year: "2",
    totalPosts: 5,
    credibilityScore: 92
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, send changes to backend here
  };

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', paddingTop: '60px' }}>
      <button 
        className="btn-secondary" 
        style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Back to Feed
      </button>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
              {student.name.charAt(0)}
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
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>{student.totalPosts}</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <Award size={24} color="var(--urgency-low)" />
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--urgency-low)' }}>Credibility Score</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>{student.credibilityScore}<span style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>/100</span></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
