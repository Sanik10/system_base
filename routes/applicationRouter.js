const Router = require('express');
const router = new Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, applicationController.create);
router.get('/', authMiddleware, applicationController.getAll);
router.put('/:id/status', authMiddleware, applicationController.updateStatus); // Для админа
router.put('/:id/review', authMiddleware, applicationController.addReview); // Для юзера

module.exports = router;
