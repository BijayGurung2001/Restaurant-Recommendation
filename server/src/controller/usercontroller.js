const user = require("../model/user")
const bcrypt = require('bcrypt')
const SECRETE_KEY = 'bijaygurung123456789'
const jwt = require('jsonwebtoken');



exports.usersignup = async (req, res) => {
  const { fullname, email, address, number, password } = req.body;
  console.log(fullname, email, address, number, password);
  try {
    // Check if user with the provided email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const data = new user({ name: fullname, email, address, number, password: hashpassword });
    await data.save();
    res.status(201).json({ message: "User registered Successfully" });
  } catch (err) {
    console.error('Error inserting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email in MongoDB
    const foundUser = await user.findOne({ email });
    console.log(foundUser)
    if (foundUser){
 // Compare the provided password with the hashed password stored in MongoDB
 const isPasswordValid = await bcrypt.compare(password, foundUser.password);
 if (!isPasswordValid) {
   console.log('Password does not match');
   return res.status(401).json({ error: 'password didnot match' });
 }

 // Generate a JWT token
 const token = jwt.sign({ userID: foundUser._id }, SECRETE_KEY, { expiresIn: '1h' });
   foundUser.jwtToken=token;
 await foundUser.save();
 res.status(200).json({ token });
 console.log(token)
 console.log('Success login user');
    } else{
      return res.status(401).json({ error: 'user not found' });
    }

   
    
  } catch (error) {
    console.error('Error comparing passwords:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.userProfile=async(req,res)=>{
  const token=req.body;
  try {
    const result= await user.findOne({jwtToken:token})
    if(!result){
      console.log("No user found")
    }
    console.log({result})
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({error:"internal server error"})
  }
 
}