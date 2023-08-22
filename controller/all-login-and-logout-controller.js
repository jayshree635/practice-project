const Validator = require('validatorjs');
const db = require('../config/db.config');


//............models....
const Hunter = db.Hunter;
const Admin = db.Admin;
const Company = db.Company;
const CompanyMember = db.Company_members;
const UserSession = db.UserSession;

//................utils...............
const checkEmail = require('../utils/function');

//..........................all login api......................
const login = async (req, res) => {
    let validation = new Validator(req.body, {
        email: 'required',
        password: 'required',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };

    try {
        const { email, password } = req.body;

        const isHunter = await Hunter.scope('withPassword').findOne({ where: { email: email, isVerify: true } });
        const isAdmin = await Admin.scope('withPassword').findOne({ where: { email: email } });
        const isCompany = await Company.scope('withPassword').findOne({ where: { email: email } });
        const isCompanyMember = await CompanyMember.scope('withPassword').findOne({ where: { email: email } });



        if (isHunter) {
            const isPasswordCorrect = await Hunter.comparePassword(password, isHunter.password);

            if (isPasswordCorrect) {
                const role = "hunter"
                const hunterJson = isHunter.toJSON();
                hunterJson.token = await UserSession.createToken(role, hunterJson.id);
                delete hunterJson.password;
                return RESPONSE.success(res, 1002, hunterJson);
            }
            else {
                return RESPONSE.error(res, 1010);
            }

        } else if (isAdmin) {

            const isPasswordCorrect = await Admin.comparePassword(password, isAdmin.password);

            if (isPasswordCorrect) {
                const role = "admin";
                const adminJson = isAdmin.toJSON();
                adminJson.token = await UserSession.createToken(role, adminJson.id);
                delete adminJson.password;
                return RESPONSE.success(res, 1102, adminJson)
            } else {
                return RESPONSE.error(res, 1010);
            }

        } else if (isCompany) {

            const isPasswordCorrect = await Company.comparePassword(password, isCompany.password);

            if (isPasswordCorrect) {
                const role = "company";
                const companyJson = isCompany.toJSON();
                companyJson.token = await UserSession.createToken(role, companyJson.id);
                delete companyJson.password;
                return RESPONSE.success(res, 1302, companyJson)
            } else {
                return RESPONSE.error(res, 1010);
            }

        } else if (isCompanyMember) {

            const isPasswordCorrect = await CompanyMember.comparePassword(password, isCompanyMember.password);

            if (isPasswordCorrect) {
                const role = "member";
                const companyMemberJson = isCompanyMember.toJSON();
                companyMemberJson.token = await UserSession.createToken(role, isCompanyMember.id);
                delete isCompanyMember.password;
                return RESPONSE.success(res, 1302, companyMemberJson)            }
            else {
                return RESPONSE.error(res, 1010);
            }

        }
        else {
            return RESPONSE.error(res, 1008);
        }

    }

    catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }

}


//..................all logout api..............
const logout = async (req, res) => {
    try {
        const authUser = req.user;
        
        await UserSession.destroy({ where: { token: req.headers.authorization } })

        return RESPONSE.success(res, 1309,)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


module.exports = {
    login,
    logout
}