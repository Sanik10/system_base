const Router = require('express');
const router = new Router();

const authRouter = require('./authRouter');
const itemRouter = require('./itemRouter');

router.use('/auth', authRouter);
router.use('/items', itemRouter); // В будущем сюда добавишь '/orders', '/clients' и т.д.

module.exports = router;
