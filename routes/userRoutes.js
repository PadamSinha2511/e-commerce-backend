const express = require("express")

const router = express.Router();

const {handleSignup, handleLogin, handleLogout, handleForgetPassword, handleResetPassword, handleGetDashboard, handleUpdatePassword, handleAdminAllUsers, handleManagerAllUser, handleAdminOneUser, handleAdminUpdateOneUser, handleAdminDeleteUser} = require("../controllers/userController");
const { isLoggedIn, customRoles } = require("../middlewares/user");

router.route("/signup").post(handleSignup)
router.route("/login").post(handleLogin)
router.route("/logout").get(handleLogout)
router.route("/forgotpassword").post(handleForgetPassword)
router.route("/password/reset/:token").post(handleResetPassword)
router.route("/userdashboard").get(isLoggedIn,handleGetDashboard)
router.route("/password/update").post(isLoggedIn,handleUpdatePassword)
router.route("/updatepassword").post(isLoggedIn,handleUpdatePassword)


router.route("/admin/users").get(isLoggedIn,customRoles('admin'),handleAdminAllUsers)
router.route("/admin/user/:id").get(isLoggedIn,customRoles('admin'),handleAdminOneUser)
                               .put(isLoggedIn,customRoles('admin'),handleAdminUpdateOneUser)
                               .delete(isLoggedIn,customRoles('admin'),handleAdminDeleteUser)


router.route("/manager/users").get(isLoggedIn,customRoles('manager'),handleManagerAllUser)


module.exports=router;