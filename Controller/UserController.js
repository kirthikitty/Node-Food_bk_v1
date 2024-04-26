const express = require('express')
const router = express.Router();
const User = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//User Registration
router.post('/register',async (req,res)=>{
    try{
        const {firstname,lastname,username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({firstname,lastname,username,password:hashedPassword});
        await user.save();
        res.status(201).json({message : 'User Registered Successfully'});
    }catch (error){
        res.status(500).json({error: 'Registration Failed'});
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

router.get("/users", (req, res) => {
    User.find()
    .then((users) => {
        res.status(200).json(users)
    })
    .catch((err) => {
        res.status(401).json({error: "Cannot find Users"})
    })
})
module.exports = router