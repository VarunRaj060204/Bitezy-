export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    placed: 'text-blue-400 bg-blue-400/20',
    confirmed: 'text-purple-400 bg-purple-400/20',
    preparing: 'text-yellow-400 bg-yellow-400/20',
    out_for_delivery: 'text-orange-400 bg-orange-400/20',
    delivered: 'text-green-400 bg-green-400/20',
    cancelled: 'text-red-400 bg-red-400/20',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/20';
};

export const getStatusLabel = (status) => {
  const labels = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const truncate = (str, len = 50) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};
