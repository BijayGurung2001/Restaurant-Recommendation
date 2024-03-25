const db = require('../database/db')
const bcrypt = require('bcrypt')

exports.productlist = (req, res) => {

  const a = 'SELECT * FROM restaurant '

  db.query(a, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.send(results);
  });
}

exports.usersignup = (req, res) => {

  const { fullname, email, address, number, preference, password } = req.body;
  console.log(fullname, email, address, number, preference, password)

  const q = "SELECT * from user WHERE email=?"
  db.query(q, [email], async (error, result) => {
    if (error) {
      console.error('Error checking email', error)
      return res.status(500).Json({ error: "Internal Server Error" })
    }
    if (result.length > 0) {
      return res.status(400).json({ error: "Email already exits" })
    }
    try {
      const hashpassword = await bcrypt.hash(password, 10)
      const insertquery = "INSERT INTO user (password, email, fullname, address, number, preferences)VALUES (?, ?, ?, ?, ?, ?)";
      db.query(insertquery, [hashpassword, email, fullname, address, number, preference], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: "User registered Successfully" })
      });
    } catch (error) {
      res.send(500).json({ error: "Internal server error" })
    }
  })
}
exports.userLogin = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], async (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Compare the provided password with the hashed password stored in the database
    const user = results[0];
    
    try {
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("password doesnot match")
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      
      // Generate a JWT token
      const token = jwt.sign({ userID: user.userID }, bijaygurung123456789, { expiresIn: '1h' });
      console.log(token)
      res.status(200).json({ token });
      console.log('success login user')

    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};