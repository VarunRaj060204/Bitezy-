require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const restaurants = [
  {
    name: 'The Spice Garden',
    description: 'Authentic Indian cuisine with traditional recipes passed down through generations. Experience the rich flavors of India.',
    cuisine: ['Indian', 'Asian'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
    coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200',
    address: { street: '12 MG Road', city: 'Mumbai', state: 'MH', zipCode: '400001' },
    rating: 4.7,
    numReviews: 128,
    deliveryTime: '25-35 min',
    deliveryFee: 49,
    minOrder: 199,
    isOpen: true,
    openingHours: '11:00 AM - 11:00 PM',
    tags: ['Trending', 'Top Rated'],
    featured: true
  },
  {
    name: 'Burger Bliss',
    description: 'Premium handcrafted burgers made with 100% Angus beef. Juicy, loaded, and absolutely divine.',
    cuisine: ['American', 'Fast Food'],
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
    address: { street: '45 Connaught Place', city: 'New Delhi', state: 'DL', zipCode: '110001' },
    rating: 4.5,
    numReviews: 89,
    deliveryTime: '20-30 min',
    deliveryFee: 39,
    minOrder: 149,
    isOpen: true,
    openingHours: '10:00 AM - 12:00 AM',
    tags: ['Popular', 'Fast Delivery'],
    featured: true
  },
  {
    name: 'Sakura Sushi',
    description: 'Premium Japanese sushi and sashimi crafted by master chefs. Fresh fish flown in daily from Tokyo.',
    cuisine: ['Japanese', 'Sushi'],
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600',
    coverImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200',
    address: { street: '78 Indiranagar', city: 'Bangalore', state: 'KA', zipCode: '560038' },
    rating: 4.8,
    numReviews: 215,
    deliveryTime: '30-45 min',
    deliveryFee: 69,
    minOrder: 299,
    isOpen: true,
    openingHours: '12:00 PM - 10:00 PM',
    tags: ['Premium', 'Top Rated'],
    featured: true
  },
  {
    name: 'Pizza Paradise',
    description: 'Wood-fired Neapolitan pizza with imported Italian ingredients. Every bite transports you to Naples.',
    cuisine: ['Italian', 'Pizza'],
    image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600',
    coverImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200',
    address: { street: '23 Park Street', city: 'Kolkata', state: 'WB', zipCode: '700016' },
    rating: 4.6,
    numReviews: 167,
    deliveryTime: '20-30 min',
    deliveryFee: 49,
    minOrder: 199,
    isOpen: true,
    openingHours: '11:00 AM - 11:30 PM',
    tags: ['Best Seller', 'Fast Delivery'],
    featured: true
  },
  {
    name: 'Dragon Wok',
    description: 'Flaming wok specialties from Sichuan to Canton. Bold flavors, authentic techniques, unforgettable taste.',
    cuisine: ['Chinese', 'Asian'],
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
    address: { street: '56 Anna Salai', city: 'Chennai', state: 'TN', zipCode: '600002' },
    rating: 4.4,
    numReviews: 93,
    deliveryTime: '25-40 min',
    deliveryFee: 49,
    minOrder: 199,
    isOpen: true,
    openingHours: '11:30 AM - 10:30 PM',
    tags: ['Popular'],
    featured: true
  },
  {
    name: 'Taco Fiesta',
    description: 'Street-style Mexican tacos, burritos, and quesadillas. Handmade tortillas, fresh salsas, and bold spices.',
    cuisine: ['Mexican', 'Latin'],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
    address: { street: '89 FC Road', city: 'Pune', state: 'MH', zipCode: '411004' },
    rating: 4.3,
    numReviews: 74,
    deliveryTime: '15-25 min',
    deliveryFee: 29,
    minOrder: 149,
    isOpen: true,
    openingHours: '10:00 AM - 11:00 PM',
    tags: ['Budget Friendly', 'Fast Delivery'],
    featured: false
  },
  {
    name: 'The Mediterranean',
    description: 'Fresh Mediterranean bowls, hummus platters, and grilled meats. Healthy, flavorful, and satisfying.',
    cuisine: ['Mediterranean', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
    coverImage: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200',
    address: { street: '34 Jubilee Hills', city: 'Hyderabad', state: 'TS', zipCode: '500033' },
    rating: 4.5,
    numReviews: 112,
    deliveryTime: '25-35 min',
    deliveryFee: 49,
    minOrder: 199,
    isOpen: true,
    openingHours: '11:00 AM - 10:00 PM',
    tags: ['Healthy', 'Trending'],
    featured: false
  },
  {
    name: 'Seoul Kitchen',
    description: 'Korean BBQ, bibimbap, and fried chicken done right. Authentic Korean street food meets modern dining.',
    cuisine: ['Korean', 'Asian'],
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600',
    coverImage: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1200',
    address: { street: '67 Linking Road, Bandra', city: 'Mumbai', state: 'MH', zipCode: '400050' },
    rating: 4.6,
    numReviews: 95,
    deliveryTime: '30-40 min',
    deliveryFee: 59,
    minOrder: 249,
    isOpen: true,
    openingHours: '12:00 PM - 11:00 PM',
    tags: ['New', 'Popular'],
    featured: false
  },
  {
    name: 'Dosa Express',
    description: 'Crispy South Indian dosas, fluffy idlis, and aromatic filter coffee. A taste of Chennai in every bite.',
    cuisine: ['South Indian', 'Indian'],
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600',
    coverImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200',
    address: { street: '15 Brigade Road', city: 'Bangalore', state: 'KA', zipCode: '560025' },
    rating: 4.6,
    numReviews: 203,
    deliveryTime: '15-25 min',
    deliveryFee: 29,
    minOrder: 99,
    isOpen: true,
    openingHours: '7:00 AM - 10:00 PM',
    tags: ['Budget Friendly', 'Top Rated'],
    featured: true
  },
  {
    name: 'Tandoori Nights',
    description: 'Smoky tandoor-grilled kebabs, succulent tikkas, and rich gravies. The ultimate North Indian feast.',
    cuisine: ['North Indian', 'Indian'],
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200',
    address: { street: '28 Hazratganj', city: 'Lucknow', state: 'UP', zipCode: '226001' },
    rating: 4.8,
    numReviews: 178,
    deliveryTime: '30-40 min',
    deliveryFee: 49,
    minOrder: 249,
    isOpen: true,
    openingHours: '12:00 PM - 11:30 PM',
    tags: ['Premium', 'Trending'],
    featured: true
  },
  {
    name: 'Chaat Corner',
    description: 'Tangy, spicy, and irresistible Indian street food. From pani puri to bhel puri — every bite is a flavor explosion.',
    cuisine: ['Street Food', 'Indian'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
    coverImage: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=1200',
    address: { street: '92 Chandni Chowk', city: 'New Delhi', state: 'DL', zipCode: '110006' },
    rating: 4.4,
    numReviews: 156,
    deliveryTime: '15-20 min',
    deliveryFee: 19,
    minOrder: 79,
    isOpen: true,
    openingHours: '10:00 AM - 10:00 PM',
    tags: ['Budget Friendly', 'Fast Delivery'],
    featured: false
  },
  {
    name: 'Biryani House',
    description: 'Slow-cooked Hyderabadi dum biryani with fragrant basmati rice, tender meat, and secret spice blends passed down for generations.',
    cuisine: ['Biryani', 'Indian'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
    coverImage: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=1200',
    address: { street: '41 Charminar Road', city: 'Hyderabad', state: 'TS', zipCode: '500002' },
    rating: 4.9,
    numReviews: 312,
    deliveryTime: '30-45 min',
    deliveryFee: 39,
    minOrder: 199,
    isOpen: true,
    openingHours: '11:00 AM - 11:00 PM',
    tags: ['Best Seller', 'Top Rated'],
    featured: true
  }
];

const menuItemsMap = {
  'The Spice Garden': [
    { name: 'Butter Chicken', description: 'Tender chicken in rich, creamy tomato-butter sauce with aromatic spices', price: 349, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', category: 'Main Course', isVeg: false, isPopular: true },
    { name: 'Paneer Tikka Masala', description: 'Cottage cheese cubes in spiced masala gravy with bell peppers', price: 299, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: 'Main Course', isVeg: true, isPopular: true },
    { name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and saffron', price: 379, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', category: 'Main Course', isVeg: false, isPopular: true },
    { name: 'Samosa (4 pcs)', description: 'Crispy pastry filled with spiced potatoes and peas', price: 99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', category: 'Starters', isVeg: true, isPopular: true },
    { name: 'Garlic Naan', description: 'Soft flatbread brushed with garlic butter', price: 69, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', category: 'Breads', isVeg: true, isPopular: false },
    { name: 'Mango Lassi', description: 'Creamy yogurt smoothie blended with fresh mangoes', price: 89, image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400', category: 'Beverages', isVeg: true, isPopular: false },
    { name: 'Dal Makhani', description: 'Slow-cooked black lentils in buttery tomato cream', price: 249, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'Main Course', isVeg: true, isPopular: false },
    { name: 'Gulab Jamun', description: 'Soft milk dumplings soaked in rose-flavored syrup', price: 99, image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'Burger Bliss': [
    { name: 'Classic Smash Burger', description: 'Double smashed Angus patties, American cheese, special sauce, pickles', price: 249, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'Burgers', isVeg: false, isPopular: true },
    { name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, cheddar, caramelized onions', price: 299, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', category: 'Burgers', isVeg: false, isPopular: true },
    { name: 'Truffle Mushroom Burger', description: 'Sautéed mushrooms, truffle mayo, Swiss cheese, arugula', price: 349, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee15d?w=400', category: 'Burgers', isVeg: false, isPopular: false },
    { name: 'Veggie Beyond Burger', description: 'Plant-based patty, avocado, lettuce, tomato, vegan mayo', price: 279, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', category: 'Burgers', isVeg: true, isPopular: false },
    { name: 'Loaded Fries', description: 'Crispy fries topped with cheese, bacon bits, and jalapeños', price: 149, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', category: 'Sides', isVeg: false, isPopular: true },
    { name: 'Milkshake', description: 'Thick and creamy vanilla, chocolate, or strawberry milkshake', price: 129, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', category: 'Beverages', isVeg: true, isPopular: false },
    { name: 'Onion Rings', description: 'Beer-battered crispy onion rings with ranch dipping sauce', price: 119, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', category: 'Sides', isVeg: true, isPopular: false },
  ],
  'Sakura Sushi': [
    { name: 'Rainbow Roll', description: 'California roll topped with assorted sashimi and avocado', price: 549, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', category: 'Signature Rolls', isVeg: false, isPopular: true },
    { name: 'Dragon Roll', description: 'Eel and cucumber inside, topped with avocado and unagi sauce', price: 599, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', category: 'Signature Rolls', isVeg: false, isPopular: true },
    { name: 'Salmon Sashimi', description: '8 pieces of premium fresh Atlantic salmon', price: 499, image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400', category: 'Sashimi', isVeg: false, isPopular: true },
    { name: 'Tempura Udon', description: 'Thick udon noodles in dashi broth with shrimp tempura', price: 399, image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=400', category: 'Noodles', isVeg: false, isPopular: false },
    { name: 'Edamame', description: 'Steamed young soybeans with sea salt', price: 149, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400', category: 'Starters', isVeg: true, isPopular: false },
    { name: 'Miso Soup', description: 'Traditional Japanese soup with tofu, seaweed, and scallions', price: 99, image: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=400', category: 'Soups', isVeg: true, isPopular: false },
    { name: 'Matcha Ice Cream', description: 'Premium Japanese green tea ice cream', price: 179, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'Pizza Paradise': [
    { name: 'Margherita', description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil', price: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category: 'Classic Pizzas', isVeg: true, isPopular: true },
    { name: 'Pepperoni Supreme', description: 'Double pepperoni, mozzarella, original tomato sauce', price: 399, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category: 'Classic Pizzas', isVeg: false, isPopular: true },
    { name: 'BBQ Chicken Pizza', description: 'Grilled chicken, red onions, cilantro, BBQ sauce, smoked gouda', price: 449, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category: 'Specialty Pizzas', isVeg: false, isPopular: false },
    { name: 'Four Cheese', description: 'Mozzarella, gorgonzola, parmesan, fontina on white sauce', price: 379, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', category: 'Classic Pizzas', isVeg: true, isPopular: true },
    { name: 'Garlic Knots', description: 'Fresh-baked garlic butter knots with marinara dipping sauce', price: 129, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400', category: 'Sides', isVeg: true, isPopular: false },
    { name: 'Tiramisu', description: 'Classic Italian coffee-flavored layered dessert', price: 199, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'Dragon Wok': [
    { name: 'Kung Pao Chicken', description: 'Wok-tossed chicken with peanuts, chili peppers, and Sichuan spices', price: 299, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', category: 'Main Course', isVeg: false, isPopular: true },
    { name: 'Sweet & Sour Pork', description: 'Crispy pork in tangy sweet and sour pineapple sauce', price: 279, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', category: 'Main Course', isVeg: false, isPopular: false },
    { name: 'Vegetable Fried Rice', description: 'Wok-fried jasmine rice with seasonal vegetables and eggs', price: 199, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', category: 'Rice', isVeg: true, isPopular: false },
    { name: 'Dim Sum Platter', description: 'Assorted steamed dumplings: har gow, siu mai, and char siu bao', price: 249, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', category: 'Starters', isVeg: false, isPopular: true },
    { name: 'Chow Mein', description: 'Stir-fried egg noodles with chicken and vegetables', price: 229, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', category: 'Noodles', isVeg: false, isPopular: false },
    { name: 'Spring Rolls (4 pcs)', description: 'Golden crispy rolls filled with vegetables and glass noodles', price: 129, image: 'https://images.unsplash.com/photo-1548507543-8e82e24e95e3?w=400', category: 'Starters', isVeg: true, isPopular: false },
  ],
  'Taco Fiesta': [
    { name: 'Street Tacos (3 pcs)', description: 'Corn tortillas with carne asada, cilantro, onion, and lime', price: 199, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400', category: 'Tacos', isVeg: false, isPopular: true },
    { name: 'Chicken Burrito', description: 'Flour tortilla stuffed with grilled chicken, rice, beans, cheese, and salsa', price: 229, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', category: 'Burritos', isVeg: false, isPopular: true },
    { name: 'Loaded Nachos', description: 'Crispy chips topped with queso, guacamole, sour cream, and jalapeños', price: 179, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', category: 'Starters', isVeg: true, isPopular: false },
    { name: 'Quesadilla', description: 'Grilled flour tortilla with melted cheese, chicken, and peppers', price: 179, image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400', category: 'Specialties', isVeg: false, isPopular: false },
    { name: 'Churros', description: 'Cinnamon-sugar fried dough sticks with chocolate dipping sauce', price: 119, image: 'https://images.unsplash.com/photo-1624371414361-e670246e0d96?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'The Mediterranean': [
    { name: 'Falafel Bowl', description: 'Crispy falafel over hummus, tabbouleh, pickled vegetables, tahini', price: 279, image: 'https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=400', category: 'Bowls', isVeg: true, isPopular: true },
    { name: 'Chicken Shawarma Plate', description: 'Slow-roasted spiced chicken with rice, salad, and garlic sauce', price: 329, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', category: 'Plates', isVeg: false, isPopular: true },
    { name: 'Hummus & Pita', description: 'Creamy chickpea hummus with warm pita bread and olive oil', price: 149, image: 'https://images.unsplash.com/photo-1637361973-1a251ab67452?w=400', category: 'Starters', isVeg: true, isPopular: false },
    { name: 'Lamb Kofta', description: 'Seasoned ground lamb skewers with tzatziki and grilled vegetables', price: 399, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Plates', isVeg: false, isPopular: false },
    { name: 'Baklava', description: 'Flaky phyllo pastry with crushed walnuts and honey syrup', price: 119, image: 'https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'Seoul Kitchen': [
    { name: 'Korean Fried Chicken', description: 'Double-fried crispy chicken glazed in gochujang sauce', price: 329, image: 'https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=400', category: 'Main Course', isVeg: false, isPopular: true },
    { name: 'Bibimbap', description: 'Mixed rice bowl with vegetables, beef, egg, and gochujang', price: 299, image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400', category: 'Bowls', isVeg: false, isPopular: true },
    { name: 'Japchae', description: 'Sweet potato glass noodles stir-fried with vegetables and sesame', price: 249, image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400', category: 'Noodles', isVeg: true, isPopular: false },
    { name: 'Kimchi Jjigae', description: 'Spicy kimchi stew with tofu, pork, and vegetables', price: 279, image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400', category: 'Soups', isVeg: false, isPopular: false },
    { name: 'Tteokbokki', description: 'Spicy rice cakes in gochujang sauce with fish cakes', price: 179, image: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=400', category: 'Starters', isVeg: false, isPopular: false },
  ],
  'Dosa Express': [
    { name: 'Masala Dosa', description: 'Crispy golden crepe filled with spiced potato masala, served with sambar and chutney', price: 129, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', category: 'Dosas', isVeg: true, isPopular: true },
    { name: 'Mysore Masala Dosa', description: 'Spicy red chutney spread inside a crispy dosa with potato filling', price: 149, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400', category: 'Dosas', isVeg: true, isPopular: true },
    { name: 'Rava Dosa', description: 'Crispy semolina crepe with onions and green chilies', price: 119, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400', category: 'Dosas', isVeg: true, isPopular: false },
    { name: 'Idli Sambar (4 pcs)', description: 'Fluffy steamed rice cakes served with hot sambar and coconut chutney', price: 79, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', category: 'Breakfast', isVeg: true, isPopular: true },
    { name: 'Medu Vada (3 pcs)', description: 'Crispy fried lentil fritters with sambar and chutney', price: 89, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', category: 'Breakfast', isVeg: true, isPopular: false },
    { name: 'Filter Coffee', description: 'Authentic South Indian filter coffee with frothy milk', price: 49, image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400', category: 'Beverages', isVeg: true, isPopular: true },
    { name: 'Pongal', description: 'Creamy rice and lentil porridge tempered with ghee, pepper, and cashews', price: 99, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'Breakfast', isVeg: true, isPopular: false },
    { name: 'Kesari Bath', description: 'Sweet semolina pudding with saffron, cashews, and raisins', price: 69, image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'Tandoori Nights': [
    { name: 'Tandoori Chicken (Half)', description: 'Marinated in yogurt and spices, cooked in tandoor to smoky perfection', price: 349, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', category: 'Tandoor Specials', isVeg: false, isPopular: true },
    { name: 'Paneer Tikka', description: 'Char-grilled cottage cheese cubes marinated in spiced yogurt', price: 279, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', category: 'Tandoor Specials', isVeg: true, isPopular: true },
    { name: 'Seekh Kebab (6 pcs)', description: 'Minced lamb skewers with herbs and spices from the tandoor', price: 399, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Tandoor Specials', isVeg: false, isPopular: true },
    { name: 'Rogan Josh', description: 'Slow-cooked Kashmiri lamb curry with aromatic spices and saffron', price: 449, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', category: 'Main Course', isVeg: false, isPopular: false },
    { name: 'Shahi Paneer', description: 'Cottage cheese in rich, cashew-cream tomato gravy with mild spices', price: 299, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: 'Main Course', isVeg: true, isPopular: false },
    { name: 'Rumali Roti', description: 'Paper-thin soft flatbread tossed on an inverted griddle', price: 49, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', category: 'Breads', isVeg: true, isPopular: false },
    { name: 'Butter Naan', description: 'Fluffy leavened bread brushed with butter from the tandoor', price: 59, image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=400', category: 'Breads', isVeg: true, isPopular: false },
    { name: 'Phirni', description: 'Chilled ground rice pudding flavored with cardamom and topped with pistachios', price: 89, image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'Chaat Corner': [
    { name: 'Pani Puri (8 pcs)', description: 'Crispy hollow puris filled with spiced water, tamarind, and potato', price: 69, image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400', category: 'Chaat', isVeg: true, isPopular: true },
    { name: 'Bhel Puri', description: 'Puffed rice tossed with sev, onions, chutneys, and crispy puris', price: 79, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400', category: 'Chaat', isVeg: true, isPopular: true },
    { name: 'Aloo Tikki', description: 'Crispy potato patties topped with yogurt, chutneys, and sev', price: 89, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', category: 'Chaat', isVeg: true, isPopular: true },
    { name: 'Chole Bhature', description: 'Spicy chickpea curry with fluffy deep-fried bread', price: 129, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400', category: 'Main Course', isVeg: true, isPopular: true },
    { name: 'Dahi Bhalle', description: 'Soft lentil fritters soaked in sweetened yogurt with tangy chutneys', price: 79, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', category: 'Chaat', isVeg: true, isPopular: false },
    { name: 'Raj Kachori', description: 'Giant crispy shell filled with curd, chutneys, potatoes, and sprouts', price: 99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', category: 'Chaat', isVeg: true, isPopular: false },
    { name: 'Masala Chai', description: 'Spiced Indian tea brewed with ginger, cardamom, and cinnamon', price: 29, image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400', category: 'Beverages', isVeg: true, isPopular: false },
    { name: 'Jalebi', description: 'Crispy spiral-shaped sweets soaked in warm sugar syrup with saffron', price: 69, image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ],
  'Biryani House': [
    { name: 'Hyderabadi Chicken Dum Biryani', description: 'Slow-cooked aromatic basmati rice layered with spiced chicken, saffron, and fried onions', price: 349, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', category: 'Biryani', isVeg: false, isPopular: true },
    { name: 'Mutton Biryani', description: 'Tender mutton pieces cooked in fragrant long-grain rice with secret spice blend', price: 449, image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400', category: 'Biryani', isVeg: false, isPopular: true },
    { name: 'Veg Biryani', description: 'Aromatic rice with mixed seasonal vegetables, paneer, and whole spices', price: 249, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b7?w=400', category: 'Biryani', isVeg: true, isPopular: true },
    { name: 'Egg Biryani', description: 'Fragrant basmati biryani with boiled eggs and rich masala gravy', price: 229, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400', category: 'Biryani', isVeg: false, isPopular: false },
    { name: 'Double Ka Meetha', description: 'Hyderabadi bread pudding soaked in sweetened milk with dry fruits', price: 99, image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400', category: 'Desserts', isVeg: true, isPopular: false },
    { name: 'Mirchi Ka Salan', description: 'Tangy peanut-sesame gravy with green chilies, served as biryani accompaniment', price: 129, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', category: 'Sides', isVeg: true, isPopular: false },
    { name: 'Raita', description: 'Cooling yogurt with cucumber, onion, and roasted cumin', price: 49, image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400', category: 'Sides', isVeg: true, isPopular: false },
    { name: 'Qubani Ka Meetha', description: 'Stewed apricot dessert with cream, a Hyderabadi royal delicacy', price: 119, image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400', category: 'Desserts', isVeg: true, isPopular: false },
  ]
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    await User.create({
      name: 'Admin',
      email: 'admin@bitezy.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210'
    });

    await User.create({
      name: 'Super Admin',
      email: 'superadmin@bitezy.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543211'
    });

    // Create first test customer
    await User.create({
      name: 'Varun',
      email: 'varun@gmail.com',
      password: 'varun123',
      role: 'customer',
      phone: '9876501234',
      addresses: [{
        label: 'Home',
        street: '15 Marine Drive',
        city: 'Mumbai',
        state: 'MH',
        zipCode: '400002',
        isDefault: true
      }]
    });

    // Create second test customer
    await User.create({
      name: 'Raj',
      email: 'raj@gmail.com',
      password: 'raj123',
      role: 'customer',
      phone: '9876501235',
      addresses: [{
        label: 'Office',
        street: '45 Tech Park',
        city: 'Bangalore',
        state: 'KA',
        zipCode: '560001',
        isDefault: true
      }]
    });

    console.log('🍽️  Creating restaurants...');
    const createdRestaurants = await Restaurant.insertMany(restaurants);

    console.log('📋 Creating menu items...');
    for (const rest of createdRestaurants) {
      const items = menuItemsMap[rest.name];
      if (items) {
        const itemsWithRestaurant = items.map(item => ({
          ...item,
          restaurant: rest._id,
          isAvailable: true
        }));
        await MenuItem.insertMany(itemsWithRestaurant);
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('   Admin 1: admin@bitezy.com / admin123');
    console.log('   Admin 2: superadmin@bitezy.com / admin123');
    console.log('   User 1:  varun@gmail.com / varun123');
    console.log('   User 2:  raj@gmail.com / raj123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
