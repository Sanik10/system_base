const Router = require('express');
const router = new Router();

const authRouter = require('./authRouter');
const bookingRouter = require('./bookingRouter');
const reviewRouter = require('./reviewRouter');

router.use('/auth', authRouter);
router.use('/booking', bookingRouter);
router.use('/review', reviewRouter);

module.exports = router;
