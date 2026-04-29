const express = require('express');
const router = express.Router();

const celoController = require('../controllers/celoController');

router.get('/', celoController.list);
router.post('/addCelo', celoController.save);
router.get('/deleteCelo/:id', celoController.delete);
router.get('/updateCelo/:id', celoController.edit);
router.post('/updateCelo/:id', celoController.update);

module.exports = router;
