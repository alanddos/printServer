const express = require('express')
const printService = require('./impressao')
const ejsService = require('./ejsHtml')
//const jasper = require('./jasper')
const app = express()
const port = 3500

app.post('/impressoras',async (req, res) => { 
    console.log('Chegou na pesquisa',req.body)
    await printService.getPrinters('Cupom')
  res.send()
})

app.post('/imprimir',async (req, res) => {  
    //console.log(req.body)
    console.log('1')
    let html = await ejsService.getHtml()
    console.log('2')
    let arquivo = await printService.printHtml(html)
    console.log('3')
    let imprimir = await printService.printNow(arquivo)
    console.log('4')
    console.log(imprimir)
    res.send(req.body) //res.send(imprimir)
})

app.listen(port, () => {
  console.log(`Servidor Rodando em http://localhost:${port}`)
})