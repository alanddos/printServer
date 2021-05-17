const { rejects } = require("assert");
let ejs = require("ejs");
const { resolve } = require("path");
const moment = require("moment");
moment.locale("pt-br");
const {
  sendMessage,
  getRooms,
  sendDirectMessage,
} = require("./socket.io.service");

async function getHtml(dados) {
  let data;
  if (dados) {
    data = dados;
  } else {
    throw new Error("A requisição não possui informações");
  }

  let itensPed = data.itens;

  let impressora = [...new Set(itensPed.map((item) => item.impressora))];
  let itensImpressora = [];
  impressora.map((i) => {
    itensImpressora.push({
      impressora: i,
      itens: itensPed.filter((it) => {
        if (it.impressora == i) {
          return it;
        }
      }),
    });
  });

  let impressao = [];
  for await (const imp of itensImpressora) {
    let obj = await makeHtml(data, imp.itens);
    console.log(
      "------------------------------------------------------------------------------------"
    );
    console.log(imp.impressora);
    console.log(
      "------------------------------------------------------------------------------------"
    );
    console.log(obj);
    console.log(
      "------------------------------------------------------------------------------------"
    );
    impressao.push({
      impressora: imp.impressora,
      html: obj,
    });
  }
  const message = impressao;
  const key = "html";
  sendDirectMessage(key, message);
  return impressao;
}

async function makeHtml(data, itensImpressora) {
  return new Promise(async (resolve, rejects) => {
    try {
      let itensPed = itensImpressora;
      if (itensPed) {
        let html = ejs.render(`
        <html style="width:80mm;">
        <table style="border: 2px dashed #bbbbbb">
          <thead>
            <tr>
              <th style="width: 355.2px;text-align: center;" colspan="4">
              <h2 style="color: #2e6c80;">Pedido:${data.pedido_id}</h2>
              </th>
              <th style="width: 111.2px;text-align: center;">${moment(
                data.data_hora,
                "YYYY-MM-DD hh:mm:ss"
              ).format("L")} ${moment(
          data.data_hora,
          "YYYY-MM-DD hh:mm:ss"
        ).format("LTS")}</th>
            </tr>
            <tr>
              <th style="width: 355.2px; text-align: left !important;" colspan="5">${
                data.cliente_nome
              }</th>
              </tr>
              <tr>
              <td colspan="3">&nbsp;</td>
              <th style="width: 111.2px; text-align: right" colspan="2">${
                data.cliente_telefone
              }</th>
            </tr>
            <tr>
              <td style="width: 472px;" colspan="5">&nbsp;</td>
            </tr>
            <tr>
              <th colspan="3" style="width: 208.8px;">Descri&ccedil;&atilde;o</th>
              <th >Quant</th>
              <th style="width: 111.2px;text-align: center;">Tamanho</th>
            </tr>
          </thead>
          <tbody>%>`);
        html += ejs.render(
          `<% for (var i = 0; i < itensPed.length; i++) { %>            
              <tr>            
              <td colspan="3"><%= itensPed[i].descricao %></td>
              <td style="text-align:center"><%= itensPed[i].quantidade %></td>
              <td style="text-align:center"><%= itensPed[i].tamanho_nome %></td>             
            </tr>            
            <% if(itensPed[i].observacao){ %>
              <tr>
              <td colspan="5">
              Obs. <strong><%= itensPed[i].observacao %><s/trong>
              </td>
              </tr>
            <% } %>
            <% if(itensPed[i+1]){ %>
            <% if(itensPed[i].item !== itensPed[i+1].item){ %>
             <tr>
             <td colspan="5">
              <hr style="width:100%;margin-left:0">              
             </td>
            </tr>
            <% } %>
            <% } %>
            <% } %>`,
            
          { itensPed: itensPed }
        );
        html += ejs.render(`
      </tbody>
      </table>
      <% if (data.observacao && data.observacao != null) {%>
      <p>Obs:<br /><strong>${data.observacao != null ? data.observacao : ''}</strong></p>
      <% } %>
      </html>`,{data : data});
        resolve(html);
      }
    } catch (error) {
      console.log("Falha ao criar html buffer", error);
      const message = JSON.stringify({key: "Falha ao criar html buffer: " + error});
      const key = "stderr";
      sendDirectMessage( key, message);
      throw new Error("Falha ao criar html buffer");
    }
  });
}

module.exports = {
  getHtml,
};
