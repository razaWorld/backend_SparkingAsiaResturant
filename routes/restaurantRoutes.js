const express = require('express');
const { addRestaurant,addBulkRestaurants,getRestaurants} = require('../controllers/restaurantController');


const router = express.Router();

router.post('/add_restaurant', addRestaurant);
router.get('/get_restaurant', getRestaurants);
router.post('/bulk-insert', addBulkRestaurants); // 👈 this one triggers the 20,000 record insert


module.exports = router;
