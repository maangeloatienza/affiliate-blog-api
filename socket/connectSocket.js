

module.exports.connectSocket = (io)=>{
  io.on('connection',function(socket){
    socket.on('socket:connect','connected');
  })
}