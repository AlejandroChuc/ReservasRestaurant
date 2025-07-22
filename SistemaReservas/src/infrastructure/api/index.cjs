const express = require('express');
const router = express.Router();

// Importa los handlers de cada endpoint
const getRestaurants = require('./getRestaurants');
const getHorarios = require('./getHorarios');
const getReservations = require('./getReservations');
const createReservation = require('./createReservation');
const cancelReservation = require('./cancelReservation');

// Define las rutas de la API
router.get('/restaurants', getRestaurants);
router.get('/horarios', getHorarios);
router.get('/reservations', getReservations);
router.post('/reservations', createReservation);
router.post('/reservations/cancel', cancelReservation);

module.exports = router;
