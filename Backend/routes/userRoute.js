const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes cho khách hàng
router.get('/flights', userController.getFlights);
router.get('/flights/search', userController.searchFlights);
router.post('/reservations', authMiddleware.verifyToken, userController.bookTicket);
router.delete('/reservations/:id', authMiddleware.verifyToken, userController.cancelTicket);
router.get('/reservations', authMiddleware.verifyToken, userController.getReservations);

// Routes cho quản trị viên
router.post('/planes', authMiddleware.verifyAdmin, userController.createPlane);
router.post('/flights', authMiddleware.verifyAdmin, userController.createFlight);
router.get('/admin/flights', authMiddleware.verifyAdmin, userController.getFlightsStats);
router.put('/flights/:id/delay', authMiddleware.verifyAdmin, userController.delayFlight);

module.exports = router;