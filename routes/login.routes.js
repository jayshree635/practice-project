//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth')

//..........................controller.............


const AllLoginController = require('../controller/all-login-and-logout-controller')

//....................routes..................

router.post('/login',AllLoginController.login)

router.delete('/logout',auth.authUser,AllLoginController.logout)
module.exports = router