import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bell, Search, GraduationCap, CheckCircle, Clock, MapPin, Bookmark, LogOut, MessageSquare, Trash2, BellRing, Calendar } from 'lucide-react'
import '../App.css'

// Mock Data
export const MOCK_TIPS = [
  {
    id: 1,
    category: 'Internship',
    title: 'Google STEP Program closing in 2 days!',
    content: 'If you are a sophomore or freshman, apply now! They care more about your data structures knowledge than past experience. Make sure to use the XYZ referral trick if possible.',
    urgency: 'high',
    deadline: 'Oct 15, 2026',
    tags: ['#CS', '#Google', '#Sophomore'],
    upvotes: 245,
    verified: true,
    author: 'Final Year CSE Senior',
    credibilityScore: 87,
    confirmedCount: 24,
    outdatedCount: 2,
    misleadingCount: 1,
    comments: [
      { id: 1, author: 'Alex_ECE', text: 'Apply fast! The server gets super slow on the last day.' },
      { id: 2, author: 'Rahul_Kumar', text: 'Does this require any prior internship experience?' }
    ]
  },
  {
    id: 2,
    category: 'Academics',
    title: 'Avoid Prof. Smith for Intro to Algorithms',
    content: 'The syllabus looks easy but his exams test edge cases not covered in class. Take Prof. Johnson instead if you want to save your GPA.',
    urgency: 'med',
    deadline: 'Registration: Nov 1',
    tags: ['#CS101', '#CourseReg'],
    upvotes: 189,
    verified: true,
    author: 'Junior Year IT Student',
    credibilityScore: 92,
    confirmedCount: 18,
    outdatedCount: 0,
    misleadingCount: 0,
    comments: [
      { id: 1, author: 'CS_Junior', text: 'Completely agree, his midterms are brutal.' }
    ]
  },
  {
    id: 3,
    category: 'Scholarship',
    title: 'First-Gen STEM Grant Application Open',
    content: 'Not many people know about this departmental grant. It covers textbooks for the whole year. You just need a short essay about your background.',
    urgency: 'low',
    deadline: 'Dec 1, 2026',
    tags: ['#Funding', '#FirstGen', '#STEM'],
    upvotes: 88,
    verified: false,
    author: 'Alumni (Class of 2024)',
    credibilityScore: 45,
    confirmedCount: 3,
    outdatedCount: 12,
    misleadingCount: 8,
    comments: []
  },
  {
    id: 4,
    category: 'Campus Life',
    title: 'Free dinner and study spaces at the Student Union tonight!',
    content: 'The Student Union is hosting an late-night study jam tonight from 8 PM to midnight. They have free pizza, coffee, and quiet study areas. Perfect if your dorm is too noisy!',
    urgency: 'low',
    deadline: 'Tonight: 8 PM',
    tags: ['#CampusLife', '#FreeFood', '#StudyJam'],
    upvotes: 112,
    verified: true,
    author: 'Sophomore Peer Leader',
    credibilityScore: 89,
    confirmedCount: 19,
    outdatedCount: 0,
    misleadingCount: 0,
    comments: [
      { id: 1, author: 'Freshie_01', text: 'Is there a vegetarian option?' }
    ]
  },
  {
    id: 5,
    category: 'Club',
    title: 'Robotics Club info session and project showcase',
    content: 'Looking to join a tech club? The Robotics Club is having an info session in Room 302. No prior coding experience required—they train you from scratch. Plus, you get to work on actual competition bots!',
    urgency: 'med',
    deadline: 'Session: Oct 20',
    tags: ['#Clubs', '#Robotics', '#Tech'],
    upvotes: 95,
    verified: true,
    author: 'Robotics Lead',
    credibilityScore: 95,
    confirmedCount: 15,
    outdatedCount: 1,
    misleadingCount: 0,
    comments: [
      { id: 1, author: 'Alex_ECE', text: 'Can freshman join the competition team right away?' }
    ]
  },
  {
    id: 6,
    category: 'Placement',
    title: 'Mock Interviews with Goldman Sachs Alumni next week!',
    content: 'Career services just launched the registration portal for mock interviews with Goldman Sachs and JPMorgan alumni. Slots are super limited, so register on Handshake today. They give brilliant resume feedback!',
    urgency: 'high',
    deadline: 'Register by Oct 18',
    tags: ['#Finance', '#Placement', '#MockInterviews'],
    upvotes: 310,
    verified: true,
    author: 'Placement Coordinator',
    credibilityScore: 98,
    confirmedCount: 34,
    outdatedCount: 0,
    misleadingCount: 0,
    comments: [
      { id: 1, author: 'Jane Doe (You)', text: 'Just registered! The slots are filling up fast!' }
    ]
  },
  {
    id: 7,
    category: 'Research',
    title: 'Undergrad Research Positions in AI Lab (Prof. Lee)',
    content: 'Prof. Lee is looking for 2 undergraduate research assistants to help with data cleaning and model training in the NLP lab. Paid position or course credit. Send your resume and transcript to his email.',
    urgency: 'high',
    deadline: 'Apply by Oct 25',
    tags: ['#Research', '#AI', '#NLP'],
    upvotes: 142,
    verified: false,
    author: 'PhD Assistant (NLP Lab)',
    credibilityScore: 78,
    confirmedCount: 11,
    outdatedCount: 2,
    misleadingCount: 1,
    comments: []
  }
];

