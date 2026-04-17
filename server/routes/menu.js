const express = require('express');
const router = express.Router();
const {
  getMenuByRestaurant, getMenuItem, createMenuItem,
  updateMenuItem, deleteMenuItem, getPopularItems
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/auth');

router.get('/popular', getPopularItems);
router.get('/restaurant/:restaurantId', getMenuByRestaurant);
router.get('/:id', getMenuItem);
router.post('/', protect, admin, createMenuItem);
router.put('/:id', protect, admin, updateMenuItem);
router.delete('/:id', protect, admin, deleteMenuItem);

module.exports = router;
