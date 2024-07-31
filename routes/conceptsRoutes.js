const express = require('express');
const { getConcepts, addConcepts, editDescriptionInSection, deleteConcept, editConcept } = require('../controllers/concepts');


const router = express.Router();

router.post("/addConcepts", addConcepts);
router.post("/deleteConcept", deleteConcept);
router.post("/editConcept", editConcept);
router.get("/getConcepts/:topicId/:categoryId", getConcepts);
router.post("/section/editDescription", editDescriptionInSection);



module.exports = router;

