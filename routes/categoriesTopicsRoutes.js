const express = require('express');
const { getCategories, getTopicsFromCategories, getInterviewQuestionsData, createInterviewQuestions, updateInterviewQuestion, setFavoriteTopic, setFavoriteQuestion, addCategory, addTopic, editCategory, editTopic, deleteTopic, getCategoriesList, getCategoriesFromList, deleteInterviewQuestion } = require('../controllers/categoriesTopics');
const { isAuthenticatedUser } = require('../middlewares/auth');


const router = express.Router();

router.get("/getCategoryList", isAuthenticatedUser, getCategoriesList);
router.get("/getCategories", isAuthenticatedUser, getCategories);
router.get("/getCategoriesFromList/:categoryList", isAuthenticatedUser, getCategoriesFromList);
router.get("/getTopics/:categoryId", isAuthenticatedUser, getTopicsFromCategories);
router.get("/getInterviewQA/:topicId/:categoryId", isAuthenticatedUser, getInterviewQuestionsData);
router.post("/createInterviewQuestions", isAuthenticatedUser, createInterviewQuestions);
router.post("/updateInterviewQuestion", isAuthenticatedUser, updateInterviewQuestion);
router.post("/deleteInterviewQuestion", isAuthenticatedUser, deleteInterviewQuestion);
router.post("/setFavoriteTopic", isAuthenticatedUser , setFavoriteTopic);
router.post("/setFavoriteQuestion", isAuthenticatedUser,  setFavoriteQuestion);
router.post("/addCategory", isAuthenticatedUser,  addCategory);
router.post("/editCategory", isAuthenticatedUser,  editCategory);
router.post("/addTopic", isAuthenticatedUser,  addTopic);
router.post("/editTopic", isAuthenticatedUser,  editTopic);
router.post("/deleteTopic", isAuthenticatedUser,  deleteTopic);



module.exports = router;