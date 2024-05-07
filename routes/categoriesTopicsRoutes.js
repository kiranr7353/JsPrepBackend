const express = require('express');
const { getCategories, getTopicsFromCategories, getInterviewQuestionsData, getTest, createInterviewQuestions, updateInterviewQuestion } = require('../controllers/categoriesTopics');


const router = express.Router();

router.get("/getCategories", getCategories);
router.get("/getTopics/:categoryId", getTopicsFromCategories);
router.get("/getInterviewQA/:topicId", getInterviewQuestionsData);
router.post("/test", getTest);
router.post("/createInterviewQuestions", createInterviewQuestions);
router.post("/updateInterviewQuestion", updateInterviewQuestion);



module.exports = router;