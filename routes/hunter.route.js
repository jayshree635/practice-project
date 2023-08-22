//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth');
const uploadImage = require('../middelware/uploadFile');


//..........................controller.............
const hunterController = require('../controller/hunter.controller');


//....................routes..................

router.post('/hunter-signup', uploadImage.uploadImage('profileImages', 'profile_image'), hunterController.hunterSignup);

router.post('/email-verify', hunterController.emailVerify);

router.get('/get-hunter-profile', auth.authUser, hunterController.getHunterProfile);

router.patch('/update-hunter-profile', auth.authUser, uploadImage.uploadImage('profileImages', 'profile_image'), hunterController.updateHunterProfile)



module.exports = router