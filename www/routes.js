const compose = require('koa-compose')
const glob = require('glob')
const { resolve } = require('path')

let registerRouter = () => {
    let routers = [];
    glob.sync(resolve(__dirname, '**/*.controller.js'))
        .map(router => {
            routers.push(require(router).routes())
            routers.push(require(router).allowedMethods())
        })
    return compose(routers)
}

module.exports = registerRouter;