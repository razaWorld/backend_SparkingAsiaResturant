const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  phone: { type: String, required: true, unique: true },
  age: { type: Number },
  role: {
    type: String,
    enum: ['customer', 'group_manager', 'admin', 'super_admin'],
    default: 'customer'
  },
  // profileImage: { type: String, default: "" }, // Profile picture URL
  




  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
