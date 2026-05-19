import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // In a real app, you would create the user account here
    localStorage.setItem('isAuthenticated', 'true');
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
              <label>University</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="E.g., Stanford" 
                required
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <select className="glass-input" required defaultValue="">
                <option value="" disabled>Select Year</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="grad">Graduate</option>
                <option value="alumni">Alumni</option>
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
