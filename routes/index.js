
const router = require('express').Router();

//...............routes...............

const AdminRoute = require('./admin.routes');
const HunterRoute = require('./hunter.route');
const Company = require('./company.route')

router.use('/admin', AdminRoute);
router.use('/hunter', HunterRoute);
router.use('/company', Company)


module.exports = router