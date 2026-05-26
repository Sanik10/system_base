const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, reviewController.create);
router.get('/', reviewController.getAll); // Получить отзывы могут все, даже без токена

module.exports = router;
