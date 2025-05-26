const express = require('express');
const { addBulkRestaurants,getRestaurants,getAllCuisines,getAllLocations,getSpecificRestaurants} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware'); 


const router = express.Router();

// router.post('/add_restaurant', addRestaurant);
router.post('/get_restaurant', protect, getRestaurants);
router.post('/get_specific_restaurant',protect, getSpecificRestaurants);
router.post('/bulk-insert', addBulkRestaurants); // 👈 this one triggers the 20,000 record insert
router.post('/get_cuisines',protect,getAllCuisines);
router.post('/get_locations',protect, getAllLocations);


module.exports = router;
