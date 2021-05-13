var io;
exports.socketConnection = (server) => {
  io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.sendMessage = (roomId, key, message) => io.to(roomId).emit(key, message);

exports.sendDirectMessage = ( key, message) => io.emit(key, message);

exports.getRooms = () => io.sockets.adapter.rooms;