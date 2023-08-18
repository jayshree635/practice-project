const bcrypt = require('bcryptjs')

module.exports = (sequelize, Sequelize) => {
    const company = sequelize.define('companies', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            set(value) {
                this.setDataValue('password', bcrypt.hashSync(value, 10));
            }
        },
        about: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        company_logo: {
            type: Sequelize.TEXT,
            allowNull: true
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
        tableName: 'companies',
        paranoid: true
    });
    return company
}