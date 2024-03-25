const db=require('../database/db')
const bcrypt=require('bcrypt')

exports.restaurantsignup=(req,res)=>{
    const {fullname,address,city,country,openingtime,closingtime,number,email,password}= req.body;


    const q= "SELECT * from restaurant WHERE email=?"
    db.query(q,[email], async(error, result)=>{
        if(error){
            console.error('Error checking email', error)
            return res.status(500).Json({error:"Internal Server Error"})
        }
        if(result.length > 0){
            return res.status(400).json({error:"Email already exits"})
        }
        try {
            const hashpassword=  await bcrypt.hash(password,10)
            const insertquery="INSERT INTO restaurant (name, address, city,country,openingtime, closingtime, number, email, password)VALUES (?, ?, ?, ?, ?, ?)"; 
            db.query(insertquery,[fullname,address,city,country,openingtime,closingtime,number,email,hashpassword],(err,result)=>{
                if(err){
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json({message:"User registered Successfully"})
            });
        } catch (error) {
            res.send(500).json({error:"Internal server error"})
        }
    })
}
exports.restaurantlogin = (req, res) => {
    const { email, password } = req.body;
 

 
    const query = 'SELECT * FROM restaurant WHERE email = ?';
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
      const userid=user.userID;
      
      try {
             const isPasswordValid = await bcrypt.compare(password, user.passwrod);
           if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      console.log(userid)
        // Generate a JWT token
        const token = jwt.sign({ userid }, bijaygurung123456789, { expiresIn: '1h' });
        console.log(token)
        res.status(200).json({ token });
        console.log('success login user')
      } catch (error) {
        console.error('Error comparing passwords:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  };