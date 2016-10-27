let http = require('http');
let express = require('express');
let userRouter = require('./router/user');
let gameWss = require('./game/wss');

let port = 9000;
let server = http.createServer();
let app = express();

server.on('request', app);
server.listen(port, () => console.log(`${port} listened`));
gameWss.start(server);

app.get('/', (req, res) => res.send('hello fishing!'));
app.use('/public', express.static('./public'));
app.use('/user', userRouter);
