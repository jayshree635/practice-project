const moment = require('moment');
const fs = require('fs');
const db = require('../config/db.config');
const Hunter = db.Hunter;
const UserSession = db.UserSession;
const Admin = db.Admin;
const company = db.Company;
const CompanyMember = db.Company_members;


//.....................user auth................
var authUser = async function (req, res, next) {
    const headerToken = req.headers.authorization ? req.headers.authorization : null;
    const isAuth = await UserSession.findOne({ where: { token: headerToken } });

    if (isAuth != null) {
        if (isAuth.role == 'admin') {
            const admin = await Admin.findOne({ where: { id: isAuth.user_id }, attributes: ["id"] });

            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'admin not found',
                });
            }

            admin.role = 'admin'
            req.user = admin;
            next()
        } else if (isAuth.role == 'hunter') {
            const hunter = await Hunter.findOne({ where: { id: isAuth.user_id }, attributes: ["id"] });

            if (!hunter) {
                return res.status(401).json({
                    success: false,
                    message: 'hunter not found',
                });
            }

            hunter.role = 'hunter';
            req.user = hunter;
            next()

        } else if (isAuth.role == 'company') {
            const Company = await company.findOne({ where: { id: isAuth.user_id} });
            if (!Company) {
                return res.status(401).json({
                    success: false,
                    message: 'Company not found',
                });
            }
            Company.role = 'company';
            req.user = Company;
            next();

        }else if(isAuth.role == 'member'){
            const companyMember = await CompanyMember.findOne({where : isAuth.user_id,attributes:["id","company_id","email","username"]});
            if (!companyMember) {
                return res.status(401).json({
                    success: false,
                    message: 'Company not found',
                });
            }
            companyMember.role = 'member';
            req.user = companyMember;
            next();
        }else{
            return res.status(401).json({
                success: false,
                message: 'Unauthorized user',
            });
        }



    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized Users.',
        });
    }
}




module.exports = {
    authUser,
};

