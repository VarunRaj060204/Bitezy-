import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineStar, HiOutlineClock, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';
import API from '../utils/api';
import { formatPrice } from '../utils/helpers';

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const cuisines = ['All', 'Indian', 'American', 'Japanese', 'Italian', 'Chinese', 'Mexican', 'Mediterranean', 'Korean', 'Sushi', 'Pizza', 'Fast Food', 'Healthy', 'Asian', 'Latin'];

  useEffect(() => {
    fetchRestaurants();
  }, [cuisine, sort]);

  useEffect(() => {
    const initSearch = searchParams.get('search');
    const initCuisine = searchParams.get('cuisine');
    if (initSearch) setSearch(initSearch);
    if (initCuisine) setCuisine(initCuisine);
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (cuisine && cuisine !== 'All') params.set('cuisine', cuisine);
      if (sort) params.set('sort', sort);
      
      const { data } = await API.get(`/restaurants?${params.toString()}`);
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">All <span className="gradient-text">Restaurants</span></h1>
          <p className="text-dark-400">Discover and order from the best restaurants near you</p>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass-card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-12"
              />
            </form>
            <div className="flex gap-3">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="input-field w-auto min-w-[160px]"
              >
                <option value="">Sort By</option>
                <option value="rating">Top Rated</option>
                <option value="deliveryTime">Fastest Delivery</option>
                <option value="deliveryFee">Lowest Fee</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2 md:hidden"
              >
                <HiOutlineFilter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cuisine Filter Pills */}
          <div className={`mt-4 flex flex-wrap gap-2 ${showFilters ? '' : 'hidden md:flex'}`}>
            {cuisines.map(c => (
              <button
                key={c}
                onClick={() => setCuisine(c === 'All' ? '' : c)}
                className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                  (c === 'All' && !cuisine) || cuisine === c
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'bg-white/[0.05] text-dark-300 hover:bg-white/[0.1] hover:text-white border border-white/[0.06]'
                }`}
              >
                {c}
              </button>
            ))}
            {cuisine && (
              <button
                onClick={() => setCuisine('')}
                className="px-3 py-2 text-sm rounded-xl text-red-400 bg-red-400/10 hover:bg-red-400/20 flex items-center gap-1 transition-all"
              >
                <HiOutlineX className="w-4 h-4" />Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card p-4 space-y-4 animate-pulse">
                <div className="h-48 bg-dark-800 rounded-xl" />
                <div className="h-4 bg-dark-800 rounded w-3/4" />
                <div className="h-3 bg-dark-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-white text-xl font-heading font-semibold mb-2">No restaurants found</h3>
            <p className="text-dark-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-dark-400 text-sm mb-6">{restaurants.length} restaurants found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
              {restaurants.map(rest => (
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
                    <p className="text-dark-400 text-sm mb-2 line-clamp-1">{rest.description}</p>
                    <p className="text-dark-500 text-xs mb-3">{rest.cuisine?.join(' • ')}</p>
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
                      <span className="text-dark-400 text-xs">{formatPrice(rest.deliveryFee)} fee</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
