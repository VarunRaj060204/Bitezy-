const MenuItem = require('../models/MenuItem');

// @desc    Get menu items for a restaurant
// @route   GET /api/menu/restaurant/:restaurantId
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    
    // Group by category
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({ items, grouped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurant', 'name');
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a menu item (admin)
// @route   POST /api/menu
exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a menu item (admin)
// @route   PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a menu item (admin)
// @route   DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular items (across all restaurants)
// @route   GET /api/menu/popular
exports.getPopularItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isPopular: true })
      .populate('restaurant', 'name image')
      .limit(8);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
