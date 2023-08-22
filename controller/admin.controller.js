const Validator = require('validatorjs');
const db = require('../config/db.config');
const path = require('path')

//............models....
const Admin = db.Admin;
const AdminSession = db.AdminSession;
const UserSession = db.UserSession;

Validator.register('phone_length', (value) => {
    return value.length >= 10 && value.length <= 12;
}, 'The phone_no must be between 10 and 12 characters.');


//......................get admin profile...............
const getAdminProfile = async (req, res) => {
    try {
        const authUser = req.user;
        if (authUser.role != 'admin') {
            return RESPONSE.error(res, 1105)
        }

        const findAdmin = await Admin.findOne({ where: { id: authUser.id } });
        if (!findAdmin) {
            return RESPONSE.error(res, 1103)
        }

        delete findAdmin.password;

        return RESPONSE.success(res, 1106, findAdmin)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
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
            return RESPONSE.error(res, 1105)
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
            if (findAdmin.profile_image) {
                await FILEACTION.deleteFile(path.basename(findAdmin.profile_image), 'images/profileImages');
            }
            object.profile_image = profile_image;
        }

        const adminData = await Admin.update(object, { where: { id: authUser.id } });
        return RESPONSE.success(res, 1104, adminData);

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

module.exports = {
    getAdminProfile,
    updateAdminProfile,
}