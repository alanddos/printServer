const express = require("express");
const app = express();
const printService = require("./impressao");
const ejsService = require("./ejsHtml");
app.use(express.static(__dirname));
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const { socketConnection } = require("./socket.io.service");
const http = require("http");
const server = http.createServer(app);
socketConnection(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/impressoras", async (req, res) => {
  console.log("Chegou na pesquisa", req.body);
  let impressoras = await printService.getPrinters("Cupom");
  res.send(impressoras);
});

app.post("/imprimir", async (req, res) => {
  try {
    console.log("Chegou!", req.body);
    let html = await ejsService.getHtml(req.body);
    let arquivo = await printService.printHtml(html);
    let imprimir = await printService.printNow(arquivo);
    res.send({ error: false, data: imprimir });
  } catch (error) {
    res.send({ error: String(error), data: false });
  }
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
