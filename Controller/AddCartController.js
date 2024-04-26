const AddCart = require('../Model/AddcartModel');

exports.addToCart = async (req, res) => {
    try {
      const { menuname, description, price, image } = req.body;
      
      // Create a new cart item
      const cartItem = new AddCart({
        menuname,
        description,
        price,
        image
      });
  
      // Save the cart item to the database
      const savedCartItem = await cartItem.save();
  
      res.status(200).json(savedCartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller function to fetch all items in the cart
  exports.getAllCartItems = async (req, res) => {
    try {
      const cartItems = await AddCart.find();
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller function to delete an item from the cart
  exports.deleteCartItem = async (req, res) => {
    try {
      const { cartId } = req.params;
      await AddCart.findByIdAndDelete(cartId);
      res.status(200).json({ message: 'Item deleted from cart successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller function to update an item in the cart
  exports.updateCartItem = async (req, res) => {
    try {
      const { cartId } = req.params;
      const updateFields = req.body;
      const updatedCartItem = await AddCart.findByIdAndUpdate(cartId, updateFields, { new: true });
      res.status(200).json(updatedCartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };