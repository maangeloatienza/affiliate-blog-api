const http = require('http');
const app = require('./app.js');
const {Server} = require("socket.io");
const {connectSocket} = require('./socket/connectSocket'); 
require('dotenv');

const PORT = process.env.PORT || 2222;

const server = http.createServer(app);
const io = new Server(server)

connectSocket(io);

server.listen(PORT,()=>{
    console.log('Server started');
    console.log('==================');
    console.log(`Sserver running at \nPORT    ||    ${PORT}`);
    console.log('==================');

});