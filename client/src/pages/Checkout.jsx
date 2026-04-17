import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCreditCard, HiOutlineCash, HiOutlineLocationMarker, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

const Checkout = () => {
  const { cartItems, restaurant, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const [address, setAddress] = useState({
    street: defaultAddress?.street || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zipCode: defaultAddress?.zipCode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);

  const placeOrder = async (paymentData = {}) => {
    const orderData = {
      restaurant: restaurant._id,
      items: cartItems.map(item => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      deliveryAddress: address,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod,
      ...paymentData,
    };

    const { data: order } = await API.post('/orders', orderData);
    clearCart();
    toast.success('Order placed successfully! 🎉');
    navigate(`/order/${order._id}`);
  };

  const handleRazorpayPayment = async () => {
    try {
      // Step 1: Create Razorpay order on backend
      const { data } = await API.post('/payment/create-order', { amount: total });

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Bitezy',
        description: `Order from ${restaurant.name}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment signature on backend
            const verifyRes = await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.verified) {
              // Step 4: Create the order in our database
              await placeOrder({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
              });
            } else {
              toast.error('Payment verification failed. Please try again.');
            }
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
            console.error('Verification error:', err);
          }
          setPlacing(false);
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#FF6B35',
          backdrop_color: 'rgba(0,0,0,0.7)',
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setPlacing(false);
        toast.error(response.error?.description || 'Payment failed. Please try again.');
      });
      razorpay.open();
    } catch (error) {
      setPlacing(false);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      console.error('Razorpay error:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.zipCode) {
      toast.error('Please fill in your delivery address');
      return;
    }

    setPlacing(true);

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      // Cash on Delivery
      try {
        await placeOrder();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to place order');
      } finally {
        setPlacing(false);
      }
    }
  };

  if (!cartItems.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="glass-card p-6">
              <h2 className="text-white font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <HiOutlineLocationMarker className="w-5 h-5 text-primary-500" />
                Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-dark-400 text-sm mb-1.5 block">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                    placeholder="123 Main Street, Apt 4B"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-dark-400 text-sm mb-1.5 block">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                    placeholder="Mumbai"
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-dark-400 text-sm mb-1.5 block">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                      placeholder="MH"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-dark-400 text-sm mb-1.5 block">PIN Code</label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={e => setAddress(p => ({ ...p, zipCode: e.target.value }))}
                      placeholder="400001"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-6">
              <h2 className="text-white font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <HiOutlineCreditCard className="w-5 h-5 text-primary-500" />
                Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'bg-primary-500/20' : 'bg-white/[0.05]'
                  }`}>
                    <HiOutlineCash className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-primary-400' : 'text-dark-400'}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${paymentMethod === 'cod' ? 'text-white' : 'text-dark-300'}`}>Cash on Delivery</p>
                    <p className="text-dark-500 text-xs">Pay when you receive</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    paymentMethod === 'razorpay'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'razorpay' ? 'bg-primary-500/20' : 'bg-white/[0.05]'
                  }`}>
                    <HiOutlineCreditCard className={`w-5 h-5 ${paymentMethod === 'razorpay' ? 'text-primary-400' : 'text-dark-400'}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${paymentMethod === 'razorpay' ? 'text-white' : 'text-dark-300'}`}>Pay Online</p>
                    <p className="text-dark-500 text-xs">Card, UPI, Net Banking</p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'razorpay' && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <HiShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-300 text-sm">Secured by Razorpay. Supports Cards, UPI, Net Banking & Wallets.</p>
                </div>
              )}
            </div>

            {/* Order Items Preview */}
            <div className="glass-card p-6">
              <h2 className="text-white font-heading font-semibold text-lg mb-4">Order Items</h2>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-dark-500 text-xs">x{item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-white font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-white font-heading font-semibold text-lg mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-dark-300"><span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-dark-300"><span>Delivery Fee</span><span className="text-white">{formatPrice(deliveryFee)}</span></div>
                <div className="flex justify-between text-dark-300"><span>GST (5%)</span><span className="text-white">{formatPrice(tax)}</span></div>
                <hr className="border-white/[0.06]" />
                <div className="flex justify-between text-white font-heading font-bold text-lg">
                  <span>Total</span>
                  <span className="gradient-text">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {placing ? (
                  <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                ) : paymentMethod === 'razorpay' ? (
                  <>Pay & Place Order 💳</>
                ) : (
                  <>Place Order 🚀</>
                )}
              </button>

              <p className="text-dark-500 text-xs text-center mt-4">
                By placing this order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
