const readline = {
    emitKeypressEvents: (input) => {
        input.emit('keypress');
    }
};

module.exports = readline;