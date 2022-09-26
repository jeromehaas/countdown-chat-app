const Message = require('./schemas/message-schema');

const message = (socket, io) => {
    socket.on('message', async (text) => {
        io.emit('message', text);
        await Message.create({ text: text });
    });
};

module.exports = {
    message,
};