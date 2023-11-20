const express = require('express');
const router = express.Router();
const { handleCreateOrder, handleAllLoggedInOrders, handleAdminAllOrders, handleUpdateOrder, handleDeleteOrder } = require("../controllers/orderController")
const {isLoggedIn,customRoles} = require('../middlewares/user')


router.route("/order/create").post(isLoggedIn,handleCreateOrder)
router.route("/order/:id").get(isLoggedIn,handleCreateOrder)
router.route("/myorders").get(isLoggedIn,handleAllLoggedInOrders)


//Admin routes
router.route("/admin/allorders").get(isLoggedIn,customRoles('admin'),handleAdminAllOrders)
router.route("/admin/updateorder/:id").put(isLoggedIn,customRoles('admin'),handleUpdateOrder)
router.route("/admin/deleteorder/:id").delete(isLoggedIn,customRoles('admin'),handleDeleteOrder)
module.exports = router;