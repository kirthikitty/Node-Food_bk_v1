const express = require("express");
const router = express.Router();

const MenuItemController = require("../Controller/MenuItemController");
// const UserController = require("../Controller/UserController");
const AddCartController = require('../Controller/AddCartController')

router.post("/menuitem/addmenu", MenuItemController.insert);
router.get("/menuitem/findall", MenuItemController.list);
router.put("/menuitem/:id", MenuItemController.update);// Updated route
router.delete("/deleteproduct/:id", MenuItemController.delete); // Updated route

// router.post("/user/add", UserController.insert);



// Route to add an item to the cart
router.post('/add', AddCartController.addToCart);

// Route to fetch all items in the cart
router.get('/all', AddCartController.getAllCartItems);

// Route to delete an item from the cart
router.delete('/:cartId', AddCartController.deleteCartItem);

// Route to update an item in the cart
router.put('/:cartId', AddCartController.updateCartItem);

module.exports = router;


module.exports = router;
