let WebSocketServer = require('ws').Server;
let querystring = require('querystring');
let userModel = require('../model/user');
let broadcast = require('./broadcast');
let send = require('./send');
let round = require('./round');


let wss = null;
exports.start = server => {
	wss = new WebSocketServer({ server, verifyClient });
	wss.on('connection', handleConnection);
	wss.hands = {};
	wss.players = [];
};
function verifyClient (info) {
    let search = info.req.url.replace(/[\/\?]+/g, '');
    let query = querystring.parse(search);
    let userInfo = userModel.getInfoByToken(query.token);
    if (!userInfo) return false;
    return true;
}
// let isPlaying = false;


function handleConnection (ws) {
    let search = ws.upgradeReq.url.replace(/[\/\?]+/g, '');
    let query = querystring.parse(search);
    let userInfo = userModel.getInfoByToken(query.token);
    ws.info = userInfo;

    let len = wss.clients.length;
    send(ws, 'text-ok', `Welcome! No.${len} player.`);
    broadcast(wss, 'text-ok', `${userInfo.nickname} join the game!`);

    bindClientMsg(ws);
    bindClientClose(ws);
}
function bindClientMsg (ws) {
	ws.on('message', data => {
        data = JSON.parse(data);
        if (data.type === 'begin') {
            round.begin(wws);
        }
        if (data.type === 'speak') {
            let speech = `${ws.info.nickname} : ${data.content}`;
            broadcast(wss, 'text', speech);
        }
    });
}
function bindClientClose (ws) {
    ws.on('close', () => {
        broadcast(wss, 'text-danger', `${ws.info.nickname} quit..`);
    });	
}
