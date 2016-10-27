let userModel = require('../model/user');
let broadcast = require('./broadcast');
let send = require('./send');
let wss = null;

exports.begin = function (_wss) {
    wss = _wss;
    wss.players = wss.clients.slice();
    if (wss.players.length < 2) {
        broadcast(wss, 'text', `waiting other players..`);
        return;
    }
    broadcast(wss, 'text-ok', 'game begins!');
    serve();
    compare();
}
function serve () {
    wss.players.forEach(client => {
        let card = parseInt(Math.random() * 100, 10);
        wss.hands[client.info.token] = card;
        send(wss, client, 'text', `you got a ${card}`);
    });
}
function compare () {
    let max = 0;
    let winner = null;
    wss.players.forEach(client => {
        let card = wss.hands[client.info.token];
        if (card > max) {
            max = card;
            winner = client;
        }
    });
    announce(winner);
    settle(winner.info.token);
}
function announce (winner) {
    let winnerTip = `you win, score +${wss.players.length - 1}`;
    let loserTip = `${winner.info.nickname} wins, your score -1`;
    send(winner, 'text-ok', winnerTip);
    wss.players.forEach(player => {
        if (player === winner) return;
        send(player, 'text-warn', loserTip);
    });
}
function settle (winnerToken) {
    let userList = userModel.getUserList();
    let playerTokens = wss.players.map(client => client.info.token);
    userList = userList.map(o => {
        if (o.token === winnerToken) {
            o.score += (wss.players.length - 1);
        } else if (playerTokens.includes(o.token)) {
            o.score--;
        }
        return o;
    });
    userModel.updateUserList(userList);
}