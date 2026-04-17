const express = require('express');
const router = express.Router();
const {
  getRestaurants, getRestaurant, createRestaurant,
  updateRestaurant, deleteRestaurant, getFeatured
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/auth');

router.get('/featured', getFeatured);
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.post('/', protect, admin, createRestaurant);
router.put('/:id', protect, admin, updateRestaurant);
router.delete('/:id', protect, admin, deleteRestaurant);

module.exports = router;
