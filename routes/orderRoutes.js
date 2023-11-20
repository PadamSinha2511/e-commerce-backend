const express = require('express');
const router = express.Router();
const { handleCreateOrder, handleAllLoggedInOrders, handleAdminAllOrders, handleUpdateOrder } = require("../controllers/orderController")
const {isLoggedIn,customRoles} = require('../middlewares/user')


router.route("/order/create").post(isLoggedIn,handleCreateOrder)
router.route("/order/:id").get(isLoggedIn,handleCreateOrder)
router.route("/myorders").get(isLoggedIn,handleAllLoggedInOrders)


//Admin routes
router.route("/admin/allorders").get(isLoggedIn,customRoles('admin'),handleAdminAllOrders)
router.route("/admin/updateorder/:id").get(isLoggedIn,customRoles('admin'),handleUpdateOrder)

module.exports = router;