const Validator = require('validatorjs');
const db = require('../config/db.config');
const path = require('path');

//............models....
const Admin = db.Admin;
const AdminSession = db.AdminSession;
const UserSession = db.UserSession;
const Hunter = db.Hunter;
const Company = db.Company;
const CompanyMember = db.Company_members;

//.............utils...........
const checkEmail = require('../utils/function');


Validator.register('phone_length', (value) => {
    return value.length >= 10 && value.length <= 12;
}, 'The phone_no must be between 10 and 12 characters.');


//......................get admin profile...............
const getAdminProfile = async (req, res) => {
    try {
        const authUser = req.user;
        if (authUser.role != 'admin') {
            return RESPONSE.error(res, 1105);
        }

        const findAdmin = await Admin.findOne({ where: { id: authUser.id } });
        if (!findAdmin) {
            return RESPONSE.error(res, 1103);
        }

        delete findAdmin.password;

        return RESPONSE.success(res, 1106, findAdmin);
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999);
    }

}

//............update - admin - profile.............
const updateAdminProfile = async (req, res) => {
    let validation = new Validator(req.body, {
        name: 'string|max:50',
        current_password: 'required_with:new_password|min:6|max:15',
        new_password: 'min:6|max:15',
        phone_no: 'required|numeric|phone_length'
    });

    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };

    try {
        const authUser = req.user;
        if (authUser.role != 'admin') {
            return RESPONSE.error(res, 1105);
        }

        const { name, current_password, new_password, phone_no } = req.body;
        const profile_image = req?.file?.filename;

        const object = {
            name,
            phone_no
        }

        const findAdmin = await Admin.scope('withPassword').findOne({ where: { id: authUser.id } });
        if (!findAdmin) {
            return RESPONSE.error(res, 1103);

        }

        if (new_password) {
            if (!await Admin.comparePassword(current_password, findAdmin.password)) {
                return RESPONSE.error(res, 1010);
            }
            object.password = new_password;
        };

        if (profile_image) {
            object.profile_image = profile_image;
        }

        const adminData = await Admin.update(object, { where: { id: authUser.id } });

        if (findAdmin.profile_image) {
            await FILEACTION.deleteFile(path.basename(findAdmin.profile_image), 'images/profileImages');
        }

        return RESPONSE.success(res, 1104, adminData);

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


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
                return RESPONSE.success(res, 1302, companyMemberJson)
            }
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
    getAdminProfile,
    updateAdminProfile,
    logout,
    login
}