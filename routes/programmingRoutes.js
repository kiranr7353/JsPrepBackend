const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { addProgrammingQA, getProgrammingQAData, updateProgrammingQA, deleteProgrammingQA, bookmarkProgrammingQA, removebookmarkedProgrammingQA, getBookmarkedProgrammingQA } = require('../controllers/programmingQA');
const { handleRoles } = require('../middlewares/handleRoles');

const router = express.Router();

router.post("/addProgrammingQA", isAuthenticatedUser, handleRoles, addProgrammingQA);
router.post("/getProgrammingQA", isAuthenticatedUser, getProgrammingQAData);
router.post("/updateProgrammingQA", isAuthenticatedUser, handleRoles, updateProgrammingQA);
router.post("/deleteProgrammingQA", isAuthenticatedUser, handleRoles, deleteProgrammingQA);
router.post("/bookmarkProgrammingQA", isAuthenticatedUser, bookmarkProgrammingQA);
router.post("/removeBookmark", isAuthenticatedUser, removebookmarkedProgrammingQA);
router.post("/getBookmarkedPQA", isAuthenticatedUser, getBookmarkedProgrammingQA);


module.exports = router;