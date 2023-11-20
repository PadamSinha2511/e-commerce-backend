const express = require("express");
const { isLoggedIn } = require("../middlewares/user");
const { handleCaptureRazorpayPayment } = require("../controllers/paymentController");

const router = express.Router();

router.route("/capturerazorpay").post(isLoggedIn,handleCaptureRazorpayPayment)

module.exports = router;