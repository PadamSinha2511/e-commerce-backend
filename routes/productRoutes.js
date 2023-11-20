const express = require("express");

const router = express.Router();

const {handleTestProuct, handleAddProduct, handleGetAllProduct, handleAdminGetAllProduct, handleGetSingleProduct, handleUpdateProduct, handleDeleteProduct, handleAddReview, handleDeleteReview, handleGetOnlyReviews} = require("../controllers/productController");
const { isLoggedIn, customRoles } = require("../middlewares/user");

router.route("/testproduct").get(handleTestProuct)
//admin
router.route("/admin/addproduct").post(isLoggedIn,customRoles('admin'),handleAddProduct)
router.route("/admin/product/all").get(isLoggedIn,customRoles('admin'),handleAdminGetAllProduct)
router.route("/admin/product/:id").put(isLoggedIn,customRoles('admin'),handleUpdateProduct)
                                  .delete(isLoggedIn,customRoles('admin'),handleDeleteProduct)


//user
router.route("/product/allproducts").get(handleGetAllProduct)
router.route("/product/:id").get(handleGetSingleProduct)
router.route("/product/addreview/:id").post(isLoggedIn,handleAddReview)  
router.route("/product/deletereview/:id").delete(isLoggedIn,handleDeleteReview)
router.route("/product/reviews/:id").get(handleGetOnlyReviews)                       
module.exports=router;