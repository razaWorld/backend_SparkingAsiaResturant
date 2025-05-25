const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  location: String,
  rating: Number,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
