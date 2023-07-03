const Transactions = require('../models/Transactions')
const Cards = require('../models/Cards')
const Telegram = require('../../utils/Telegram')
const { Op, Sequelize } = require('sequelize')

module.exports = {

    /* The `getStatistics` function is an asynchronous function that handles a request to retrieve
    statistics for transactions within a specified date range. */
    getStatistics: async(req, res) => {
        try {
            let currentDate = new Date();
            let startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            let endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            let start_date = req.query.start_date || startOfMonth
            let end_date = req.query.end_date || endOfMonth

            let transactions = await Transactions.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [start_date, end_date]
                    }
                }
            });

            for (let i = 0; i < transactions.length; i++) {
                let card = await Cards.findOne({
                    where: {
                        transaction_id: transactions[i].id
                    }
                })
                transactions[i].dataValues.card = card
            }

            return res.send({ success: true, message: 'Transactions found', data: transactions })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    },

    /* The `updateAmount` function is an asynchronous function that handles a request to update the amount
    of a transaction. */
    updateAmount: async(req, res) => {
        try {
            let transaction = await Transactions.findOne({
                where: {
                    uuid: req.body.uuid
                }
            })
            if(!transaction) {
                return res.send({ success: false, message: 'Transaction not found' })
            }
            await Transactions.update({
                amount: req.body.amount
            }, {
                where: {
                    uuid: req.body.uuid
                }
            })
            return res.send({ success: true, message: 'Transaction updated', data: transaction })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    },

    /* The `setStatus` function is an asynchronous function that handles a request to update the status of
    a transaction. */
    setStatus: async(req, res) => {
        try {
            let allowedStatuses = ['pending', 'approved', 'declined']
            if(!allowedStatuses.includes(req.body.status)) {
                return res.send({ success: false, message: 'Invalid status' })
            }
            let transaction = await Transactions.findOne({
                where: {
                    uuid: req.body.uuid
                }
            })
            if(!transaction) {
                return res.send({ success: false, message: 'Transaction not found' })
            }
            await Transactions.update({
                status: req.body.status
            }, {
                where: {
                    uuid: req.body.uuid
                }
            })
            return res.send({ success: true, message: 'Transaction updated', data: transaction })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    },


    getEarnStatistics: async(req, res) => {
        try {
            let currentDate = new Date();
            let startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            let endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            let start_date = req.query.start_date || startOfMonth
            let end_date = req.query.end_date || endOfMonth

            const transactions = await Transactions.findAll({
                attributes: [
                    'referal',
                    [Sequelize.fn('SUM', Sequelize.col('Amount')), 'totalAmount']
                ],
                where: {
                    status: 'approved',
                    createdAt: {
                        [Op.between]: [start_date, end_date]
                    }
                },
                group: ['referal']
            });
            
            let totalEarn = 0
            for (let i = 0; i < transactions.length; i++) {
                totalEarn += +transactions[i].dataValues.totalAmount
            }

            return res.send({ success: true, message: 'Transactions found', data: {
                transactions,
                totalEarn
            } })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    }

}