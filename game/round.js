let userModel = require('../model/user');
let broadcast = require('./broadcast');
let send = require('./send');
let Deck = require('./deck');
let wss = null;
let deck = new Deck().shuffle().shuffle();

exports.begin = function (_wss) {
    wss = _wss;
    wss.players = wss.clients.slice();
    if (wss.players.length < 2) {
        broadcast(wss, 'text', `等待其他玩家..`);
        return;
    }
    broadcast(wss, 'text-ok', '游戏开始!');
    serve();
    compare();
}
function serve () {
    var n = wss.players.length * 2;
    if (deck.cards.length < n) {
        broadcast(wss, 'text', `重新洗牌`);
        deck = new Deck().shuffle().shuffle();
    }
    let deal = deck.deal(n);
    wss.hands = [];
    wss.players.forEach(client => {
        let hand = deal.splice(0, 2);
        let token = client.info.token;
        wss.hands[token] = hand;
        let cardInfo = {token, hand};
        send(wss, client, 'card', JSON.stringify(cardInfo));
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