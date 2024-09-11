const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { addSnippets, updateSnippet, deleteSnippet, getSnippetsData, bookmarkSnippet, removebookmarkedSnippet, getBookmarkedSnippet } = require('../controllers/snippets');
const { handleRoles } = require('../middlewares/handleRoles');

const router = express.Router();

router.post("/addSnippet", isAuthenticatedUser, handleRoles, addSnippets);
router.post("/getSnippets", isAuthenticatedUser, getSnippetsData);
router.post("/updateSnippet", isAuthenticatedUser, handleRoles, updateSnippet);
router.post("/deleteSnippet", isAuthenticatedUser, handleRoles, deleteSnippet);
router.post("/bookmarkSnippet", isAuthenticatedUser, bookmarkSnippet);
router.post("/removeBookmark", isAuthenticatedUser, removebookmarkedSnippet);
router.post("/getBookmarkedSnippet", isAuthenticatedUser, getBookmarkedSnippet);

module.exports = router;