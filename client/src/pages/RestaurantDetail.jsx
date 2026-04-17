import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineStar, HiOutlineClock, HiOutlineLocationMarker, HiPlus, HiMinus } from 'react-icons/hi';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, menuRes, reviewRes] = await Promise.all([
          API.get(`/restaurants/${id}`),
          API.get(`/menu/restaurant/${id}`),
          API.get(`/reviews/restaurant/${id}`),
        ]);
        setRestaurant(restRes.data);
        setMenu(menuRes.data.grouped || {});
        setReviews(reviewRes.data);
        const cats = Object.keys(menuRes.data.grouped || {});
        if (cats.length > 0) setActiveCategory(cats[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getCartQuantity = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-72 bg-dark-800 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="h-8 bg-dark-800 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-dark-800 rounded w-2/3 animate-pulse" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-dark-800 rounded-xl animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-white text-2xl font-heading font-bold">Restaurant not found</h2>
        </div>
      </div>
    );
  }

  const categories = Object.keys(menu);

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-72 md:h-80">
        <img
          src={restaurant.coverImage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-glass flex-shrink-0">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {restaurant.isOpen ? (
                  <span className="badge-success text-[10px]">Open Now</span>
                ) : (
                  <span className="badge-error text-[10px]">Closed</span>
                )}
                {restaurant.tags?.map((tag, i) => (
                  <span key={i} className="badge-primary text-[10px]">{tag}</span>
                ))}
              </div>
              <h1 className="text-3xl font-heading font-bold text-white">{restaurant.name}</h1>
              <p className="text-dark-400 text-sm mt-1">{restaurant.cuisine?.join(' • ')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Info Bar */}
        <div className="glass-card p-5 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <HiOutlineStar className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{restaurant.rating}</p>
              <p className="text-dark-500 text-xs">{restaurant.numReviews} reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <HiOutlineClock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{restaurant.deliveryTime}</p>
              <p className="text-dark-500 text-xs">Delivery time</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 font-bold text-sm">₹</span>
            </div>
            <div>
              <p className="text-white font-semibold">{formatPrice(restaurant.deliveryFee)}</p>
              <p className="text-dark-500 text-xs">Delivery fee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <HiOutlineLocationMarker className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{restaurant.address?.city}</p>
              <p className="text-dark-500 text-xs">{restaurant.openingHours}</p>
            </div>
          </div>
        </div>

        <p className="text-dark-300 mb-8 leading-relaxed">{restaurant.description}</p>

        {/* Menu */}
        <h2 className="section-title mb-6">Menu</h2>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-sm rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white shadow-glow'
                  : 'bg-white/[0.05] text-dark-300 hover:bg-white/[0.1] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {menu[activeCategory]?.map(item => (
            <div key={item._id} className="glass-card p-4 flex gap-4 group hover:border-primary-500/20 transition-all duration-200">
              <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.isVeg && (
                        <span className="w-4 h-4 rounded border border-green-400 flex items-center justify-center flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        </span>
                      )}
                      <h4 className="text-white font-semibold">{item.name}</h4>
                      {item.isPopular && <span className="badge-primary text-[9px]">Popular</span>}
                    </div>
                    <p className="text-dark-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary-400 font-heading font-bold text-lg">{formatPrice(item.price)}</span>
                  {!item.isAvailable ? (
                    <span className="text-dark-500 text-sm">Unavailable</span>
                  ) : getCartQuantity(item._id) > 0 ? (
                    <div className="flex items-center gap-3 bg-dark-800/80 rounded-xl px-2 py-1">
                      <button
                        onClick={() => {
                          const { updateQuantity } = require('../context/CartContext');
                        }}
                        className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white hover:bg-white/[0.1] transition-colors"
                      >
                        <HiMinus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-semibold w-6 text-center">{getCartQuantity(item._id)}</span>
                      <button
                        onClick={() => addToCart(item, restaurant)}
                        className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                      >
                        <HiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, restaurant)}
                      className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
                    >
                      <HiPlus className="w-4 h-4" /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title mb-6">Reviews</h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-amber flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{review.user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{review.user?.name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <HiOutlineStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-dark-300 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
