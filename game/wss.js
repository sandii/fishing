let WebSocketServer = require('ws').Server;
let querystring = require('querystring');
let userModel = require('../model/user');
let broadcast = require('./broadcast');
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
    ws.send({
        type : 'text',
        info : 'ok',
        content : `Welcome! No.${len} player.`
    });
    broadcast(wss, {
        type : 'text',
        info : 'ok',
        content : `${userInfo.nickname} join the game!`
    });

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
            broadcast(wss, {
                type : 'text',
                info : '',
                content : `${ws.info.nickname} : ${data.content}`
            });
        }
    });
}
function bindClientClose (ws) {
    ws.on('close', () => {
        broadcast(wss, {
            type : 'text',
            info : 'danger',
            content : `${ws.info.nickname} quit..`
        });
    });	
}
