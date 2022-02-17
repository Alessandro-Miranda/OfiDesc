const EventEmitter = require("events");

const process = {
    stdin: {
        setRawMode: (value = false) => {},
        resume: () => {},
        on: (eventName) => {
            console.log('teste de evento')
        }
    },
    stdout: {
        write: (value) => {},
    },
};

process.stdin = new EventEmitter();

module.exports = process;
