const db = require('../config/db.config');

//....................models............

const Hunter = db.Hunter;
const Admin = db.Admin;
const Company = db.Company;
const CompanyMember = db.Company_members;


async function checkEmail(email) {
    try {
        const isExistEmailAdmin = await Admin.findOne({ email: email ,isVerify : 1});
        const isExistEmailHunter = await Hunter.findOne({ email: email });
        const isExistEmailCompany = await Company.findOne({ email: email });
        const isExistEmailCompanyMember = await CompanyMember.findOne({ email: email });

        if (isExistEmailAdmin) {
            return false
        }

        if (isExistEmailHunter) {
            return false;
        }

        if (isExistEmailCompany) {
            return false;
        }

        if (isExistEmailCompanyMember) {
            return false;
        }

        return true
    } catch (error) {
        return false
    }

}

module.exports = {
    checkEmail
}