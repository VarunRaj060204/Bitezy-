import { Link } from 'react-router-dom';
import { HiPlus, HiMinus, HiOutlineTrash, HiArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const { cartItems, restaurant, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, tax, total, itemCount } = useCart();
  const { user } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-6">
            <HiOutlineShoppingBag className="w-12 h-12 text-dark-600" />
          </div>
          <h2 className="text-white text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
          <p className="text-dark-400 mb-8">Looks like you haven't added any items yet</p>
          <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2">
            Browse Restaurants <HiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Your <span className="gradient-text">Cart</span></h1>
            <p className="text-dark-400 mt-1">{itemCount} items from {restaurant?.name}</p>
          </div>
          <button
            onClick={clearCart}
            className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-2"
          >
            <HiOutlineTrash className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Restaurant info */}
            <Link to={`/restaurant/${restaurant?._id}`} className="glass-card p-4 flex items-center gap-4 hover:border-primary-500/20 transition-all">
              <img src={restaurant?.image} alt={restaurant?.name} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <h3 className="text-white font-semibold">{restaurant?.name}</h3>
                <p className="text-dark-400 text-sm">{restaurant?.deliveryTime} • {formatPrice(restaurant?.deliveryFee)} delivery</p>
              </div>
            </Link>

            {cartItems.map(item => (
              <div key={item._id} className="glass-card p-4 flex gap-4 animate-fade-in">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{item.name}</h4>
                      <p className="text-dark-400 text-sm mt-0.5">{formatPrice(item.price)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-dark-800/80 rounded-xl px-1 py-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white hover:bg-white/[0.1]"
                      >
                        <HiMinus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600"
                      >
                        <HiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-white font-heading font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-white font-heading font-semibold text-lg mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-dark-300">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>Delivery Fee</span>
                  <span className="text-white">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>GST (5%)</span>
                  <span className="text-white">{formatPrice(tax)}</span>
                </div>
                <hr className="border-white/[0.06]" />
                <div className="flex justify-between text-white font-heading font-bold text-lg">
                  <span>Total</span>
                  <span className="gradient-text">{formatPrice(total)}</span>
                </div>
              </div>

              {user ? (
                <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 text-center">
                  Proceed to Checkout <HiArrowRight />
                </Link>
              ) : (
                <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 text-center">
                  Login to Checkout <HiArrowRight />
                </Link>
              )}

              <Link to="/restaurants" className="btn-ghost w-full text-center mt-3 block text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
