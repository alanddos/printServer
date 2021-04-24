var print = require("printer");
var path = require("path");
var Promise = require('bluebird');
const pdf = Promise.promisifyAll(require('html-pdf'));
const moment = require('moment')

//cria um pdf asyncrono
async function makePdf (data){
  return new Promise(
    async (resolve, rejects)=> {
      try {        
        let res = await pdf.createAsync(data.html, {  width: "80mm", filename: `pdfs/${data.impressora} - ${moment().unix()}.pdf` });
        resolve({err: false, caminho: res.filename, impressora: data.impressora})
      } catch (error) {
        console.log('Falha na criaçao do pdf',error)
      }
    }
  )  
}

//cria um laço asyncrono
async function* streamAsyncIterator(data) {
  try {
    var i = 0;
    while (i < data.length) {
      yield  data[i]
      i++;      
    }
  } finally {
    'Fim'
  }
}

async function printHtml(data) {
  let arquivos = []
  try {
    for await (let html of streamAsyncIterator(data)) {
      let arquivo = await makePdf(html)
      arquivos.push(arquivo)
    }
    return arquivos
  } catch (error) {
    
  }
}

async function printNow(dados) {
 try {
  console.log('caminho chegou', dados)
  if (!dados) return 'Nenhum arquivo foi definido!'
  if (dados.length === 0) return 'Nenhum Arquivo e impressora indefinido!'
  
  dados.map( (data)=> {
    let printerName = data.impressora
    let filename = path.join( data.caminho);
    console.log(`Imprimindo arquivo: ${filename}`);
    if (process.platform != "win32") {
      print.printFile({
        filename: filename,
        printer: printerName, // printer name, if missing then will print to default printer
        success: function (jobID) {
          console.log("Impressão enviada ID: " + jobID);
        },
        error: function (err) {
          console.log(err);
        },
      });
    } else {
      // not yet implemented, use printDirect and text
      var fs = require("fs");
      print.printDirect({
        data: fs.readFileSync(filename),
        printer: printerName, // printer name, if missing then will print to default printer
        success: function (jobID) {
          fs.rmSync(filename)
          console.log("Impressão enviada ID: " + jobID);
        },
        error: function (err) {
          console.log(err);
        },
      });
    } 
  })
  return({err: false, data: dados})
 } catch (error) {
  return({err: true, data: erro})
 }
}

function getPrinters(printerName) {
  let printers = print.getPrinters();
  console.log(printerName);
  console.log(printers);
}

module.exports = {
  getPrinters,
  printNow,
  printHtml,
};
