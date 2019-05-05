const log4js = require('log4js')
const argvs = require('./process.args')

log4js.configure({
    appenders: {
        file: {
            type: 'dateFile',
            filename: 'log/log',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            maxLogSize: 10 * 1024 * 1024, // = 10Mb
            backups: 5, // keep five backup files
            compress: true, // compress the backups
            encoding: 'utf-8',
            mode: 0o0640,
            flags: 'w+'
        },
        //   dateFile: {
        //     type: 'dateFile',
        //     filename: 'log/date.log.log',
        //     pattern: 'yyyy-MM-dd-hh',
        //     compress: true
        //   },
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['console', 'file'],
            level: 'all'
        }
    },
    pm2: true,
    // pm2InstanceVar?: string;
    // levels: log4js.levels.ALL,
    // disableClustering?: boolean
});

module.exports = log4js.getLogger();
