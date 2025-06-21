const express = require('express');
const router = express.Router();
const { createTemplate } = require('../controllers/templateController');

router.post('/create', createTemplate);

module.exports = router;
