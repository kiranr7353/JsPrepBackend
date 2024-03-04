const express = require('express');
const { getCategories, getTopicsFromCategories, getInterviewQuestionsData } = require('../controllers/categoriesTopics');


const router = express.Router();

router.get("/getCategories", getCategories);
router.get("/getTopics/:categoryId", getTopicsFromCategories);
router.get("/getInterviewQA/:topicId", getInterviewQuestionsData);


module.exports = router;