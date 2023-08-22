const Validator = require('validatorjs');
const db = require('../config/db.config');
const path = require('path')

//............models....
const CompanyMember = db.Company_members;
const Company = db.Company;
const UserSession = db.UserSession;


//...................admin add member by company_id...............
const addCompanyMember = async (req, res) => {
    let validation = new Validator(req.body, {
        username: 'required|max:50|string',
        email: 'required|max:50',
        password: 'required|min:8|max:15',
        company_id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    };

    try {
        const { username, email, password, company_id } = req.body;

        const authUser = req.user;
        if (authUser.role != 'admin') {
            return RESPONSE.error(res, 1105)
        }

        const isExist = await CompanyMember.findOne({ where: { email: email } });
        if (isExist) {
            return RESPONSE.error(res, 1007)
        }

        const findCompanyId = await Company.findOne({ where: { id: company_id } });
        if (!findCompanyId) {
            return RESPONSE.error(res, 1303)
        }

        const companyMemberData = await CompanyMember.create({ username, email, password, company_id })

        return RESPONSE.success(res, 1302, companyMemberData)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//..............................get All member Profile by admin.........................
const getAllMemberProfileByAdmin = async (req, res) => {
    try {
        const authUser = req.user;
        if (authUser.role != 'admin') {
            return RESPONSE.error(res, 1105)
        }
        const findAllMember = await CompanyMember.findAll();

        if (!findAllMember) {
            return RESPONSE.error(res1204)

        }
        return RESPONSE.success(res, 1202, findAllMember)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//..................admin get one company member by id..................
const getOneCompanyMemberById = async (req, res) => {
    try {
        const authUser = req.user;
        const id = req.query.id;
        if (authUser.role != 'admin') {
            return RESPONSE.error(res, 1105)
        }

        const findCompanyMember = await CompanyMember.findOne({ where: { id: id } });
        if (!findCompanyMember) {
            return RESPONSE.error(res, 1204)
        }

        return RESPONSE.success(res, 1202, findCompanyMember);

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//......................member get profile.................
const getMemberProfile = async (req, res) => {
    try {
        const authUser = req.user;
        if (authUser.role != 'member') {
            return RESPONSE.error(res, 1208)
        }

        const findCompanyMember = await CompanyMember.findOne({ where: { id: authUser.id } });
        if (!findCompanyMember) {
            return RESPONSE.error(res, 1204)
        }

        return RESPONSE.success(res, 1202, findCompanyMember);

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//.................... update member profile.............

const updateMemberProfile = async (req, res) => {
    let validation = new Validator(req.body, {
        username: 'required|string|max:50',
        current_password: 'required',
        new_password: 'required|min:8|max:15',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    };

    try {
        const authUser = req.user;
        if (authUser.role != 'member') {
            return RESPONSE.error(res, 1208)
        }

        const { username, current_password, new_password } = req.body;
        const profile_image = req?.file?.filename;

        const object = {
            username,
        }

        const findMember = await CompanyMember.scope('withPassword').findOne({ where: { id: authUser.id } });
        if (!findMember) {
            return RESPONSE.error(res, 1204);

        }

        if (new_password) {
            if (!await CompanyMember.comparePassword(current_password, findMember.password)) {
                return RESPONSE.error(res, 1010);
            }
            object.password = new_password;
        };

        if (profile_image) {
            if (findMember.profile_image) {
                await FILEACTION.deleteFile(path.basename(findMember.profile_image), 'images/profileImages');
            }
            object.profile_image = profile_image;
        }

        const MemberData = await CompanyMember.update(object, { where: { id: authUser.id } });


        return RESPONSE.success(res, 1205, MemberData)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

module.exports = {
    addCompanyMember,
    getAllMemberProfileByAdmin,
    getOneCompanyMemberById,
    getMemberProfile,
    updateMemberProfile
}