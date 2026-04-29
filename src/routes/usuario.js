const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.list);
router.post('/addUsuario', usuarioController.save);
router.get('/deleteUsuario/:id', usuarioController.delete);
router.get('/updateUsuario/:id', usuarioController.edit);
router.post('/updateUsuario/:id', usuarioController.update);

module.exports = router;
