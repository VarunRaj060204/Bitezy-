import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineEye } from 'react-icons/hi';
import API from '../utils/api';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-8 bg-dark-800 rounded w-1/3 animate-pulse mb-8" />
          {[1,2,3].map(i => <div key={i} className="glass-card p-6 mb-4 h-32 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-8">My <span className="gradient-text">Orders</span></h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-white text-xl font-heading font-semibold mb-2">No orders yet</h3>
            <p className="text-dark-400 mb-6">Your order history will appear here</p>
            <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
          </div>
        ) : (
          <div className="space-y-4 animate-stagger">
            {orders.map(order => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-500/20 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.restaurant?.image}
                    alt={order.restaurant?.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">{order.restaurant?.name}</h3>
                    <p className="text-dark-500 text-xs flex items-center gap-1 mt-0.5">
                      <HiOutlineClock className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-dark-400 text-xs mt-1">
                      {order.items?.length} items • {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <HiOutlineEye className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
