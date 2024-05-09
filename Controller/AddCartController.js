const Cart = require('../Model/CartModel');
const MenuItem = require('../Model/MenuItemModel');
const mongoose = require("mongoose");

// Controller function to add items to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, menuItemId, quantity } = req.body;

    // Check if userId and menuItemId are valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID or menu item ID' });
    }

    // Check if the menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, menuitems: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.menuitems.find(item => item.menuitem.toString() === menuItemId);

    if (existingItem) {
      // If the item exists, update its quantity
      existingItem.quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.menuitems.push({ menuitem: menuItemId, quantity });
    }

    // Calculate the total price of the cart
    cart.totalPrice = cart.menuitems.reduce((total, item) => {
      const itemPrice = item.quantity * menuItem.price; // Assuming each menu item has a 'price' attribute
      return total + itemPrice;
    }, 0);

    // Save the cart to the database
    await cart.save();

    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Controller function to get cart items for a specific user
exports.getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('menuitems.menuitem');

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.removeFromCart = async (req, res) => {
    try {
      const { userId, itemId } = req.params;
  
      // Check if userId and itemId are valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID or item ID' });
      }
  
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ success: false, error: 'Cart not found' });
      }
  
      // Find the index of the item to be removed
      const itemIndex = cart.menuitems.findIndex(item => item.menuitem.toString() === itemId);
  
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, error: 'Item not found in cart' });
      }
  
      // Remove the item from the cart
      cart.menuitems.splice(itemIndex, 1);
  
      // Recalculate the total price of the cart
      cart.totalPrice = cart.menuitems.reduce((total, item) => total + (item.quantity * item.menuitem.price), 0);
  
      // Save the updated cart to the database
      await cart.save();
  
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  