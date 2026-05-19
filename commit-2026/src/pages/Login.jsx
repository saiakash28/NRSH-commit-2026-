import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_registered', 'true'); // Ensure they are marked as registered if they successfully login
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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue to CollegeIntel</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="glass-input" 
              placeholder="student@university.edu" 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="glass-input" 
              placeholder="••••••••" 
              required
            />
          </div>
          
          <div className="auth-forgot-password">
            <a href="#" className="auth-link">Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary full-width btn-auth">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
