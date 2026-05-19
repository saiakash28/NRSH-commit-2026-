import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.elements.fullname.value;
    const email = e.target.elements.email.value;
    const branch = e.target.elements.branch.value;
    const year = e.target.elements.year.value;
    const password = e.target.elements.password.value;

    setErrorMsg('');

    // Client-side validations
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, branch, year, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_branch', data.branch);
      localStorage.setItem('user_year', data.year);
      localStorage.setItem('user_registered', 'true');
      localStorage.setItem('user_authenticated', 'true');
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg(err.message || 'Connecting to server failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container animate-page-in">
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

        {errorMsg && (
          <div className="glass-panel" style={{ color: 'var(--urgency-high)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', fontWeight: 'bold' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullname"
              className="glass-input" 
              placeholder="Jane Doe" 
              required
            />
          </div>

          <div className="form-group">
            <label>University Email</label>
            <input 
              type="email" 
              name="email"
              className="glass-input" 
              placeholder="student@university.edu" 
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Branch</label>
              <select name="branch" className="glass-input" required defaultValue="">
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
              <select name="year" className="glass-input" required defaultValue="">
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
              name="password"
              className="glass-input" 
              placeholder="Create a strong password" 
              required
            />
          </div>

          <button type="submit" className="btn-primary full-width btn-auth" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
