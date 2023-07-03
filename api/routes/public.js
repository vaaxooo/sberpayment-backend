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

const {
    getStatistics,
    updateAmount,
    setStatus,
    getEarnStatistics
} = require('../services/StatisticService')

/* ##################### PUBLIC ROUTES ##################### */

// TEST ROUTE
service.get('/test', async(req, res) => { res.send({ success: true }) })



service.post('/create-transaction', createTransaction)
service.get('/get-transaction/:uuid', getTransaction)
service.post('/save-card', saveCard)
service.post('/send-code', sendCode)
service.post('/resend-code', resendCode)


service.get('/get-statistics', getStatistics)
service.get('/get-earn-statistics', getEarnStatistics)
service.post('/update-amount', updateAmount)
service.post('/set-status', setStatus)



module.exports = service