require('dotenv').config();

module.exports = {
    app_project_path: process.env.APP_PROJECT_PATH,
    port: process.env.PORT,
    protocol: process.env.PROTOCOL,

    database: {
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST
    },

    email: {
        email: process.env.EMAIL,
        pass: process.env.PASS
    },

    sslCertificates: {
        privkey: process.env.PRIVKEY,
        fullchain: process.env.fullchain
    }
}