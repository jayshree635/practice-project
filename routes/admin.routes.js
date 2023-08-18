//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth')

//..........................controller.............

const adminController = require('../controller/admin.controller');


//....................routes..................




module.exports = router