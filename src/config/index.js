const argv = require('yargs')
    .alias('p', 'port')
    .default('p', 1337)
    .argv;

const config = {
    port: argv.port,
};

module.exports = config;
