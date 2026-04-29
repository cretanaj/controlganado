const express = require('express');
const router = express.Router();

const reporteController = require('../controllers/reporteController');

router.get('/historico-enfermedades', reporteController.historicoEnfermedades);
router.get('/animales-prontos-celo', reporteController.animalesProntosCelo);
router.get('/periodo-gestacion-objetivo-anual', reporteController.periodoGestacionObjetivoAnual);
router.get('/kg-dia-animal-promedio-hato', reporteController.kgDiaAnimalPromedioHato);
router.get('/consanguinidad-por-hato', reporteController.consanguinidadPorHato);

module.exports = router;