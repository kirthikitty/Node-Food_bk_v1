const express = require("express");
const router = express.Router();

const MenuItemController = require("../Controller/MenuItemController");
// const UserController = require("../Controller/UserController");

router.post("/menuitem/addmenu", MenuItemController.insert);
router.get("/menuitem/findall", MenuItemController.list);
router.put("/menuitem/:id", MenuItemController.update);// Updated route
router.delete("/deleteproduct/:id", MenuItemController.delete); // Updated route

// router.post("/user/add", UserController.insert);


module.exports = router;


module.exports = router;
