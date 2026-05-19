import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // In a real app, you would create the user account here
    localStorage.setItem('user_registered', 'true');
    localStorage.setItem('user_authenticated', 'true');
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <GraduationCap size={40} />
          </div>
          <div>
            <h1 className="auth-title">Join CollegeIntel</h1>
            <p className="auth-subtitle">Create an account to access peer insights</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Jane Doe" 
              required
            />
          </div>

          <div className="form-group">
            <label>University Email</label>
            <input 
              type="email" 
              className="glass-input" 
              placeholder="student@university.edu" 
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Branch</label>
              <select className="glass-input" required defaultValue="">
                <option value="" disabled>Select Branch</option>
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
            </div>
            <div className="form-group">
              <label>Year</label>
              <select className="glass-input" required defaultValue="">
                <option value="" disabled>Select Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="glass-input" 
              placeholder="Create a strong password" 
              required
            />
          </div>

          <button type="submit" className="btn-primary full-width btn-auth">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
