const express = require('express');
const router = express.Router();

const veterinarioController = require('../controllers/veterinarioController');

router.get('/', veterinarioController.list);
router.post('/addVeterinario', veterinarioController.save);
router.get('/deleteVeterinario/:id', veterinarioController.delete);
router.get('/updateVeterinario/:id', veterinarioController.edit);
router.post('/updateVeterinario/:id', veterinarioController.update);

module.exports = router;
