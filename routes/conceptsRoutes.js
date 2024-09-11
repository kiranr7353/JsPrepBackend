const express = require('express');
const { getConcepts, addConcepts, editDescriptionInSection, deleteConcept, editConcept } = require('../controllers/concepts');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { handleRoles } = require('../middlewares/handleRoles');


const router = express.Router();

router.post("/addConcepts", isAuthenticatedUser, handleRoles, addConcepts);
router.post("/deleteConcept", isAuthenticatedUser, handleRoles, deleteConcept);
router.post("/editConcept", isAuthenticatedUser, handleRoles, editConcept);
router.get("/getConcepts/:topicId/:categoryId", isAuthenticatedUser, getConcepts);
router.post("/section/editDescription", isAuthenticatedUser, handleRoles, editDescriptionInSection);



module.exports = router;

