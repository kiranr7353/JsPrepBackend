const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { getPlaceholders } = require('../controllers/config');

const router = express.Router();

router.get("/getPlaceholders", isAuthenticatedUser, getPlaceholders);


module.exports = router;