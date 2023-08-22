//.....................models...........
const router = require('express').Router();


//...........................middleware..................
const auth = require('../middelware/apiAuth')
const uploadImage = require('../middelware/uploadFile')
//..........................controller.............


const companyController = require('../controller/company.controller')
const companyMemberController = require('../controller/company_member.controller')


//....................routes..................
//.........................company.......................

router.post('/add-companies', auth.authUser, companyController.AddCompany);

router.get('/get-all-company-by-admin', auth.authUser, companyController.getAllCompany);

router.get('/get-company-by-id', auth.authUser, companyController.getOneCompanyById);

router.get('/get-company-profile-by-company', auth.authUser, companyController.getOneCompanyByCompany)

router.patch('/update-company-by-company', auth.authUser, uploadImage.uploadImage('companyLogo', 'company_logo'), companyController.updateCompanyProfile);


//.....................................company_member...........................

router.post('/add-company-member', auth.authUser, companyMemberController.addCompanyMember);

router.get('/get-all-member-by-admin', auth.authUser, companyMemberController.getAllMemberProfileByAdmin);

router.get('/get-one-member-by-id', auth.authUser, companyMemberController.getOneCompanyMemberById);

router.get('/get-member-profile', auth.authUser, companyMemberController.getMemberProfile);

router.patch('/update-member-profile', auth.authUser, uploadImage.uploadImage('profileImages', 'profile_image'), companyMemberController.updateMemberProfile)

module.exports = router