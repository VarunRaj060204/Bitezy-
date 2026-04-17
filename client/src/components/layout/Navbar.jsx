import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineSearch } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-dark-950/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-amber flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <span className="text-white font-heading font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-heading font-bold text-white">
              Bite<span className="gradient-text">zy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`btn-ghost ${location.pathname === '/' ? 'text-white bg-white/[0.05]' : ''}`}>Home</Link>
            <Link to="/restaurants" className={`btn-ghost ${location.pathname === '/restaurants' ? 'text-white bg-white/[0.05]' : ''}`}>Restaurants</Link>
            {user && (
              <Link to="/orders" className={`btn-ghost ${location.pathname === '/orders' ? 'text-white bg-white/[0.05]' : ''}`}>My Orders</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={`btn-ghost ${location.pathname.startsWith('/admin') ? 'text-white bg-white/[0.05]' : ''}`}>
                <MdDashboard className="inline mr-1" />Admin
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-primary-500/30 transition-all duration-200"
            >
              <HiOutlineShoppingBag className="w-5 h-5 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] transition-all duration-200">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-amber flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-white font-medium max-w-[100px] truncate">{user.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slide-down">
                  <Link to="/profile" className="block px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">Profile</Link>
                  <Link to="/orders" className="block px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">My Orders</Link>
                  <hr className="border-white/[0.06] my-1" />
                  <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2.5 px-5">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => navigate('/cart')} className="relative p-2 rounded-lg bg-white/[0.05]">
              <HiOutlineShoppingBag className="w-5 h-5 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg bg-white/[0.05]">
              {mobileOpen ? <HiOutlineX className="w-5 h-5 text-white" /> : <HiOutlineMenu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-950/95 backdrop-blur-xl border-t border-white/[0.06] animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            <Link to="/" className="block px-4 py-3 text-white hover:bg-white/[0.05] rounded-xl">Home</Link>
            <Link to="/restaurants" className="block px-4 py-3 text-white hover:bg-white/[0.05] rounded-xl">Restaurants</Link>
            {user && <Link to="/orders" className="block px-4 py-3 text-white hover:bg-white/[0.05] rounded-xl">My Orders</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="block px-4 py-3 text-white hover:bg-white/[0.05] rounded-xl">Admin Dashboard</Link>}
            <hr className="border-white/[0.06]" />
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-3 text-white hover:bg-white/[0.05] rounded-xl">Profile</Link>
                <button onClick={logout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-3 text-primary-500 font-semibold">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
