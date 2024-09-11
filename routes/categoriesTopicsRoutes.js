const express = require('express');
const { getCategories, getTopicsFromCategories, getInterviewQuestionsData, createInterviewQuestions, updateInterviewQuestion, setFavoriteTopic, addCategory, addTopic, editCategory, editTopic, deleteTopic, getCategoriesList, getCategoriesFromList, deleteInterviewQuestion, bookmarkInterviewQuestion, getBookmarkedInterviewQuestion, removebookmarkedInterviewQuestion, removeFavoriteTopic, searchTopics } = require('../controllers/categoriesTopics');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { handleRoles } = require('../middlewares/handleRoles')

const router = express.Router();

router.get("/getCategoryList", isAuthenticatedUser, getCategoriesList);
router.get("/getCategories", isAuthenticatedUser, getCategories);
router.get("/getCategoriesFromList/:categoryList", isAuthenticatedUser, getCategoriesFromList);
router.get("/getTopics/:categoryId", isAuthenticatedUser, getTopicsFromCategories);
router.post("/getInterviewQA", isAuthenticatedUser, getInterviewQuestionsData);
router.post("/createInterviewQuestions", isAuthenticatedUser, handleRoles, createInterviewQuestions);
router.post("/updateInterviewQuestion", isAuthenticatedUser, handleRoles, updateInterviewQuestion);
router.post("/deleteInterviewQuestion", isAuthenticatedUser, handleRoles, deleteInterviewQuestion);
router.post("/bookmarkInterviewQuestion", isAuthenticatedUser, bookmarkInterviewQuestion);
router.post("/removeBookmark", isAuthenticatedUser, removebookmarkedInterviewQuestion);
router.post("/getBookmarkedQA", isAuthenticatedUser, getBookmarkedInterviewQuestion);
router.post("/setFavoriteTopic", isAuthenticatedUser , setFavoriteTopic);
router.post("/removeFavoriteTopic", isAuthenticatedUser , removeFavoriteTopic);
router.post("/addCategory", isAuthenticatedUser,  handleRoles, addCategory);
router.post("/editCategory", isAuthenticatedUser,  handleRoles, editCategory);
router.post("/addTopic", isAuthenticatedUser, handleRoles, addTopic);
router.post("/editTopic", isAuthenticatedUser, handleRoles, editTopic);
router.post("/deleteTopic", isAuthenticatedUser, handleRoles, deleteTopic);
router.get("/searchTopics/:searchText", isAuthenticatedUser,  searchTopics);


module.exports = router;