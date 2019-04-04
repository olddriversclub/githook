const Router = require('koa-router')
const router = new Router()
const proxyActions = require('./actions/action.proxy')
const apiActions = require('./actions/action.api')

router.prefix('/hook')

router.post('/tigger/:project', proxyActions.tigger)
router.post('/tigger', proxyActions.tigger)
router.get('/getConfigs', apiActions.getConfigs)
router.post('/updateConfig', apiActions.updateConfig)
router.post('/removeConfig', apiActions.removeConfig)

module.exports = router