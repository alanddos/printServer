const express = require('express')
const app = express()
var bodyParser = require('body-parser')

const printService = require('./impressao')
const ejsService = require('./ejsHtml')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
//const jasper = require('./jasper')

const port = 3500

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
    //console.log(req.body)
    
})

app.listen(port, () => {
  console.log(`Servidor Rodando em http://localhost:${port}`)
})