const express = require('express');
const router = express.Router();

// Importa los handlers de tus endpoints
router.get('/getReservations', require('./getReservations').default);
router.get('/getRestaurants', require('./getRestaurants').default);
router.get('/getHorarios', require('./getHorarios').default);
router.post('/createReservation', require('./createReservation').default);
router.post('/cancelReservation', require('./cancelReservation').default);

module.exports = router;
