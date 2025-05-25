const Restaurant = require('../models/Restaurant');
const { faker } = require('@faker-js/faker');

// @desc Add new restaurant
exports.addRestaurant = async (req, res) => {
  try {
    const { name, cuisine, location, rating } = req.body;

    if (!name || !cuisine || !location || rating == null) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newRestaurant = new Restaurant({ name, cuisine, location, rating });
    await newRestaurant.save();

    res.status(201).json({ message: 'Restaurant added successfully', data: newRestaurant });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Import Restaurant model

// @desc Get restaurants with optional search and pagination
exports.getRestaurants = async (req, res) => {
  try {
    // Get values from query string (with default values)
    const page = parseInt(req.query.page) || 1;     // current page
    const limit = parseInt(req.query.limit) || 10;  // results per page
    const search = req.query.search || '';          // search text

    // Calculate how many records to skip
    const skip = (page - 1) * limit;

    // If there's a search term, create a filter to find matching names
    const filter = search
      ? { name: { $regex: search, $options: 'i' } }  // case-insensitive search
      : {}; // empty filter means "get everything"

    // Count how many total results match the search
    const total = await Restaurant.countDocuments(filter);

    // Find restaurants with the filter, skip and limit
    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(limit);

    // Send the result back
    res.status(200).json({
      total,                          // total matching records
      page,                           // current page
      totalPages: Math.ceil(total / limit), // total number of pages
      results: restaurants.length,    // how many results we got in this page
      data: restaurants               // the actual data
    });
  } catch (error) {
    // If something goes wrong, send an error
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
};




// @desc Bulk insert 20,000 restaurants
exports.addBulkRestaurants = async (req, res) => {
    try {
      const restaurants = [];
  
      for (let i = 0; i < 20000; i++) {
        restaurants.push({
          name: faker.company.name(),
          cuisine: faker.helpers.arrayElement(['Italian', 'Chinese', 'Indian', 'Mexican', 'American']),
          location: faker.location.city(),
          rating: parseFloat(faker.number.float({ min: 1, max: 5 }).toFixed(1))
        });
      }
  
      await Restaurant.insertMany(restaurants);
      res.status(201).json({ message: '20,000 restaurants inserted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to insert data', details: error.message });
    }
  };