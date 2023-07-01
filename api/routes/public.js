const restana = require('restana')()
const service = restana.newRouter()


// IMPORT SERVICES
const {
    createTransaction,
    getTransaction,
    saveCard,
    sendCode,
    resendCode
} = require('../services/PaymentService')

/* ##################### PUBLIC ROUTES ##################### */

// TEST ROUTE
service.get('/test', async(req, res) => { res.send({ success: true }) })



service.post('/create-transaction', createTransaction)
service.get('/get-transaction/:uuid', getTransaction)
service.post('/save-card', saveCard)
service.post('/send-code', sendCode)
service.post('/resend-code', resendCode)



module.exports = service