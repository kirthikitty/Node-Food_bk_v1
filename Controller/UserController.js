const express = require('express')
const router = express.Router();
const User = require('../Model/UserModel');
const Address = require("../Model/AddressModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//User Registration
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, username, password,addressData } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstname, lastname, username, password: hashedPassword });
        await user.save();
          // Create new address
          const address = new Address({ ...addressData, user: user._id });
          await address.save();

          // Associate the address with the user
          user.address = address._id;
          await user.save();
        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration Failed' });
    }
});


//User Login

router.post('/login',async (req,res)=>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user){
            return res.status(401).json({error : 'Authentication failed'});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch){
            return res.status(401).json({error : 'Authentication failed'});
        }
        const token = jwt.sign({userId: user._id},'20',{
             expiresIn: '1h',
    });
        res.status(200).json({token});
}catch (error){
    res.status(500).json({error: 'Login Failed'});
}
});


// Route to get all users
router.get('/users', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find().populate('address')
        // Send the users data as response
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        // If there's an error, send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add this route to your existing backend code
router.delete('/users/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Delete the user from the database
      await User.findByIdAndDelete(userId);
      // Also delete associated address if needed
      // await Address.deleteOne({ user: userId });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Update a user by ID
  // Update a user by ID
router.put('/users/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { firstname, lastname, username, password } = req.body;
      
      // Find the user by ID and update the fields
      const updatedUser = await User.findByIdAndUpdate(userId, { firstname, lastname, username, password }, { new: true });
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
  


module.exports = router;
