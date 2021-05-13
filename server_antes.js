const express = require('express')
const app = express()
app.use(express.static(__dirname));
const http = require('http');
const server = http.createServer(app);

//Socket
const { Server } = require("socket.io");
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected');
});
//Socket


const printService = require('./impressao')
const ejsService = require('./ejsHtml')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
//const jasper = require('./jasper')

const port = 3500

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/impressoras',async (req, res) => { 
    console.log('Chegou na pesquisa',req.body)
    await printService.getPrinters('Cupom')
  res.send()
})

app.post('/imprimir',async (req, res) => {  
  try {
    console.log('Chegou!',req.body)
    let html = await ejsService.getHtml(req.body)
    let arquivo = await printService.printHtml(html)
    let imprimir = await printService.printNow(arquivo)
    res.send({error: false, data: imprimir})
  } catch (error) {
    res.send({error: String(error), data: false})
  }
})

app.listen(port, () => {
  console.log(`Servidor Rodando em http://localhost:${port}`)
})