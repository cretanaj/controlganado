const express = require('express');
const router = express.Router();

const perfilController = require('../controllers/perfilController');

router.get('/', perfilController.list);
router.post('/addPerfil', perfilController.save);
router.get('/deletePerfil/:id', perfilController.delete);
router.get('/updatePerfil/:id', perfilController.edit);
router.post('/updatePerfil/:id', perfilController.update);

module.exports = router;
