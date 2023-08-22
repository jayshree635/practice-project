require('dotenv').config();

function getProfileURL(fileName, folderName) {
    return process.env.APP_PROJECT_PATH + `images/${folderName}/` + fileName;
}



module.exports = {
    getProfileURL,
};
