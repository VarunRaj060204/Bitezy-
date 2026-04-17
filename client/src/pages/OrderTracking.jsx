import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineCheck, HiOutlineClock } from 'react-icons/hi';
import API from '../utils/api';
import { formatPrice, formatDate, getStatusLabel } from '../utils/helpers';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'out_for_delivery', label: 'On the Way', icon: '🛵' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-white text-2xl font-heading font-bold">Order not found</h2>
          <Link to="/orders" className="btn-primary mt-4 inline-block">View My Orders</Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = order.status === 'cancelled' ? -1 : steps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="text-5xl mb-4">
            {order.status === 'delivered' ? '🎉' : order.status === 'cancelled' ? '❌' : '📦'}
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            {order.status === 'delivered' ? 'Order Delivered!' 
              : order.status === 'cancelled' ? 'Order Cancelled' 
              : 'Tracking Your Order'}
          </h1>
          <p className="text-dark-400">Order #{order._id?.slice(-8).toUpperCase()}</p>
        </div>

        {/* Progress Steps */}
        {order.status !== 'cancelled' && (
          <div className="glass-card p-8 mb-8 animate-slide-up">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-dark-700">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-amber transition-all duration-1000 rounded-full"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />
              </div>

              <div className="relative flex justify-between">
                {steps.map((step, i) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg z-10 transition-all duration-500 ${
                      i <= currentStepIndex
                        ? 'bg-gradient-to-br from-primary-500 to-accent-amber shadow-glow'
                        : 'bg-dark-800 border border-dark-700'
                    }`}>
                      {i < currentStepIndex ? (
                        <HiOutlineCheck className="w-5 h-5 text-white" />
                      ) : i === currentStepIndex ? (
                        <span className="animate-pulse">{step.icon}</span>
                      ) : (
                        <span className="text-dark-600 text-sm">{step.icon}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium text-center ${
                      i <= currentStepIndex ? 'text-primary-400' : 'text-dark-600'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.estimatedDelivery && order.status !== 'delivered' && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
                  <HiOutlineClock className="w-4 h-4 text-primary-400" />
                  <span className="text-primary-400 text-sm font-medium">
                    Estimated delivery: {formatDate(order.estimatedDelivery)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Order Details</h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-dark-500 text-xs">x{item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-white text-sm">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-white font-heading font-semibold text-lg mb-4">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-dark-300"><span>Subtotal</span><span className="text-white">{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between text-dark-300"><span>Delivery</span><span className="text-white">{formatPrice(order.deliveryFee)}</span></div>
                <div className="flex justify-between text-dark-300"><span>Tax</span><span className="text-white">{formatPrice(order.tax)}</span></div>
                <hr className="border-white/[0.06]" />
                <div className="flex justify-between text-white font-bold"><span>Total</span><span className="gradient-text">{formatPrice(order.total)}</span></div>
                <div className="flex justify-between text-dark-400 text-xs mt-2">
                  <span>Payment</span>
                  <span className="uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe'}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white font-heading font-semibold text-lg mb-4">Delivery Address</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                {order.deliveryAddress?.street}<br />
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/orders" className="btn-ghost text-primary-400">← Back to Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
