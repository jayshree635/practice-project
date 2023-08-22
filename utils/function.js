const db = require('../config/db.config');

//....................models............

const Hunter = db.Hunter;
const Admin = db.Admin;
const Company = db.Company;
const CompanyMember = db.Company_members;


async function checkEmail(email) {
    try {
        const isExistEmailAdmin = await Admin.findOne({ where: { email: email } });
        const isExistEmailHunter = await Hunter.findOne({ where: { email: email, isVerify: true } });
        const isExistEmailCompany = await Company.findOne({ where: { email: email } });
        const isExistEmailCompanyMember = await CompanyMember.findOne({ where: { email: email } });

        if (isExistEmailAdmin) {
            isExistEmailAdmin.role = 'admin';
            return {status:true,userData : isExistEmailAdmin}
        }

        if (isExistEmailCompany) {
            isExistEmailCompany.role = 'company';
            return {status:true,userData : isExistEmailCompany}
        }

        if (isExistEmailHunter) {
            isExistEmailHunter.role = 'hunter';
            return {status:true,userData : isExistEmailHunter}
        }

        if (isExistEmailCompanyMember) {
            isExistEmailCompanyMember.role = 'member';
            return {status:true,userData : isExistEmailCompanyMember}
        }
        return false
    } catch (error) {
        console.log(error);
        return false
    }

}

module.exports = {
    checkEmail
}