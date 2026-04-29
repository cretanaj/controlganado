const express = require('express');
const router = express.Router();

const hatoController = require('../controllers/hatoController')

router.get('/', hatoController.list);
router.post('/addHato', hatoController.save);
router.get('/deleteHato/:id', hatoController.delete);
router.get('/updateHato/:id', hatoController.edit);
router.post('/updateHato/:id', hatoController.update);

module.exports = router;