const MESSAGES = {
    // hunter controller
    '1001': 'Signup successfully!',
    '1002': 'hunter Login successfully!',
    '1003': 'hunter Logout successfully!',
    '1004': 'Get hunter profile successfully.',
    '1005': 'Upadate user profile successfully.',
    '1006': 'hunter Account deleted successfully.',
    '1007': 'Email already exist.',
    '1008': 'user not found.',
    '1009': 'Password does not match.',
    '1010': 'Email or password are not match.',
    '1011': 'user account already exist',
    '1012': 'email is verifyed',
    '1013': 'send again mail',
    '1014': 'email verify successfully...',
    '1015': 'otp time expire Send mail again',
    '1016': 'email not exist',
    '1017': 'check your mail',
    '1018': 'you are not hunter',

    // Admin controller
    '1101' : 'admin is not found first create signup',
    '1102': ' admin Login successfully!.',
    '1103': 'Admin not found.',
    '1104': 'update admin profile successfully',
    '1105': 'You are not admin',
    '1106': 'Get Admin profile successfully.',


    // company_member categories controller
    '1201': 'company member add successfully!',
    '1202': 'company member profile get successfully!',
    '1203': 'company member delete successfully!',
    '1204': 'company member not found!',
    '1205': 'company member update successfully!',
    '1205': 'company member delete successfully!',


    // companies controller
    '1301': 'company add successfully!',
    '1302': 'company login successfully!',
    '1303': 'company not found!',
    '1304': 'company delete successfully.',
    '1305': 'company update successfully.',
    '1306': 'company profile get successfully.',
    '1307': 'you are not company.',
    '1308': 'name is already exist.',
    '1309': 'logout successfully.....',
  




    // order controller
    '1401': 'order create successfully',
    '1402': 'order get successfully',
    '1403': 'order not found',
    '1404': 'your order cancel successfully',
    '1405': 'same product_id order',

    // cart controller
    '1601': 'add product in cart successfully..',
    '1602': 'product already exist in cart',
    '1603': 'get cart successfully...',
    '1604': 'cart not found',
    '1605': 'remove cart successfully..',
    '1606': 'cart product order successfully..',


    // Common
    '9000': 'Please Enter valid Details',
    '9999': "Something went wrong!",
}

module.exports.getMessage = function (messageCode) {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : '';
};
