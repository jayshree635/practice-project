//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth')

//..........................controller.............


const AllLoginController = require('../controller/all-login-controller')

//....................routes..................

router.post('/login',AllLoginController.login)


module.exports = router