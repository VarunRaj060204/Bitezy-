import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-white/[0.06] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-amber flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-heading font-bold text-white">
                Bite<span className="gradient-text">zy</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6">
              Your favorite food, delivered fast. Discover amazing restaurants, order with ease, and enjoy meals at your doorstep.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-dark-400 hover:text-primary-500 hover:border-primary-500/30 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/restaurants', label: 'Restaurants' },
                { to: '/cart', label: 'Cart' },
                { to: '/profile', label: 'My Account' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-dark-400 hover:text-primary-400 transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-dark-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Partner with Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-dark-400">
              <li className="flex items-center gap-2">
                <HiOutlineLocationMarker className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>42 MG Road, Connaught Place, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineMail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>hello@bitezy.com</span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} Bitezy. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm">
            Made with 🧡 for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
