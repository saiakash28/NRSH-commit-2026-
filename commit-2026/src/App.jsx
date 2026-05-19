import { useState } from 'react'
import { Bell, Search, GraduationCap, CheckCircle, Clock, MapPin, Bookmark } from 'lucide-react'
import './App.css'

// Mock Data
const MOCK_TIPS = [
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
    author: 'Senior_Dev_99 (Verified Senior)'
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
    author: 'Anon_Owl'
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
    author: 'Bio_Nerd_24'
  }
];

function App() {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="glass-panel navbar">
        <div className="nav-left">
          <GraduationCap className="nav-logo" size={28} />
          <span className="nav-brand">CollegeIntel</span>
        </div>
        <div className="nav-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search for courses, tags, or deadlines..." className="search-input" />
        </div>
        <div className="nav-right">
          <button className="btn-icon">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <button className="btn-primary" onClick={() => setShowSubmitModal(true)}>
            + Add Tip
          </button>
          <div className="user-avatar">F</div>
        </div>
      </nav>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar glass-panel">
          <div className="sidebar-section">
            <h3>Filters</h3>
            <ul className="filter-list">
              <li className="active">All Categories</li>
              <li>Internships</li>
              <li>Academics</li>
              <li>Scholarships</li>
              <li>Campus Life</li>
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

          <div className="tips-container">
            {MOCK_TIPS.map((tip, idx) => (
              <div key={tip.id} className="tip-card glass-panel animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="tip-header">
                  <div className="tip-meta">
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
                  <div className="tip-footer-left">
                    <span className="tip-author">{tip.author}</span>
                    <span className="tip-deadline">
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
                  <button className="action-btn">
                    <Bookmark size={16} /> Save
                  </button>
                </div>
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

      {/* Basic Submit Modal Overlay (Just UI) */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Intelligence</h2>
              <button className="close-btn" onClick={() => setShowSubmitModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="E.g., Google STEP Program closing soon!" className="glass-input" />
              </div>
              <div className="form-group">
                <label>Context & Advice</label>
                <textarea placeholder="Share your insider knowledge..." className="glass-input" rows={4}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Urgency</label>
                  <select className="glass-input">
                    <option>High (Next 7 days)</option>
                    <option>Medium (Next 30 days)</option>
                    <option>Low (Good to know)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deadline Date</label>
                  <input type="date" className="glass-input" />
                </div>
              </div>
              <button className="btn-primary full-width mt-4" onClick={() => setShowSubmitModal(false)}>
                Submit to Network
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
