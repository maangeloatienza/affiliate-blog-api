const http = require('http');
const app = require('./app.js');

require('dotenv');

const PORT = process.env.PORT || 2222;

const server = http.createServer(app);

server.listen(PORT,()=>{
    console.log('Server started');
    console.log('==================');
    console.log(`Sserver running at \nPORT    ||    ${PORT}`);
    console.log('==================');

});