const Router = require('express');
const router = new Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Для пользователя
router.post('/', authMiddleware, bookingController.create);
router.get('/mine', authMiddleware, bookingController.getMine);

// Для администратора
router.get('/all', authMiddleware, adminMiddleware, bookingController.getAll);
router.put('/:id/status', authMiddleware, adminMiddleware, bookingController.updateStatus);

module.exports = router;
