
const router = require('express').Router();

//...............routes...............

const AdminRoute = require('./admin.routes');
const HunterRoute = require('./hunter.route');
const AllLogin = require('./login.routes')

router.use('/admin',AdminRoute);
router.use('/hunter',HunterRoute);
router.use('/login',AllLogin)


module.exports = router