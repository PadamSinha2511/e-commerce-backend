const express = require('express');

const router = express.Router();

const {handleHome}  = require("../controllers/homeController");


router.route("/").get(handleHome);


module.exports = router;