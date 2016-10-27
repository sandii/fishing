let send = require('./send');

module.exports = (wss, type, content) => {
    wss.clients.forEach(client => send(client, type, content));
};