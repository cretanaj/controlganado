const express = require('express');
const router = express.Router();

const googleMapsController = require('../controllers/googleMapsController');

router.get('/', googleMapsController.list);

module.exports = router;
