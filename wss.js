let WebSocketServer = require('ws').Server;
let querystring = require('querystring');
let userModel = require('./model/user');

let port = 3000;
let verifyClient = info => {
    let search = info.req.url.replace(/[\/\?]+/g, '');
    let query = querystring.parse(search);
    let userInfo = userModel.getInfoByToken(query.token);
    if (!userInfo) return false;
    return true;
};
let wss = new WebSocketServer({ port, verifyClient });
let clients = {};
let hands = {};
let players = [];
// let isPlaying = false;

let broadcast = t => {
    wss.clients.forEach(client => client.send(t));
};

wss.on('connection', ws => {
    let search = ws.upgradeReq.url.replace(/[\/\?]+/g, '');
    let query = querystring.parse(search);
    let userInfo = userModel.getInfoByToken(query.token);
    ws.info = userInfo;
    clients[query.token] = ws;

    var len = wss.clients.length;
    ws.send(`Welcome! No.${len} player.`);
    broadcast(`${userInfo.nickname} join the game!`);

    ws.on('message', data => {
        data = JSON.parse(data);
        if (data.action === 'begin') {
            gameBegin();
        }
        if (data.action === 'speak') {
            let speech = `${ws.info.nickname} : ${data.info}`;
            broadcast(speech);
        }
    });
    ws.on('close', close => {
        delete clients[ws.token];
        broadcast(`${ws.info.nickname} quit..`);
    });
});
function gameBegin () {
    players = wss.clients.slice();
    if (players.length < 2) {
        broadcast(`waiting other players..`);
        return;
    }
    broadcast('game begins!');
    serve();
    compare();
}
function serve () {
    players.forEach(client => {
        let card = parseInt(Math.random() * 100, 10);
        hands[client.info.token] = card;
        client.send(`you got a ${card}`);
    });
}
function compare () {
    let max = 0;
    let winner = null;
    players.forEach(client => {
        let card = hands[client.info.token];
        if (card > max) {
            max = card;
            winner = client;
        }
    });
    announce(winner);
    settle(winner.info.token);
}
function announce (winner) {
    let winnerTip = `you win, score +${players.length - 1}`;
    let loserTip = `${winner.info.nickname} wins, your score -1`;
    winner.send(winnerTip);
    players.forEach(player => {
        if (player === winner) return;
        player.send(loserTip);
    });
}
function settle (winnerToken) {
    let userList = userModel.getUserList();
    let playerTokens = players.map(client => client.info.token);
    userList = userList.map(o => {
        if (o.token === winnerToken) {
            o.score += (players.length - 1);
        } else if (playerTokens.includes(o.token)) {
            o.score--;
        }
        return o;
    });
    userModel.updateUserList(userList);
}

