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
    body("category").isLength({ min: 1 }).withMessage("Category cannot be empty"),
    // body("category").isAlpha().withMessage("Category can only contain letters"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try
        {
            // Find the category by name or create a new one if it doesn't exist
            let category = await category.findOne({ name: req.body.category });
            if (!category) {
                category = new category({ name: req.body.category });
                await category.save();
            }
        
        
        
            const menuitem = new MenuItem({
                menuname: req.body.menuname,
                description: req.body.description,
                price: req.body.price,
                image: req.file ? req.file.filename : null,
                category: category._id, // Assign the category's ObjectId to the menu item
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
            image: req.file ? req.file.filename : req.body.image, 
            category: req.body.category,// Use new image if available, else use existing image
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

exports.createOrder = async (req, res) => {
    try {
        // Assuming customer information is sent along with the order request
        const { customerId, items, totalAmount, status } = req.body;

        // Check if the customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Create the order and associate it with the customer
        const order = new Order({
            customer: customer._id,
            items,
            totalAmount,
            status
        });

        const savedOrder = await order.save();
        return res.status(200).json(savedOrder);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer');
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
