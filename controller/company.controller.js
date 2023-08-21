const Validator = require('validatorjs');
const db = require('../config/db.config');


//.........................models.......................//
const Company = db.Company;

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
        const authAdmin = req.user;
        if (authAdmin.role !== 'admin') {
            return RESPONSE.error(res, 1105)
        }

        const { name, email, password, about } = req.body;
        company_logo = req?.file?.filename;

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


module.exports = {
    AddCompany
}