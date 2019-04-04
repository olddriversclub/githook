const fs = require('fs');
const moment = require('moment');
const path = require('path')
const argvs = require('./process.args')

let logDir = path.resolve(__dirname, '../log')
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

let logger = console;

if (argvs.mode !== 'dev') {
    let options = {
      flags: 'a',
      encoding: 'utf8',
    };

    let stdout = fs.createWriteStream(`${logDir}/info.log`, options);
    let stderr = fs.createWriteStream(`${logDir}/err.log`, options);

    logger = new console.Console(stdout, stderr);
}

module.exports = logger;