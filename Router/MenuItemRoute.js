const express = require("express");
const router = express.Router();

const verifyToken = require('../Middleware/AuthMiddleware'); 
const MenuItemController = require("../Controller/MenuItemController");
const AddCartController = require("../Controller/AddCartController")

router.post("/menuitem/addmenu", MenuItemController.insert);
router.get("/menuitem", MenuItemController.list);
router.put("/menuitem/:id", MenuItemController.update);// Updated route
router.delete("/deleteproduct/:id", MenuItemController.delete); // Updated route
router.get("/menuitem/:category", MenuItemController.listByCategory);

// router.post("/user/add", UserController.insert);
// Route for adding items to the cart
// router.post('/addcart', verifyToken, AddCartController.addTodelete

router.post("/addcart", AddCartController.addToCart)
router.get('/getcart/:userId', AddCartController.getCartItems);

// Route to remove an item from the user's cart
router.delete('delete/:userId/:itemId', AddCartController.removeFromCart);
module.exports = router;

