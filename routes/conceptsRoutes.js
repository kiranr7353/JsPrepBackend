const express = require('express');
const { getConcepts, addConcepts } = require('../controllers/concepts');


const router = express.Router();

router.post("/addConcepts", addConcepts);
router.get("/getConcepts/:topicId/:categoryId", getConcepts);



module.exports = router;

