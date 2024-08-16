const express = require('express');
const { getConcepts, addConcepts, editDescriptionInSection, deleteConcept, editConcept } = require('../controllers/concepts');
const { isAuthenticatedUser } = require('../middlewares/auth');


const router = express.Router();

router.post("/addConcepts", isAuthenticatedUser, addConcepts);
router.post("/deleteConcept", isAuthenticatedUser, deleteConcept);
router.post("/editConcept", isAuthenticatedUser, editConcept);
router.get("/getConcepts/:topicId/:categoryId", isAuthenticatedUser, getConcepts);
router.post("/section/editDescription", isAuthenticatedUser, editDescriptionInSection);



module.exports = router;

