const mongoose = require('mongoose')
const logger = require('../log4js')

mongoose.connect('mongodb://localhost:27017/huisuo', { useNewUrlParser: true }).then(() => {
    logger.info('mongoose success')
}).catch((err) => {
    logger.error(err)
})

module.exports = mongoose;