let tip = require('./util/tip');
let q = require('./util/q');

let token = q('token');
let url = 'ws://localhost:9000?token='+ token; 
// let url = 'ws://localhost:9000?token='+ location.search.split('?')[1]; 
let ws = new WebSocket(url);
let send = (type, content) => ws.send(JSON.stringify({type, content}));

ws.onopen = () => {
    // console.log("连接状态", ws);
    // $("#show").html("连接状态;" + ws.readyState + "</br>");
    // console.log("open");
};
ws.onmessage = e => {
    let data = JSON.parse(e.data);
    if (data.type.includes('text')) print(data);

};
ws.onclose = e => console.log("WebSocketClosed!");
ws.onerror = e => console.log("WebSocketError!");

// ws.send('sdf');
// ws.close();
function print (data) {
    let html = `<div class="${data.type}">${data.content}</div>`;
    document.querySelector('.main-board').innerHTML += html;    
}

document.querySelector('.main-begin').addEventListener('click', e => {
    send('begin');
}, false);
document.querySelector('.main-speak').addEventListener('click', e => {
    let input = document.querySelector('.main-input');
    let words = input.value.trim();
    if (!words) return;
    if (words.length > 100) {
        alert('说太多了吧…');
        return;
    }
    send('speak', words);
    input.value = '';
}, false);
