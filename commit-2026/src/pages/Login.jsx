import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      localStorage.setItem('user_name', data.name || 'Jane Doe');
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_branch', data.branch || 'CSE');
      localStorage.setItem('user_year', data.year || '4');
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_registered', 'true');
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue to CollegeIntel</p>
          </div>
        </div>

        {errorMsg && (
          <div className="glass-panel" style={{ color: 'var(--urgency-high)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', fontWeight: 'bold' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              className="glass-input" 
              placeholder="student@university.edu" 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              className="glass-input" 
              placeholder="••••••••" 
              required
            />
          </div>
          
          <div className="auth-forgot-password">
            <a href="#" className="auth-link">Forgot Password?</a>
          </div>
 
          <button type="submit" className="btn-primary full-width btn-auth" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
