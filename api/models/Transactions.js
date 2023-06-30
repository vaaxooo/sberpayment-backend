const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

class Transactions extends Model {}

Transactions.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'declined'),
        allowNull: false,
        defaultValue: 'pending'
    },
    referal: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
}, {
    sequelize: MySQL,
    modelName: 'transactions',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        { fields: ['status', 'uuid'] },
    ]
})

module.exports = Transactions