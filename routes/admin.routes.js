//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth')
const uploadImage = require('../middelware/uploadFile')
//..........................controller.............

const adminController = require('../controller/admin.controller');


//....................routes..................

router.get('/get-admin-profile', auth.authUser, adminController.getAdminProfile);

router.patch('/update-admin-profile', auth.authUser, uploadImage.uploadImage('profileImages', 'profile_image'), adminController.updateAdminProfile);



//....................routes..................

router.post('/login', adminController.login);

router.delete('/logout', auth.authUser, adminController.logout);

module.exports = router