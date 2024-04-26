const MenuItem = require("../Model/MenuItemModel")
const{body,validationResult}=require("express-validator")
const multer = require('multer')
const path = require('path')
const express = require("express");
const router = express.Router();

exports.list = [(req,res)=>{
    MenuItem.find()
    .then((menuItem)=>{
        return res.status(200).send(menuItem)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
    
}]



// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/data/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const uploader = multer({ storage: storage });

exports.insert = [
    uploader.single('uploaded_file'), // Multer middleware for single file upload
    body("menuname").isLength({ min: 1 }).withMessage("Name cannot be empty"),
    body("menuname").isAlpha().withMessage("Name cannot contain numbers or special characters"),
    body("description").isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),
    body("price").isNumeric().withMessage("Price must be numeric"),
    // body("category").isAlpha().withMessage("Category can only contain letters"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const menuitem = new MenuItem({
                menuname: req.body.menuname,
                description: req.body.description,
                price: req.body.price,
                image: req.file ? req.file.filename : null,
                // category: req.body.category,
            });

            // Save the product to the database
            const savedProduct = await menuitem.save();
            
            // Respond with success message and saved product data
            return res.status(200).json(savedProduct);
        } catch (err) {
            // Handle error and send appropriate response
            return res.status(500).json({ error: err.message });
        }
    }
];


// Route handler for updating a menu item
exports.update = [
    uploader.single('uploaded_file'), // Handle single file upload with field name 'image'
    async (req, res) => {
        const updates = {
            menuname: req.body.menuname,
            description: req.body.description,
            price: req.body.price,
            image: req.file ? req.file.filename : req.body.image, // Use new image if available, else use existing image
        };

        try {
            const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, updates, { new: true });

            if (!updatedMenuItem) {
                return res.status(404).json({ error: 'Menu item not found' });
            }

            return res.status(200).json(updatedMenuItem);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
];

exports.like = [(req,res)=>{
    MenuItem.updateOne(
        { _id:req.params.id },
        { $inc : {
            likes : 1
        }}
    )
    .then((menuItem)=>{
        return res.status(200).send(menuItem)
    })
    .catch((err)=>{
        return res.status(200).send(err.message);
    })
}]

exports.delete = (req,res)=>{
    const menuItemId = req.params.id;
    MenuItem.findByIdAndDelete(menuItemId)
    .then((deletedMenuItem)=>{
            
        return res.status(200).send("MenuItem deleted")
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}

exports.findByPriceGreater = [(req,res)=>{
    MenuItem.find({price:{
        $gt:req.params.price
    }})
    .then((menuItem)=>{
        return res.status(200).send(menuItem)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]

exports.findByPriceLesser = [(req,res)=>{
    MenuItem.find({price:{
        $lt:req.params.price
    }})
    .then((menuItem)=>{
        return res.status(200).send(menuItem)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]

exports.findByPriceBetween = [(req,res)=>{
    MenuItem.find({$and:[
        {price:{
            $gte:req.body.gte
        }},
        {price:{
            $lte:req.body.lte
        }}
    ]})
    .then((menuItem)=>{
        return res.status(200).send(menuItem)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]