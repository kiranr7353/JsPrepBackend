const express = require('express');
const { getConcepts, addConcepts, editDescriptionInSection } = require('../controllers/concepts');


const router = express.Router();

router.post("/addConcepts", addConcepts);
router.get("/getConcepts/:topicId/:categoryId", getConcepts);
router.post("/section/editDescription", editDescriptionInSection);



module.exports = router;

