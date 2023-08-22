const Validator = require('validatorjs');
const db = require('../config/db.config');
const path = require('path')

//............models....
const Hunter = db.Hunter;
const UserSession = db.UserSession;


//..........utils.................

const mailUtils = require('../utils/sendMail')
const checkEmail = require('../utils/function')

//.....................hunter signUp...........................
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


        const checkmail = await checkEmail.checkEmail(email);
        if (checkmail) {
            return RESPONSE.error(res, 1007)
        }

        const isExistUsername = await Hunter.findOne({ where: { username: username } });
        if (isExistUsername) {
            return RESPONSE.error(res, "username already exist")
        }


        const findHunter = await Hunter.findOne({ where: { email: email } });

        if (findHunter) {
            if (findHunter.isVerify == 1) {
                return RESPONSE.error(res, 1007)
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


//................hunter Email Verify................
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


//..................get hunter profile......................
const getHunterProfile = async (req, res) => {
    try {
        const authUser = req.user;
        if (authUser.role != 'hunter') {
            return RESPONSE.error(res, 1018)
        }

        const findHunter = await Hunter.findOne({ where: { id: authUser.id } });

        if (!findHunter) {
            return RESPONSE.error(res, 1008)
        }

        return RESPONSE.success(res, 1004, findHunter)
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


//.....................update hunter profile................
const updateHunterProfile = async (req, res) => {
    let validation = new Validator(req.body, {
        username: 'string|max:50',
        current_password: 'required|min:6|max:15',
        new_password: 'min:6|max:15'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    };

    try {
        const { username, current_password, new_password } = req.body;
        const profile_image = req?.file?.filename;

        const authUser = req.user;
        if (authUser.role != "hunter") {
            return RESPONSE.error(res, 1018)
        }

        let object = {
            username
        }

        
        const isExistUsername = await Hunter.findOne({ where: { username: username } });
        if (isExistUsername) {
            return RESPONSE.error(res, "username already exist")
        }

        const findHunter = await Hunter.scope('withPassword').findOne({ where: { id: authUser.id } });
        if (!findHunter) {
            return RESPONSE.error(res, 1008)
        }

        if (new_password) {
            if (!await Hunter.comparePassword(current_password, findHunter.password)) {
                return RESPONSE.error(res, 1010);
            }
            object.password = new_password;
        };

        if (profile_image) {
            if (findHunter.profile_image) {
                await FILEACTION.deleteFile(path.basename(findHunter.profile_image), 'images/profileImages');
            }
            object.profile_image = profile_image;
        }

        const HunterData = await Hunter.update(object, { where: { id: authUser.id } });

        return RESPONSE.success(res, 1005, HunterData)

    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 9999)
    }
}


module.exports = {
    hunterSignup,
    emailVerify,
    getHunterProfile,
    updateHunterProfile
}