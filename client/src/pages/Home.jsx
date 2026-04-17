import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineClock, HiOutlineStar, HiOutlineTruck, HiOutlineShieldCheck, HiArrowRight } from 'react-icons/hi';
import { MdRestaurantMenu, MdDeliveryDining, MdFastfood } from 'react-icons/md';
import API from '../utils/api';
import { formatPrice } from '../utils/helpers';

const cuisineCategories = [
  { name: 'Pizza', emoji: '🍕', color: 'from-red-500/20 to-orange-500/20' },
  { name: 'Burger', emoji: '🍔', color: 'from-yellow-500/20 to-amber-500/20' },
  { name: 'Sushi', emoji: '🍣', color: 'from-pink-500/20 to-rose-500/20' },
  { name: 'Indian', emoji: '🍛', color: 'from-orange-500/20 to-red-500/20' },
  { name: 'Chinese', emoji: '🥡', color: 'from-red-500/20 to-yellow-500/20' },
  { name: 'Mexican', emoji: '🌮', color: 'from-green-500/20 to-yellow-500/20' },
  { name: 'Korean', emoji: '🥘', color: 'from-red-500/20 to-pink-500/20' },
  { name: 'Healthy', emoji: '🥗', color: 'from-green-500/20 to-emerald-500/20' },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([
          API.get('/restaurants/featured'),
          API.get('/menu/popular'),
        ]);
        setFeaturedRestaurants(restRes.data);
        setPopularItems(menuRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-hero-gradient overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-amber/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-primary-400 text-sm font-medium">Free delivery on first order</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight mb-6">
                Delicious Food,{' '}
                <span className="gradient-text">Delivered</span>{' '}
                to Your Door
              </h1>
              
              <p className="text-dark-400 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                Discover amazing restaurants near you. Order your favorite meals and track delivery in real-time.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-lg mb-8">
                <div className="flex items-center bg-dark-800/80 border border-white/[0.08] rounded-2xl p-1.5 focus-within:border-primary-500/40 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all duration-200">
                  <HiOutlineSearch className="w-5 h-5 text-dark-400 ml-4" />
                  <input
                    type="text"
                    placeholder="Search restaurants or cuisines..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-3 text-white placeholder-dark-400 outline-none font-body"
                  />
                  <button type="submit" className="btn-primary py-3 px-6 rounded-xl text-sm">
                    Search
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div className="flex items-center gap-8">
                {[
                  { value: '500+', label: 'Restaurants' },
                  { value: '10k+', label: 'Happy Customers' },
                  { value: '15min', label: 'Avg. Delivery' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                    <div className="text-dark-500 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:flex justify-center relative">
              <div className="relative animate-float">
                <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-br from-primary-500/20 to-accent-amber/20 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop"
                    alt="Delicious food"
                    className="w-[360px] h-[360px] rounded-full object-cover shadow-2xl"
                  />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 glass-card px-4 py-3 flex items-center gap-2 animate-bounce-subtle shadow-glass">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <HiOutlineClock className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Fast Delivery</p>
                    <p className="text-dark-400 text-xs">15-30 min</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 glass-card px-4 py-3 flex items-center gap-2 animate-bounce-subtle shadow-glass" style={{ animationDelay: '1s' }}>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">4.9 Rating</p>
                    <p className="text-dark-400 text-xs">10k+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Browse by <span className="gradient-text">Cuisine</span></h2>
            <p className="section-subtitle">Explore your favorite food categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {cuisineCategories.map((cat, i) => (
              <Link
                key={i}
                to={`/restaurants?cuisine=${cat.name}`}
                className="glass-card-hover p-4 flex flex-col items-center gap-3 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>
                <span className="text-dark-300 text-sm font-medium group-hover:text-white transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Featured <span className="gradient-text">Restaurants</span></h2>
              <p className="section-subtitle">Top-rated restaurants loved by our customers</p>
            </div>
            <Link to="/restaurants" className="hidden md:flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="glass-card p-4 space-y-4 animate-pulse">
                  <div className="h-48 bg-dark-800 rounded-xl" />
                  <div className="h-4 bg-dark-800 rounded w-3/4" />
                  <div className="h-3 bg-dark-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
              {featuredRestaurants.map(rest => (
                <Link
                  key={rest._id}
                  to={`/restaurant/${rest._id}`}
                  className="glass-card-hover overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {rest.tags?.slice(0, 2).map((tag, j) => (
                        <span key={j} className="badge-primary text-[10px]">{tag}</span>
                      ))}
                    </div>
                    {rest.isOpen ? (
                      <span className="absolute top-3 right-3 badge-success text-[10px]">Open</span>
                    ) : (
                      <span className="absolute top-3 right-3 badge-error text-[10px]">Closed</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-heading font-semibold text-lg mb-1">{rest.name}</h3>
                    <p className="text-dark-400 text-sm mb-3 line-clamp-1">{rest.cuisine?.join(' • ')}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                          <span className="text-white text-sm font-semibold">{rest.rating}</span>
                          <span className="text-dark-500 text-xs">({rest.numReviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-dark-400">
                          <HiOutlineClock className="w-4 h-4" />
                          <span className="text-xs">{rest.deliveryTime}</span>
                        </div>
                      </div>
                      <span className="text-dark-400 text-xs">{formatPrice(rest.deliveryFee)} delivery</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/restaurants" className="btn-secondary inline-flex items-center gap-2">
              View All Restaurants <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Popular <span className="gradient-text">Dishes</span></h2>
            <p className="section-subtitle">Most ordered items this week</p>
          </div>

          {!loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
              {popularItems.slice(0, 8).map(item => (
                <Link
                  key={item._id}
                  to={`/restaurant/${item.restaurant?._id || item.restaurant}`}
                  className="glass-card-hover overflow-hidden group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                    {item.isVeg && (
                      <span className="absolute top-2 left-2 w-5 h-5 rounded border-2 border-green-400 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-1 truncate">{item.name}</h4>
                    <p className="text-dark-500 text-xs mb-2 truncate">{item.restaurant?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-400 font-heading font-bold">{formatPrice(item.price)}</span>
                      <span className="badge-primary text-[10px]">Popular</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">How <span className="gradient-text">Bitezy</span> Works</h2>
            <p className="section-subtitle">Order your favorite food in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MdRestaurantMenu className="w-8 h-8" />,
                title: 'Choose Restaurant',
                desc: 'Browse hundreds of restaurants and find your perfect meal from our curated selection.',
                color: 'from-blue-500/20 to-cyan-500/20',
                iconColor: 'text-blue-400',
                step: '01'
              },
              {
                icon: <MdFastfood className="w-8 h-8" />,
                title: 'Place Your Order',
                desc: 'Customize your meal, add to cart, and checkout securely with Stripe or Cash on Delivery.',
                color: 'from-primary-500/20 to-amber-500/20',
                iconColor: 'text-primary-400',
                step: '02'
              },
              {
                icon: <MdDeliveryDining className="w-8 h-8" />,
                title: 'Fast Delivery',
                desc: 'Track your order in real-time as our delivery partners bring your food hot and fresh.',
                color: 'from-green-500/20 to-emerald-500/20',
                iconColor: 'text-green-400',
                step: '03'
              },
            ].map((step, i) => (
              <div key={i} className="glass-card p-8 text-center group hover:border-primary-500/30 transition-all duration-300 relative">
                <span className="absolute top-4 right-4 text-dark-800 font-heading font-bold text-5xl select-none">{step.step}</span>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 ${step.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <h3 className="text-white font-heading font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-500/10 to-accent-amber/10" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-amber/10 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                Ready to <span className="gradient-text">Order</span>?
              </h2>
              <p className="text-dark-400 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of food lovers. Get your first order delivered for free!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/restaurants" className="btn-primary text-lg py-4 px-8 flex items-center gap-2">
                  Order Now <HiArrowRight />
                </Link>
                <Link to="/register" className="btn-secondary text-lg py-4 px-8">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
