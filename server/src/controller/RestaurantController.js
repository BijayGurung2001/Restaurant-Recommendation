const Restaurant = require("../model/Restaurant")
const bcrypt = require('bcrypt')
const SECRETE_KEY = 'bijaygurung123456789'
const jwt = require('jsonwebtoken');

exports.restaurantsignup = async (req, res) => {
  const { fullname, address, city, country, openingtime, closingtime, num, email, password } = req.body;

  try {
    // Check if user with the provided email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const data = new Restaurant({ fullname, address, city, country, openingtime, closingtime, num, email, password: hashpassword });
    await data.save();
    res.status(201).json({ message: "User registered Successfully" });
  } catch (err) {
    console.error('Error inserting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
exports.restaurantlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email in MongoDB
    const foundUser = await Restaurant.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in MongoDB
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userID: foundUser._id }, SECRETE_KEY, { expiresIn: '1h' });
    user.jwtToken = token;
    await user.save();
    res.status(200).json({ token });
    console.log('Success login user');

  } catch (error) {
    console.error('Error comparing passwords:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};