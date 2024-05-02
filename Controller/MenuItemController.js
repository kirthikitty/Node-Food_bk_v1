const MenuItem = require("../Model/MenuItemModel");
const { body, validationResult } = require("express-validator");
const multer = require('multer');
const path = require('path');
const express = require("express");
const router = express.Router();

exports.list = (req, res) => {
    MenuItem.find()
        .then((menuItem) => {
            return res.status(200).send(menuItem);
        })
        .catch((err) => {
            return res.status(200).send(err.message);
        });
};

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
    body("category").isLength({ min: 1 }).withMessage("Category cannot be empty"), // Add category validation

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
                category: req.body.category // Add category
            });

            const savedProduct = await menuitem.save();
            return res.status(200).json(savedProduct);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
];

exports.listByCategory = (req, res) => {
    const { category } = req.params; // Assuming categoryname is passed as a route parameter
    MenuItem.find({ category }) // Find all products with the given categoryname
        .then((menuitem) => {
            return res.status(200).json(menuitem); // Sending JSON response containing products
        })
        .catch((err) => {
            return res.status(500).json({ error: err.message }); // Sending JSON response for errors
        });
};
// Route handler for updating a menu item
exports.update = [
    uploader.single('uploaded_file'), // Handle single file upload with field name 'image'
    async (req, res) => {
        const updates = {
            menuname: req.body.menuname,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category, // Include category in updates
            image: req.file ? req.file.filename : req.body.image,
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


exports.delete = (req, res) => {
    const menuItemId = req.params.id;
    MenuItem.findByIdAndDelete(menuItemId)
        .then((deletedMenuItem) => {
            return res.status(200).send("MenuItem deleted");
        })
        .catch((err) => {
            return res.status(200).send(err.message);
        });
};


