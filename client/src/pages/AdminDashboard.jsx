import { useState, useEffect } from 'react';
import { HiOutlineCash, HiOutlineShoppingCart, HiOutlineTruck, HiOutlineCheck, HiOutlineUsers, HiOutlineRefresh } from 'react-icons/hi';
import { MdRestaurant, MdFastfood } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, restRes, usersRes] = await Promise.all([
        API.get('/orders/admin/stats'),
        API.get('/orders/admin/all'),
        API.get('/restaurants'),
        API.get('/auth/users'),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.orders);
      setRestaurants(restRes.data.restaurants);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order updated to ${getStatusLabel(newStatus)}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'orders', label: 'Orders', icon: '📦' },
    { key: 'restaurants', label: 'Restaurants', icon: '🍽️' },
    { key: 'users', label: 'Users', icon: '👥' },
  ];

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <HiOutlineCash className="w-6 h-6" />, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <HiOutlineShoppingCart className="w-6 h-6" />, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <HiOutlineTruck className="w-6 h-6" />, color: 'from-yellow-500/20 to-amber-500/20', iconColor: 'text-yellow-400' },
    { label: 'Delivered', value: stats?.deliveredOrders || 0, icon: <HiOutlineCheck className="w-6 h-6" />, color: 'from-primary-500/20 to-accent-amber/20', iconColor: 'text-primary-400' },
  ];

  const statusOptions = ['', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  const nextStatus = {
    placed: 'confirmed',
    confirmed: 'preparing',
    preparing: 'out_for_delivery',
    out_for_delivery: 'delivered',
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 bg-dark-800 rounded w-1/3 animate-pulse mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="glass-card p-6 h-28 animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Admin <span className="gradient-text">Dashboard</span></h1>
            <p className="text-dark-400 mt-1">Manage your Bitezy platform</p>
          </div>
          <button onClick={fetchDashboardData} className="btn-secondary flex items-center gap-2">
            <HiOutlineRefresh className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center ${card.iconColor}`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-white font-heading font-bold text-2xl">{card.value}</p>
              <p className="text-dark-500 text-sm">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm rounded-xl font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white shadow-glow'
                  : 'bg-white/[0.05] text-dark-300 hover:bg-white/[0.1] border border-white/[0.06]'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-white font-heading font-semibold text-xl mb-4">Recent Orders</h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Order ID</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Customer</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Restaurant</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Total</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.map(order => (
                      <tr key={order._id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                        <td className="px-6 py-4 text-white text-sm font-mono">#{order._id?.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4 text-dark-300 text-sm">{order.user?.name}</td>
                        <td className="px-6 py-4 text-dark-300 text-sm">{order.restaurant?.name}</td>
                        <td className="px-6 py-4 text-white text-sm font-semibold">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4"><span className={`badge ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span></td>
                        <td className="px-6 py-4 text-dark-500 text-xs">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-white font-heading font-semibold text-xl">All Orders</h2>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="input-field w-auto text-sm"
              >
                <option value="">All Status</option>
                {statusOptions.filter(s => s).map(s => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {orders
                .filter(o => !statusFilter || o.status === statusFilter)
                .map(order => (
                <div key={order._id} className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={order.restaurant?.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="text-white font-semibold">#{order._id?.slice(-6).toUpperCase()}</p>
                      <p className="text-dark-400 text-sm">{order.user?.name} • {order.restaurant?.name}</p>
                      <p className="text-dark-500 text-xs">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold">{formatPrice(order.total)}</span>
                    <span className={`badge ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                    {nextStatus[order.status] && (
                      <button
                        onClick={() => updateOrderStatus(order._id, nextStatus[order.status])}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        → {getStatusLabel(nextStatus[order.status])}
                      </button>
                    )}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        className="text-red-400 text-xs hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-400/10"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div>
            <h2 className="text-white font-heading font-semibold text-xl mb-4">Restaurants ({restaurants.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(rest => (
                <div key={rest._id} className="glass-card p-4 flex gap-4">
                  <img src={rest.image} alt={rest.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">{rest.name}</h3>
                    <p className="text-dark-500 text-xs">{rest.cuisine?.join(', ')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400 text-xs">★ {rest.rating}</span>
                      <span className="text-dark-600 text-xs">|</span>
                      <span className={`text-xs ${rest.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                        {rest.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-white font-heading font-semibold text-xl mb-4">Users ({users.length})</h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">User</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Role</th>
                      <th className="text-left text-dark-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-amber flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-white text-sm">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-dark-300 text-sm">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'bg-dark-700 text-dark-300'}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-dark-500 text-xs">{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
