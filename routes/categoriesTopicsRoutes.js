const express = require('express');
const { getCategories } = require('../controllers/categoriesTopics');


const router = express.Router();

router.get("/categories", getCategories);


module.exports = router;