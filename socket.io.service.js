var io;
exports.socketConnection = async (server) => {
  io = require("socket.io")(server);
  io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on("disconnect", () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
    socket.on("reimprimir", async (msg) => {
      const printService = require("./impressao");
      let html = [JSON.parse(msg)]
      let arquivo = await printService.printHtml(html);
      let imprimir = await printService.printNow(arquivo);
      sendDirectMessage('Reimpressao', 'Reimpressão realizada com sucesso!')
    });
  });
};

exports.sendMessage = (roomId, key, message) =>  io.to(roomId).emit(key, message);

exports.sendDirectMessage = (key, message) => io.emit(key, message);


exports.getRooms = () => io.sockets.adapter.rooms;
