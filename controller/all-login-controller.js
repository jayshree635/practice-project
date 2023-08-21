const Validator = require('validatorjs');
const db = require('../config/db.config');


//............models....
const Hunter = db.Hunter;
const Admin = db.Admin;
const UserSession = db.UserSession;


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
        const isAdmin = await Admin.scope('withPassword').findOne({where : {email : email}});

        if (isHunter) {
           const isPasswordCorrect= await Hunter.comparePassword(password, isHunter.password);
           if (isPasswordCorrect) {
            const role = "hunter"
            const hunterJson = isHunter.toJSON();
            hunterJson.token = await UserSession.createToken(role,hunterJson.id);
            delete hunterJson.password;
            return RESPONSE.success(res, 1002, hunterJson);
           }
           else{
            return RESPONSE.error(res, 1010);
           }
            
        }
        else if (isAdmin) {
            const isPasswordCorrect = await Admin.comparePassword(password,isAdmin.password);
            if (isPasswordCorrect) {
                const role = "admin";
                const adminJson = isAdmin.toJSON();
                adminJson.token = await UserSession.createToken(role,adminJson.id);
                delete adminJson.password;
                return RESPONSE.success(res,1102,adminJson)
            }else{
                return RESPONSE.error(res, 1010);

            }
        }
        else{
            return RESPONSE.error(res, 1103);
        }
        
          
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }

}


module.exports = {
    login
}