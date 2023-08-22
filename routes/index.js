
const router = require('express').Router();

//...............routes...............

const AdminRoute = require('./admin.routes');
const HunterRoute = require('./hunter.route');
const AllLoginLogout = require('./login.routes')
const Company = require('./company.route')

router.use('/admin', AdminRoute);
router.use('/hunter', HunterRoute);
router.use('/', AllLoginLogout)
router.use('/company', Company)


module.exports = router