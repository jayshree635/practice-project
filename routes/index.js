
const router = require('express').Router();

//...............routes...............

const AdminRoute = require('./admin.routes');
const HunterRoute = require('./hunter.route');

router.use('/admin',AdminRoute);
router.use('/hunter',HunterRoute)

module.exports = router