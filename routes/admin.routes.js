//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth')
const uploadImage = require('../middelware/uploadFile')
//..........................controller.............

const adminController = require('../controller/admin.controller');


//....................routes..................

router.get('/get-admin-profile',auth.authUser,adminController.getAdminProfile);

router.patch('/update-admin-profile',auth.authUser,uploadImage.uploadImage('profileImages','profile_image'),adminController.updateAdminProfile);

router.delete('/logout-admin',auth.authUser,adminController.logoutAdmin)

module.exports = router