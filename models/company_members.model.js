const bcrypt = require('bcryptjs');

module.exports = (sequelize,Sequelize) =>{
    const company_members = sequelize.define('company_members',{
        id : {
            type : Sequelize.BIGINT.UNSIGNED,
            primaryKey : true,
            autoIncrement : true
        },
        company_id : {
           type : Sequelize.BIGINT.UNSIGNED,
           references : {
            model : 'companies',
            key : 'id'
           }
        },
        username : {
            type : Sequelize.STRING,
            allowNull : false
        },
        profile_image:{
           type : Sequelize.TEXT,
           allowNull : true,
           get() {
            const rawValue = this.getDataValue('profile_image');
            return rawValue ? ASSETS.getProfileURL(rawValue, "profileImages") : null;
        }
        },
        email : {
            type : Sequelize.STRING,
            allowNull : false
        },
        password : {
            type : Sequelize.STRING,
            allowNull : false,
            set(value){
                this.setDataValue('password',bcrypt.hashSync(value,10))
            }
        },
        
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
            allowNull: false
        },
        deletedAt: {
            field: 'deleted_at',
            type: Sequelize.DATE,
            allowNull: true
        }

    },{
        tableName : 'company_members',
        paranoid : true,

        defaultScope: {
            attributes: { exclude: ['deletedAt', 'password'] }
        },

        scopes: {
            withPassword: {
                attributes: { exclude: ['deletedAt'] }
            }
        }
    });
    company_members.comparePassword = (painText, hash) => bcrypt.compareSync(painText, hash)

    company_members.isExistField = async (whereClause) => {
        return await company_members.findOne({ where: whereClause })
    };


    return company_members
}