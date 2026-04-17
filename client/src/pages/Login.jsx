import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-amber flex items-center justify-center shadow-glow">
                <span className="text-white font-heading font-bold text-xl">B</span>
              </div>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-dark-400">Sign in to order your favorite food</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-dark-300 text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="text-dark-300 text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 glass-card p-4">
            <p className="text-dark-400 text-xs mb-2 font-medium">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { setEmail('admin@bitezy.com'); setPassword('admin123'); }}
                className="px-3 py-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
              >
                Admin Login
              </button>
              <button
                onClick={() => { setEmail('varun@gmail.com'); setPassword('varun123'); }}
                className="px-3 py-2 rounded-lg bg-white/[0.05] text-dark-300 hover:bg-white/[0.1] transition-colors"
              >
                User Login (Varun)
              </button>
            </div>
          </div>

          <p className="text-center text-dark-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
          alt="Delicious food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/50 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="glass-card p-6">
            <p className="text-white text-lg font-heading font-semibold mb-2">"Best food delivery app I've ever used!"</p>
            <p className="text-dark-400 text-sm">— Sarah M., Happy Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
