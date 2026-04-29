const express = require('express');
const router = express.Router();

const sintomaBovinoController = require('../controllers/sintomaBovinoController');

router.get('/', sintomaBovinoController.list);
router.post('/addSintomaBovino', sintomaBovinoController.save);
router.get('/deleteSintomaBovino/:idAnimal/:idEnfermedad/:idPaquete', sintomaBovinoController.delete);

module.exports = router;
