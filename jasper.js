const jasper = require("node-jasper-report")({
  path: "./lib/jasperreports-6.1.0",
  reports: {
    cozinha: {
      jasper: "./reports/Cozinha.jasper",
      jrxml: "./reports/Cozinha.jrxml",
    },
  },
});

async function generate(){
  return new Promise(
    async(resolve, rejects)=>{
      try {
        var report = {
          report: "cozinha",
          data: {}
          //dataset: //main dataset
        };
        var pdf = await jasper.pdf(report);        
        resolve({err: false, data: pdf})
      } catch (error) {
        resolve({err: true, data: String(error)})
      }
    }
  )
}

async function getPDF(dados) {  
  let pdf = await generate()
  //gravar o pdf em disco com id nome


  //retornar o caminho do pdf
  return pdf;
}

module.exports = {
  getPDF,
};
