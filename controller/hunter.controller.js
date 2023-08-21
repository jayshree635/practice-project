const Validator = require('validatorjs');
const db = require('../config/db.config');


//............models....
const Hunter = db.Hunter;
const UserSession = db.UserSession;


//..........utils.................

const mailUtils = require('../utils/sendMail')

const hunterSignup = async (req, res) => {
    let validation = new Validator(req.body, {
        username: 'required|string|max:50',
        email: 'required|max:50',
        password: 'required|min:6|max:15',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }

    try {
        const { username, email, password, Auditor_role } = req.body;
        const profile_image = req?.file?.filename;

        const otp = Math.floor(100000 + Math.random() * 9000);

        const currentTime = Date.now();
        const expirationMinutes = 120;
        const opt_time = new Date(currentTime + expirationMinutes * 60 * 1000);

        const findHunter = await Hunter.findOne({ where: { email: email } });

        if (findHunter) {
            if (findHunter.isVerify == 1) {
                return RESPONSE.error(res, "user account exist")
            };
            await findHunter.update({ otp });
        } else {
            const userData = await Hunter.create({ username, email, password, profile_image, otp, opt_time, Auditor_role });

        }
        // const mail = mailUtils.sendMail("otp mail", `verify email otp  : ${otp}`);

        return RESPONSE.success(res, 1017)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//................hunter Email Verify.........
const emailVerify = async (req, res) => {
    let validation = new Validator(req.body, {
        email: 'required',
        otp: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };
    try {
        const { email, otp } = req.body;
        const currentTime = Date.now();
        const isExist = await Hunter.findOne({ where: { email: email } })
        if (!isExist) {
            return RESPONSE.success(res, 1016)
        }

        if (isExist.isVerify == 1) {
            return RESPONSE.error(res, 1012)
        }

        if (isExist.otp != otp) {
            return RESPONSE.error(res, 1013)
        }

        if (currentTime >= isExist.opt_time) {
            return RESPONSE.error(res, 1015)
        }


        await isExist.update({ isVerify: true })

        return RESPONSE.success(res, 1014)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}





module.exports = {
    hunterSignup,
    emailVerify,
}