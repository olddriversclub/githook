const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const registerRouter = require('./routes')
const serve = require('koa-static')
const opn = require('opn')
const dbHelper = require('./db/index')
const logger = require('./logger')
const Response = require('./response')
const argvs = require('./process.args')
// var cors = require('koa2-cors');
// app.use(cors());

app.use(bodyParser())

// app.use(serve(__dirname + "/static", { extensions: ['html']}));
app.use(serve(__dirname + "/static", {
    /** Browser cache max-age in milliseconds. (defaults to 0) */
    maxAge: 1000 * 60 * 60 * 24 * 7,
    /** Tell the browser the resource is immutable and can be cached indefinitely. (defaults to false) */
    // immutable?: boolean
    /** Root directory to restrict file access. (defaults to '') */
    // root?: string,
    /** Name of the index file to serve automatically when visiting the root location. (defaults to none) */
    index: 'index.html',
}));

app.use(async (ctx, next) => {
    ctx.argvs = argvs
    ctx.DB = dbHelper
    ctx.logger = logger
    ctx.Model = {
        Response
    }
    await next()
})

app.use(registerRouter())

// app.use(function* (next) {
//     try {
//         yield* next;
//     } catch (e) {
//         this.status = 500;
//         this.body = '500';
//     }
//     if (parseInt(this.status) === 404) {
//         this.body = '404';
//     }
// })


function onError(error, ctx) {
    if (error.syscall !== "listen") {
        ctx.body = error.message
        logger.error(error)
        throw error
    } else {

        var bind = typeof error.port === "string" ? "Pipe " + error.port : "Port " + error.port;
        let start = (port) => {
            logger.log('try restart...')
            www.close();
            www.listen(port)
        }

        switch (error.code) {
            case "EACCES":
                logger.error(bind + " requires elevated privileges");
                typeof error.port == 'number' ? start(error.port + 1) : process.exit(1);
                break;
            case "EADDRINUSE":
                logger.error(bind + " is already in use");
                typeof error.port == 'number' ? start(error.port + 1) : process.exit(1);
                break;
            default:
                throw error;
        }
    }
}

let www = app.listen(1001)
    .on("error", onError)
    .on("listening", () => {
        let add = www.address()
        logger.log('opened server on', add)
        // opn(`http://${add.address}:${add.port}`);
    });


