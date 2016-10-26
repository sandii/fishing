let url = 'ws://localhost:3000?token='+ location.search.split('?')[1]; 
let ws = new WebSocket(url);
let send = (action, info) => ws.send(JSON.stringify({action, info}));

ws.onopen = () => {
    // console.log("连接状态", ws);
    // $("#show").html("连接状态;" + ws.readyState + "</br>");
    // console.log("open");
};
ws.onmessage = e => {
    // $("#show").append(e.data + "</br>");
    document.querySelector('.game-board').innerHTML += e.data +'<br/>';
};
ws.onclose = e => {
    console.log("WebSocketClosed!");
    console.log(e);
};
ws.onerror = e => {
    console.log("WebSocketError!");
};

// ws.send('sdf');
// ws.close();

document.querySelector('.game-begin').addEventListener('click', e => {
    send('begin');
}, false);
document.querySelector('.game-speak').addEventListener('click', e => {
    let input = document.querySelector('.game-input');
    let words = input.value.trim();
    if (!words) return;
    if (words.length > 100) {
        alert('说太多了吧…');
        return;
    }
    send('speak', words);
    input.value = '';
}, false);
