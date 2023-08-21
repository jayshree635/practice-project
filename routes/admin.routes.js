//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth')
const uploadImage = require('../middelware/uploadFile')
//..........................controller.............

const adminController = require('../controller/admin.controller');

const companyController = require('../controller/company.controller')


//....................routes..................

router.get('/get-admin-profile',auth.authUser,adminController.getAdminProfile);

router.patch('/update-admin-profile',auth.authUser,uploadImage.uploadImage('profileImages','profile_image'),adminController.updateAdminProfile);

router.delete('/logout-admin',auth.authUser,adminController.logoutAdmin)


//.........................company.......................

router.post('/add-companies',auth.authUser,uploadImage.uploadImage('companyLogo','company_logo'),companyController.AddCompany)

module.exports = router