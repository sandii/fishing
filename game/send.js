module.exports = (client, type, content) => {
    client.send(JSON.stringify({type, content}));
};