
const router = require('express').Router();

//...............routes...............

const AdminRoute = require('./admin.routes');
const HunterRoute = require('./hunter.route');
const AllLoginLogout = require('./login.routes')

router.use('/admin',AdminRoute);
router.use('/hunter',HunterRoute);
router.use('/',AllLoginLogout)


module.exports = router