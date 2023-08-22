const Validator = require('validatorjs');
const db = require('../config/db.config');
const path = require('path')

//.........................models.......................//
const Company = db.Company;


//................utils..........................

const checkEmail = require('../utils/function');



//.................add company by admin......................
const AddCompany = async (req, res) => {
    let validation = new Validator(req.body, {
        name: 'required|max:50|string',
        email: 'required|email|max:100',
        password: 'required|string|min:8|max:15',
        about: 'required|string:max:300'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    };

    try {
        const authUser = req.user;
        if (authUser.role !== 'admin') {
            return RESPONSE.error(res, 1105)
        }

        const { name, email, password, about } = req.body;
        company_logo = req?.file?.filename;

        const isExistUsername = await Company.findOne({ where: { name: name } });
        if (isExistUsername) {
            return RESPONSE.error(res, "company name already exist")
        }


        const isExist = await Company.findOne({ where: { email: email } });
        if (isExist) {
            return RESPONSE.error(res, 1007)
        }

        const companyData = await Company.create({ name, email, password, about, company_logo });

        delete companyData.password;

        return RESPONSE.success(res, 1301, companyData)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//..............................get all company by admin.......................
const getAllCompany = async (req, res) => {
    try {
        const authUser = req.user;
        if (authUser.role !== 'admin') {
            return RESPONSE.error(res, 1105)
        }

        const findCompany = await Company.findAll();
        if (!findCompany) {
            return RESPONSE.error(res, 1303)
        }

        return RESPONSE.success(res, 1306, findCompany);
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//................get company by id......................
const getOneCompanyById = async (req, res) => {
    try {
        const authUser = req.user;
        const id = req.query.id;
        if (authUser.role !== 'admin') {
            return RESPONSE.error(res, 1105)
        }

        const findCompany = await Company.findOne({ where: { id: id } });
        if (!findCompany) {
            return RESPONSE.error(res, 1303)
        }

        return RESPONSE.success(res, 1306, findCompany);

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}

//.....................update company by company...................
const updateCompanyProfile = async (req, res) => {
    let validation = new Validator(req.body, {
        name: 'required|max:50',
        current_password: 'required|min:8|max:15',
        new_password: 'required|min:8|max:15',
        about: 'required|max:250',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage));
    };

    try {
        const authUser = req.user;
        if (authUser.role != 'company') {
            return RESPONSE.error(res, 1307)
        }

        const { name, current_password, new_password, about } = req.body;
        const company_logo = req?.file?.filename;

        const object = {
            name,
            about
        }

        const isExistName = await Company.findOne({ where: { name: name } });
        if (isExistName) {
            return RESPONSE.error(res, 1308)
        }

        const findCompany = await Company.scope('withPassword').findOne({ where: { id: authUser.id } });
        if (!findCompany) {
            return RESPONSE.error(res, 1103);
        }

        if (new_password) {
            if (!await Company.comparePassword(current_password, findCompany.password)) {
                return RESPONSE.error(res, 1010);
            }
            object.password = new_password;
        };

        if (company_logo) {
            if (findCompany.company_logo) {
                await FILEACTION.deleteFile(path.basename(findCompany.company_logo), 'images/CompanyLogo');
            }
            object.company_logo = company_logo;
        }

        const companyData = await Company.update(object, { where: { id: authUser.id } });

        return RESPONSE.success(res, 1305, companyData)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}



module.exports = {
    AddCompany,
    getAllCompany,
    getOneCompanyById,
    updateCompanyProfile,
}