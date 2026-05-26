const Router = require('express');
const router = new Router();
const authRouter = require('./authRouter');
const applicationRouter = require('./applicationRouter');

router.use('/auth', authRouter);
router.use('/applications', applicationRouter);

module.exports = router;
