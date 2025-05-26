const Restaurant = require('../models/Restaurant');
const { faker } = require('@faker-js/faker');



exports.getRestaurants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      cuisine = '',
      location = '',
      rating = 0,
    } = req.body;

    const finalLimit = limit > 0 && limit <= 20 ? parseInt(limit) : 10;
    const finalPage = parseInt(page);
    const skip = (finalPage - 1) * finalLimit;

    // 🔍 Unified search filter (across multiple fields)
    const searchQuery = search.toLowerCase();

    // Build the dynamic filter
    const filter = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { cuisine: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { rating: parseFloat(searchQuery) || -1 }, // Convert to number if possible
      ],
    };

    // If nothing is being searched, remove the filter
    if (!search) delete filter.$or;

    const total = await Restaurant.countDocuments(filter);

    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(finalLimit);

    res.status(200).json({
      success: true,
      total,
      page: finalPage,
      totalPages: Math.ceil(total / finalLimit),
      results: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
      details: error.message,
    });
  }
};


exports.getSpecificRestaurants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      cuisine = '',
      location = '',
      rating,
    } = req.body;

    const finalLimit = limit > 0 && limit <= 20 ? parseInt(limit) : 10;
    const finalPage = parseInt(page);
    const skip = (finalPage - 1) * finalLimit;

    const filter = {};

    // 🔍 Optional search (across multiple fields)
    if (search) {
      const searchQuery = search.toLowerCase();
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { cuisine: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { rating: parseFloat(searchQuery) || -1 },
      ];
    }

    // ✅ Exact match for cuisine
    if (cuisine) {
      filter.cuisine = cuisine;
    }

    // ✅ Exact match for location
    if (location) {
      filter.location = location;
    }

    // ⭐ Rating greater than or equal
    if (rating !== undefined && rating !== '') {
      filter.rating = { $gte: parseFloat(rating) };
    }

    const total = await Restaurant.countDocuments(filter);

    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(finalLimit);

    res.status(200).json({
      success: true,
      total,
      page: finalPage,
      totalPages: Math.ceil(total / finalLimit),
      results: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
      details: error.message,
    });
  }
};

exports.getAllCuisines = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;

    const finalLimit = limit > 0 && limit <= 20 ? parseInt(limit) : 10;
    const finalPage = parseInt(page);
    const skip = (finalPage - 1) * finalLimit;

    // Fetch all distinct cuisines
    const allCuisines = await Restaurant.distinct('cuisine');

    // Normalize: remove falsy values, trim, and remove duplicates
    const normalizedCuisines = allCuisines
      .filter(c => typeof c === 'string' && c.trim() !== '')
      .map(c => c.trim())
      .filter((value, index, self) => self.indexOf(value) === index);

    const total = normalizedCuisines.length;
    const paginatedCuisines = normalizedCuisines.slice(skip, skip + finalLimit);

    res.status(200).json({
      success: true,
      page: finalPage,
      limit: finalLimit,
      total,
      totalPages: Math.ceil(total / finalLimit),
      results: paginatedCuisines.length,
      data: paginatedCuisines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cuisines',
      details: error.message,
    });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;

    const finalLimit = limit > 0 && limit <= 20 ? parseInt(limit) : 10;
    const finalPage = parseInt(page);
    const skip = (finalPage - 1) * finalLimit;

    // Fetch all distinct locations
    const allLocations = await Restaurant.distinct('location');

    // Normalize: remove falsy values, trim, and remove duplicates
    const normalizedLocations = allLocations
      .filter(loc => typeof loc === 'string' && loc.trim() !== '')
      .map(loc => loc.trim())
      .filter((value, index, self) => self.indexOf(value) === index);

    const total = normalizedLocations.length;
    const paginatedLocations = normalizedLocations.slice(skip, skip + finalLimit);

    res.status(200).json({
      success: true,
      page: finalPage,
      limit: finalLimit,
      total,
      totalPages: Math.ceil(total / finalLimit),
      results: paginatedLocations.length,
      data: paginatedLocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations',
      details: error.message,
    });
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