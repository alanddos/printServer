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
  try {
    let html = await ejsService.getHtml()
    let arquivo = await printService.printHtml(html)
    let imprimir = await printService.printNow(arquivo)
    res.send(imprimir)
  } catch (error) {
    res.send(error)
  }
    //console.log(req.body)
    
})

app.listen(port, () => {
  console.log(`Servidor Rodando em http://localhost:${port}`)
})