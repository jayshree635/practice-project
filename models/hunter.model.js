const bcrypt = require('bcryptjs')

module.exports = (sequelize, Sequelize) => {
    const hunter = sequelize.define('hunters', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('password', bcrypt.hashSync(value, 10));
            }
        },
        profile_image: {
            type: Sequelize.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('profile_image');
                return rawValue ? ASSETS.getProfileURL(rawValue, "profileImages") : null;
            }
        },
        Auditor_role: {
            type: Sequelize.ENUM('Senior_auditor', 'Auditor', 'null'),
            defaultValue: 'null'
        },
        questions: {
            type: Sequelize.STRING,
            // allowNull: false,

            get() {
                const questionData = this.getDataValue('questions');
                return JSON.parse(questionData)
            },

            set(questionObj) {
                this.setDataValue('questions', JSON.stringify(questionObj))
            }

        },
        otp: {
            type: Sequelize.INTEGER,

        },
        opt_time: {
            type: Sequelize.DATE,
        },
        isVerify: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
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

    }, {
        tableName: 'hunters',
        paranoid: true,

        defaultScope: {
            attributes: { exclude: ['deletedAt', 'password'] }
        },

        scopes: {
            withPassword: {
                attributes: { exclude: ['deletedAt'] }
            }
        }
    });

    hunter.comparePassword = (painText, hash) => bcrypt.compareSync(painText, hash)

    hunter.isExistField = async (whereClause) => {
        return await hunter.findOne({ where: whereClause })
    };

    return hunter
}