export default function Home() {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [editingTipId, setEditingTipId] = useState(null);
  const [tips, setTips] = useState([]);
  const [savedPosts, setSavedPosts] = useState(() => JSON.parse(localStorage.getItem('saved_posts') || '[]'));
  const [expandedComments, setExpandedComments] = useState({});
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem('post_reminders_map') || '{}'));
  const [activePickerId, setActivePickerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTips = () => {
      fetch('/api/tips')
        .then(res => res.json())
        .then(data => setTips(data))
        .catch(err => {
          console.error('Failed to load tips, using mock data:', err);
        });
    };

    fetchTips();
    const interval = setInterval(fetchTips, 5000);
    return () => clearInterval(interval);
  }, []);



  const navigate = useNavigate();
  const { categoryId, urgencyId } = useParams();
  const activeCategory = categoryId ? categoryId.toLowerCase() : 'all';
  const activeUrgency = urgencyId ? urgencyId.toLowerCase() : 'all';

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    navigate('/login');
  };

  const handleSave = (id) => {
    setSavedPosts(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      localStorage.setItem('saved_posts', JSON.stringify(next));
      return next;
    });
  };

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
      console.error('Failed to notify backend of reminder:', err);
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
      console.error('Failed to remove backend reminder:', err);
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

  const toggleComments = (id) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddComment = async (e, tipId) => {
    e.preventDefault();
    const form = e.target;
    const text = form.commentText.value;
    if (!text.trim()) return;

    const author = localStorage.getItem('user_name') || 'Jane Doe (You)';

    try {
      const res = await fetch(`/api/tips/${tipId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text })
      });
      const updatedTip = await res.json();
      setTips(prev => prev.map(t => t.id === tipId ? updatedTip : t));
      form.reset();
    } catch (err) {
      console.error('Adding comment failed:', err);
      // Fallback
      setTips(currentTips => 
        currentTips.map(tip => {
          if (tip.id === tipId) {
            const newComment = {
              id: (tip.comments || []).length + 1,
              author: 'Jane Doe (You)',
              text: text
            };
            return {
              ...tip,
              comments: [...(tip.comments || []), newComment]
            };
          }
          return tip;
        })
      );
      form.reset();
    }
  };

  const handleDeleteComment = async (tipId, commentId) => {
    try {
      const res = await fetch(`/api/tips/${tipId}/comments/${commentId}`, {
        method: 'DELETE'
      });
      const updatedTip = await res.json();
      setTips(prev => prev.map(t => t.id === tipId ? updatedTip : t));
    } catch (err) {
      console.error('Deleting comment failed:', err);
      // Fallback
      setTips(currentTips =>
        currentTips.map(tip => {
          if (tip.id === tipId) {
            return {
              ...tip,
              comments: (tip.comments || []).filter(comment => comment.id !== commentId)
            };
          }
          return tip;
        })
      );
    }
  };

  const handleVerification = async (id, type) => {
    const tip = tips.find(t => t.id === id);
    if (!tip) return;
    const prevVote = tip.userVote;

    // Optimistically update UI
    setTips(currentTips => 
      currentTips.map(t => {
        if (t.id === id) {
          const nextVote = prevVote === type ? null : type;
          const updated = { ...t, userVote: nextVote };
          if (prevVote === 'confirm') updated.confirmedCount = Math.max(0, updated.confirmedCount - 1);
          if (prevVote === 'outdate') updated.outdatedCount = Math.max(0, updated.outdatedCount - 1);
          if (prevVote === 'mislead') updated.misleadingCount = Math.max(0, updated.misleadingCount - 1);
          
          if (nextVote === 'confirm') updated.confirmedCount += 1;
          if (nextVote === 'outdate') updated.outdatedCount += 1;
          if (nextVote === 'mislead') updated.misleadingCount += 1;
          return updated;
        }
        return t;
      })
    );

    try {
      const res = await fetch(`/api/tips/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: prevVote === type ? null : type, prevVote })
      });
      const updatedTip = await res.json();
      setTips(prev => prev.map(t => t.id === id ? { ...t, ...updatedTip, userVote: prevVote === type ? null : type } : t));
    } catch (err) {
      console.error('Failed to submit peer verification vote:', err);
    }
  };



  const handleCreateTopPost = async () => {
    const titleVal = document.getElementById('top-post-title').value;
    const contentVal = document.getElementById('top-post-content').value;
    const categoryVal = document.getElementById('top-post-category').value;
    const urgencyText = document.getElementById('top-post-urgency').value;
    const deadlineDate = document.getElementById('top-post-deadline').value;

    if (!titleVal || !contentVal || !categoryVal) {
      alert('Please fill out Title, Context, and Category.');
      return;
    }

    const urgency = urgencyText.includes('High') ? 'high' : (urgencyText.includes('Medium') ? 'med' : 'low');
    const tags = ['#CS', `#${categoryVal.toUpperCase()}`];
    const author = localStorage.getItem('user_name') || 'Jane Doe (You)';

    try {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryVal.charAt(0).toUpperCase() + categoryVal.slice(1),
          title: titleVal,
          content: contentVal,
          urgency,
          deadline: deadlineDate || 'TBA',
          tags,
          author
        })
      });
      const newTip = await res.json();
      setTips(prev => [newTip, ...prev]);
      setIsPanelExpanded(false);
    } catch (err) {
      console.error('Failed to create new tip:', err);
    }
  };

  const handleScrollToCompose = () => {
    setIsPanelExpanded(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('top-post-title')?.focus();
    }, 400);
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this intelligence tip?')) return;
    try {
      await fetch(`/api/tips/${id}`, { method: 'DELETE' });
      setTips(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete tip:', err);
    }
  };

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
      setTips(prev => prev.map(t => t.id === id ? { ...t, ...updatedTip } : t));
      setEditingTipId(null);
    } catch (err) {
      console.error('Failed to update tip:', err);
    }
  };

  const filteredTips = tips.filter(tip => {
    let categoryMatch = true;
    let urgencyMatch = true;
    let searchMatch = true;

    if (activeCategory !== 'all') {
      const normTip = tip.category.toLowerCase().replace(/s$/, '').replace(' ', '-');
      const normAct = activeCategory.replace(/s$/, '');
      categoryMatch = (normTip === normAct);
    }
    
    if (activeUrgency !== 'all') {
      // "med" for medium in the mock data, ensure we match correctly
      const normUrg = activeUrgency === 'medium' ? 'med' : activeUrgency;
      urgencyMatch = (tip.urgency === normUrg);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const titleMatch = tip.title.toLowerCase().includes(query);
      const contentMatch = tip.content.toLowerCase().includes(query);
      const tagMatch = tip.tags.some(t => t.toLowerCase().includes(query));
      const catMatch = tip.category.toLowerCase().includes(query);
      searchMatch = titleMatch || contentMatch || tagMatch || catMatch;
    }

    return categoryMatch && urgencyMatch && searchMatch;
  });

  return (
    <div className="app-container animate-page-in">
      {/* Navbar */}
      <nav className="glass-panel navbar">
        <div className="nav-left">
          <GraduationCap className="nav-logo" size={28} />
          <span className="nav-brand">CollegeIntel</span>
        </div>
        <div className="nav-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for courses, tags, or deadlines..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="nav-right">
          <button className="btn-icon" onClick={() => navigate('/saved')} title="Saved Pages">
            <Bookmark size={20} />
          </button>
          <button className="btn-icon" onClick={() => navigate('/notifications')} title="Notifications">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <button className="btn-primary" onClick={handleScrollToCompose} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.85rem' }}>
            + Add Tip
          </button>
          <button className="btn-icon" onClick={() => navigate('/profile')} title="View Profile" style={{ padding: 0 }}>
            <div 
              className="user-avatar" 
              style={{ 
                cursor: 'pointer',
                background: localStorage.getItem('user_avatar') && localStorage.getItem('user_avatar').startsWith('linear-gradient') ? localStorage.getItem('user_avatar') : 'var(--primary-accent)',
                overflow: 'hidden'
              }}
            >
              {localStorage.getItem('user_avatar') && !localStorage.getItem('user_avatar').startsWith('linear-gradient') ? (
                <img src={localStorage.getItem('user_avatar')} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (localStorage.getItem('user_name') || 'Jane Doe').charAt(0)
              )}
            </div>
          </button>
          <button className="btn-icon" onClick={handleLogout} title="Logout" style={{ marginLeft: '8px' }}>
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar glass-panel">
          <div className="sidebar-section">
            <h3>Category</h3>
            <ul className="filter-list">
              <li className={activeCategory === 'all' ? 'active' : ''} onClick={() => navigate('/')}>All Categories</li>
              <li className={activeCategory === 'internships' ? 'active' : ''} onClick={() => navigate('/category/internships')}>Internships</li>
              <li className={activeCategory === 'academics' ? 'active' : ''} onClick={() => navigate('/category/academics')}>Academics</li>
              <li className={activeCategory === 'scholarships' ? 'active' : ''} onClick={() => navigate('/category/scholarships')}>Scholarships</li>
              <li className={activeCategory === 'campus-life' ? 'active' : ''} onClick={() => navigate('/category/campus-life')}>Campus Life</li>
              <li className={activeCategory === 'club' ? 'active' : ''} onClick={() => navigate('/category/club')}>Club</li>
              <li className={activeCategory === 'placement' ? 'active' : ''} onClick={() => navigate('/category/placement')}>Placement</li>
              <li className={activeCategory === 'research' ? 'active' : ''} onClick={() => navigate('/category/research')}>Research</li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3>Urgency</h3>
            <ul className="filter-list">
              <li className={activeUrgency === 'all' ? 'active' : ''} onClick={() => navigate('/')}>All Urgencies</li>
              <li className={activeUrgency === 'high' ? 'active' : ''} onClick={() => navigate('/urgency/high')}>High</li>
              <li className={activeUrgency === 'med' ? 'active' : ''} onClick={() => navigate('/urgency/med')}>Medium</li>
              <li className={activeUrgency === 'low' ? 'active' : ''} onClick={() => navigate('/urgency/low')}>Low</li>
            </ul>
          </div>


          <div className="sidebar-section">
            <h3>My Tags</h3>
            <div className="tags-container">
              <span className="tag">#CS</span>
              <span className="tag">#FirstGen</span>
              <span className="tag">#Engineering</span>
              <span className="tag">+ Add Tag</span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="feed">
          <div className="feed-header">
            <h2>Intelligence Feed</h2>
            <div className="feed-sort">
              <span>Sort by:</span>
              <select className="glass-select">
                <option>Highest Rated</option>
                <option>Upcoming Deadline</option>
                <option>Recent</option>
              </select>
            </div>
          </div>

          {/* Premium Standard Top Share Intelligence Panel */}
          {isPanelExpanded && (
            <div className="glass-panel share-intelligence-panel animate-fade-in" style={{ animationDelay: '0.05s', marginBottom: '24px' }}>
              <div className="share-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    className="user-avatar" 
                    style={{ 
                      background: localStorage.getItem('user_avatar') && localStorage.getItem('user_avatar').startsWith('linear-gradient') ? localStorage.getItem('user_avatar') : 'var(--primary-accent)', 
                      color: 'white', 
                      fontWeight: 'bold',
                      overflow: 'hidden'
                    }}
                  >
                    {localStorage.getItem('user_avatar') && !localStorage.getItem('user_avatar').startsWith('linear-gradient') ? (
                      <img src={localStorage.getItem('user_avatar')} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (localStorage.getItem('user_name') || 'F').charAt(0)
                    )}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Share Academic & Career Intelligence</h3>
                </div>
                <button className="close-btn" onClick={() => setIsPanelExpanded(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>
                  ×
                </button>
              </div>
              
              <div className="share-panel-expanded animate-slide-down" style={{ marginTop: '16px' }}>
                <hr className="divider" />
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Title</label>
                  <input type="text" id="top-post-title" placeholder="E.g., Google STEP Program closing soon!" className="glass-input" />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Context & Advice</label>
                  <textarea id="top-post-content" placeholder="Share your insider knowledge..." className="glass-input" rows={4}></textarea>
                </div>
                <div className="form-row" style={{ marginBottom: '14px' }}>
                  <div className="form-group">
                    <label>Category</label>
                    <select id="top-post-category" className="glass-input" defaultValue="">
                      <option value="" disabled>Select Category</option>
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
                    <select id="top-post-urgency" className="glass-input">
                      <option>High (Next 7 days)</option>
                      <option>Medium (Next 30 days)</option>
                      <option>Low (Good to know)</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Deadline Date</label>
                    <input type="text" id="top-post-deadline" placeholder="E.g., Oct 25, 2026 or Tonight: 8 PM" className="glass-input" />
                  </div>
                </div>
                <button className="btn-primary full-width mt-4" style={{ padding: '12px' }} onClick={handleCreateTopPost}>
                  Submit to Network
                </button>
              </div>
            </div>
          )}

          <div className="tips-container">
            {filteredTips.map((tip, idx) => (
              <div key={tip.id} id={`post-${tip.id}`} className="tip-card glass-panel animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
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
                        <span>• Confirmed by {tip.confirmedCount} students</span>
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
                      onClick={() => handleSave(tip.id)}
                      style={{ color: savedPosts.includes(tip.id) ? 'var(--primary-accent)' : 'inherit' }}
                    >
                      <Bookmark size={16} fill={savedPosts.includes(tip.id) ? 'currentColor' : 'none'} /> {savedPosts.includes(tip.id) ? 'Saved' : 'Save'}
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
                    <button className="action-btn" onClick={() => toggleComments(tip.id)} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <MessageSquare size={16} /> {(tip.comments || []).length} Comments
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
                  
                  <div className="tip-verification" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      className="action-btn" 
                      onClick={() => handleVerification(tip.id, 'confirm')} 
                      style={{ 
                        background: tip.userVote === 'confirm' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.1)', 
                        color: 'var(--urgency-low)', 
                        borderColor: tip.userVote === 'confirm' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.2)' 
                      }}
                    >
                      ✅ Confirmed <span style={{ opacity: 0.8, marginLeft: '4px', fontWeight: 'bold' }}>{tip.confirmedCount}</span>
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => handleVerification(tip.id, 'outdate')} 
                      style={{ 
                        background: tip.userVote === 'outdate' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.1)', 
                        color: 'var(--urgency-med)', 
                        borderColor: tip.userVote === 'outdate' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(245, 158, 11, 0.2)' 
                      }}
                    >
                      ⚠️ Outdated <span style={{ opacity: 0.8, marginLeft: '4px', fontWeight: 'bold' }}>{tip.outdatedCount}</span>
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => handleVerification(tip.id, 'mislead')} 
                      style={{ 
                        background: tip.userVote === 'mislead' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.1)', 
                        color: 'var(--urgency-high)', 
                        borderColor: tip.userVote === 'mislead' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.2)' 
                      }}
                    >
                      ❌ Misleading <span style={{ opacity: 0.8, marginLeft: '4px', fontWeight: 'bold' }}>{tip.misleadingCount}</span>
                    </button>
                  </div>

                  {expandedComments[tip.id] && (
                    <div className="tip-comments" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>Discussion</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        {(tip.comments || []).length === 0 ? (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                            No comments yet. Start the discussion below!
                          </div>
                        ) : (
                          (tip.comments || []).map(comment => (
                            <div key={comment.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--secondary-accent)', fontSize: '0.8rem' }}>
                                  {comment.author}
                                </span>
                                {comment.author === 'Jane Doe (You)' && (
                                  <button 
                                    onClick={() => handleDeleteComment(tip.id, comment.id)} 
                                    style={{ background: 'none', border: 'none', color: 'var(--urgency-high)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                    title="Delete Comment"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                              <div style={{ color: 'var(--text-main)', lineHeight: '1.4' }}>{comment.text}</div>
                            </div>
                          ))
                        )}
                      </div>
                      <form onSubmit={(e) => handleAddComment(e, tip.id)} style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Share your thought or ask a question..." 
                          className="glass-input" 
                          style={{ flex: 1, padding: '10px 14px', fontSize: '0.9rem' }}
                          name="commentText"
                          required
                          autoComplete="off"
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                          Post
                        </button>
                      </form>
                    </div>
                  )}
                </div>
            ))}
          </div>
        </main>

        {/* Right Panel */}
        <aside className="right-panel">
          <div className="glass-panel trending-box">
            <h3>🔥 Trending Intel</h3>
            <ul className="trending-list">
              <li>
                <span className="trend-title">CS Career Fair Recruiter Tips</span>
                <span className="trend-stats">1.2k views</span>
              </li>
              <li>
                <span className="trend-title">How to petition for more financial aid</span>
                <span className="trend-stats">850 views</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-panel deadlines-box">
            <h3>⏰ Critical Deadlines</h3>
            <div className="deadline-item high-urgency">
              <span className="deadline-date">Oct 15</span>
              <span className="deadline-desc">Google STEP App</span>
            </div>
            <div className="deadline-item med-urgency">
              <span className="deadline-date">Nov 1</span>
              <span className="deadline-desc">Spring Course Reg</span>
            </div>
          </div>
        </aside>
      </div>

    </div>
  )
}
