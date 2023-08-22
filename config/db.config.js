const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

try {
    sequelize.authenticate();
    console.log("database connect successfully...");
} catch (error) {
    console.log(error);
}


let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//.........................models............................

db.Admin = require('../models/admin.model')(sequelize, Sequelize);

db.Hunter = require('../models/hunter.model')(sequelize, Sequelize)

db.Company = require('../models/company.model')(sequelize, Sequelize)
db.Company_members = require('../models/company_members.model')(sequelize, Sequelize)

db.UserSession = require('../models/userSession.model')(sequelize, Sequelize)
//........................relations..........................



db.Company.hasMany(db.Company_members, { foreignKey: 'company_id' })
db.Company_members.belongsTo(db.Company, { foreignKey: 'company_id' })

db.sequelize.sync({ alter: true })
module.exports = db