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


//.........................company.......................

router.post('/add-companies',auth.authUser,uploadImage.uploadImage('companyLogo','company_logo'),companyController.AddCompany);

router.get('/get-all-company-by-admin',auth.authUser,companyController.getAllCompany);

router.get('/get-company-by-id',auth.authUser,companyController.getOneCompanyById);

router.patch('/update-company-by-company',auth.authUser,uploadImage.uploadImage('companyLogo','company_logo'),companyController.updateCompanyProfile);


module.exports = router