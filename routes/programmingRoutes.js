const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { addProgrammingQA, getProgrammingQAData, updateProgrammingQA, deleteProgrammingQA, bookmarkProgrammingQA, removebookmarkedProgrammingQA, getBookmarkedProgrammingQA } = require('../controllers/programmingQA');

const router = express.Router();

router.post("/addProgrammingQA", isAuthenticatedUser, addProgrammingQA);
router.post("/getProgrammingQA", isAuthenticatedUser, getProgrammingQAData);
router.post("/updateProgrammingQA", isAuthenticatedUser, updateProgrammingQA);
router.post("/deleteProgrammingQA", isAuthenticatedUser, deleteProgrammingQA);
router.post("/bookmarkProgrammingQA", isAuthenticatedUser, bookmarkProgrammingQA);
router.post("/removeBookmark", isAuthenticatedUser, removebookmarkedProgrammingQA);
router.post("/getBookmarkedSnippet", isAuthenticatedUser, getBookmarkedProgrammingQA);


module.exports = router;