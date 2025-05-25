const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// ✅ Signup users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, location } = req.body;

    // 🔹 Validate required fields
    if (!name) return res.status(400).json({ error: "Name is required!" });
    if (!email) return res.status(400).json({ error: "Email is required!" });
    if (!password) return res.status(400).json({ error: "Password is required!" });
   
    if (!phone) return res.status(400).json({ error: "Phone is required!" });


    // 🔹 Check if email or phone already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or phone already registered!" });
    }

    // 🔹 Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      phone,
      role: role || "customer", // Default role is 'customer'
      address: address || {},
      location: location || {},
    });

    await newUser.save();
    res.status(201).json({ message: "✅ User created successfully!", user: newUser });
    

  } catch (error) {
    res.status(500).json({ error: "❌ Failed to create user", details: error.message });
  }
};
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// ✅ Login users

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔸 Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    // 🔸 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found with this email!" });
    }

    // 🔸 Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    // 🔸 Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 🔸 Send response with token
    res.status(200).json({
      message: "✅ Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active:user.isActive
      },
    });
    console.log('app calledd loging ');

  } catch (error) {
    res.status(500).json({ error: "❌ Login failed", details: error.message });
  }
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// ✅ Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    if(users.length===0){
      res.status(200).json({message:'No user found'})
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

