module.exports = (wss, json) => {
	json = JSON.stringify(json);
    wss.clients.forEach(client => client.send(json));
};