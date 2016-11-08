let userModel = require('../model/user');
let broadcast = require('./broadcast');
let Deck = require('./deck');
let wss = null;
let deck = new Deck().shuffle().shuffle();

exports.begin = function (_wss) {
    wss = _wss;
    wss.players = wss.clients.slice();
    if (wss.players.length < 2) {
        broadcast(wss, {
            type : 'text',
            info : '',
            content : '等待其他玩家..'
        });
        return;
    }
    broadcast(wss, {
        type : 'text',
        info : 'ok',
        content : '游戏开始!'
    });
    serve();
    compare();
}
function serve () {
    var n = wss.players.length * 2;
    if (deck.cards.length < n) {
        broadcast(wss, {
            type : 'text',
            info : '',
            content : '重新洗牌'
        });
        deck = new Deck().shuffle().shuffle();
    }
    let deal = deck.deal(n);
    wss.hands = [];
    wss.players.forEach(client => {
        let hand = deal.splice(0, 2);
        let token = client.info.token;
        wss.hands[token] = hand;
        client.send({
            type : 'card',
            info : '',
            content : [{ token, hand }]
        });
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
    winner.send({
        type : 'text',
        info : 'ok',
        content : `you win, score +${wss.players.length - 1}`
    });
    wss.players.forEach(player => {
        if (player === winner) return;
        player.send(wss, {
            type : 'text',
            info : 'warn',
            content : `${winner.info.nickname} wins, your score -1`
        });
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