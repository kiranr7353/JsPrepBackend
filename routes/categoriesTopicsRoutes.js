const express = require('express');
const { getCategories, getTopicsFromCategories, getInterviewQuestionsData, getTest, createInterviewQuestions, updateInterviewQuestion, setFavoriteTopic, setFavoriteQuestion, addCategory, addTopic, editCategory, editTopic, deleteTopic } = require('../controllers/categoriesTopics');
const { isAuthenticatedUser } = require('../middlewares/auth');


const router = express.Router();

router.get("/getCategories", getCategories);
router.get("/getTopics/:categoryId", getTopicsFromCategories);
router.get("/getInterviewQA/:topicId", getInterviewQuestionsData);
router.post("/test", getTest);
router.post("/createInterviewQuestions", createInterviewQuestions);
router.post("/updateInterviewQuestion", updateInterviewQuestion);
router.post("/setFavoriteTopic", isAuthenticatedUser , setFavoriteTopic);
router.post("/setFavoriteQuestion", isAuthenticatedUser,  setFavoriteQuestion);
router.post("/addCategory",  addCategory);
router.post("/editCategory",  editCategory);
router.post("/addTopic",  addTopic);
router.post("/editTopic",  editTopic);
router.post("/deleteTopic",  deleteTopic);



module.exports = router;