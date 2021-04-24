var print = require("printer");
var path = require("path");
let pdf = require("html-pdf");

async function printHtml(data) {
  console.log("Gera pdf", data);

  let options = {
    width: "80mm"    
  };

  let arquivos = []
  for await (const imp of data) {
    pdf.create(imp.html, options).toFile( `${imp.impressora + Date}.pdf`, function (err, data) {
      arquivos.push({
        impressora: imp.impressora,
        caminho: data
      })
      if (err) {
        return 'Erro'
      } else {
        return "Criou pdf";
      }
    }); 
  }
  return arquivos
}

async function printNow(data) {

  console.log('caminho chegou', data)

  let filename = data[0].caminho
  let printerName = data[0].impressora

  filename = path.join(__dirname, filename);
  console.log("platform:", process.platform);
  console.log(`try to print file: ${filename}`);

  if (process.platform != "win32") {
    print.printFile({
      filename: filename,
      printer: printerName, // printer name, if missing then will print to default printer
      success: function (jobID) {
        console.log("sent to printer with ID: " + jobID);
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
        console.log("sent to printer with ID: " + jobID);
      },
      error: function (err) {
        console.log(err);
      },
    });
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
