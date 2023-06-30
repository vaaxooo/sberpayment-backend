const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

const Transaction = require('./Transactions')

class Cards extends Model {}

Cards.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    transaction_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    pan: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.STRING(5),
        allowNull: false,
    },
    cvv: {
        type: DataTypes.STRING(3),
        allowNull: false,
    },
}, {
    sequelize: MySQL,
    modelName: 'cards',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        { fields: ['transaction_id'] },
    ]
})

Cards.belongsTo(Transaction, { foreignKey: 'transaction_id' })

module.exports = Cards