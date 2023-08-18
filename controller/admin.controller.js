const Validator = require('validatorjs');
const db = require('../config/db.config');


//............models....
const Admin = db.Admin;
const AdminSession = db.AdminSession;
const UserSession = db.UserSession;

//......................admin login...................
const AdminLogin = async(req,res) =>{

}


//......................get admin profile...............
const getAdminProfile = async(req,res) => {
    try {
        const authAdmin = req.user;

        const findAdmin = await Admin.findOne({where : {id  : authAdmin.id}});
        if (!findAdmin) {
            return RESPONSE.error(res,1103)
        }

        delete findAdmin.password ;

        return RESPONSE.success(res,1106,findAdmin)
    }
    catch{
        console.log(error);
        return RESPONSE.error(res,9999)
    }
}
module.exports = {
    AdminLogin,
    getAdminProfile
}