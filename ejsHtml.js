const { rejects } = require("assert");
let ejs = require("ejs");
const { resolve } = require("path");
const moment = require('moment')

async function getHtml(dados) {
  let data
  if (dados){
    data = daddos
  }else{
    console.log('Não veio informações. Usando dados de testes!')
    data = JSON.parse(
      JSON.stringify({
        itens: [
          {
            item: 1,
            produto_id: "11",
            tamanho_id: "4",
            quantidade: 1,
            observacao: null,
            ordem: "1/1",
            descricao: "PIZZA BACON",
            tamanho_nome: "Grande",
            impressora: "Microsoft Print to PDF",
          },
          {
            item: 2,
            produto_id: "8",
            tamanho_id: "6",
            quantidade: 0.5,
            observacao: null,
            ordem: "1/2",
            descricao: "PIZZA FILE BROCOLIS",
            tamanho_nome: "Brotinho",
            impressora: "Impressora (HP LaserJet M1536dnf MFP)", //"Impressora (HP LaserJet M1536dnf MFP)",
          },
          {
            item: 2,
            produto_id: "7",
            tamanho_id: "6",
            quantidade: 0.5,
            observacao: null,
            ordem: "2/2",
            descricao: "PIZZA ALCATRA AO VINHO",
            tamanho_nome: "Brotinho",
            impressora: "Impressora (HP LaserJet M1536dnf MFP)",
          },
        ],
        forma_pagamento_id: 1,
        retirar: 0,
        endereco_id: "1",
        observacao: "Sem cebola, com mais pimenta",
        cliente_nome: "PAULO THIRY NETO",
        cliente_telefone: "(67)99926-3220",
        data_hora: "2021-04-20 00:11:03",
        pedido_id: 56,
      })
    );
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
    console.log('------------------------------------------------------------------------------------');
    console.log(imp.impressora);
    console.log('------------------------------------------------------------------------------------');
    console.log(obj);
    console.log('------------------------------------------------------------------------------------');
    impressao.push({
      impressora: imp.impressora,
      html: obj,
    });
  }
  return impressao;
}

async function makeHtml(data, itensImpressora) {
  return new Promise(async (resolve, rejects) => {
    try {
      let itensPed = itensImpressora;
      if (itensPed) {
        let html = ejs.render(`
        <html>
        <table style="border: 2px dashed #bbbbbb; width:80mm;">
          <thead>
            <tr>
              <th style="width: 355.2px;" colspan="4">
              <h2 style="color: #2e6c80;">Pedido:${data.pedido_id}</h2>
              </th>
              <th style="width: 111.2px;">${moment(data.data_hora, 'YYYY-MM-DD hh:mm:ss').format('L')} ${moment(data.data_hora, 'YYYY-MM-DD hh:mm:ss').format('LTS')}</th>
            </tr>
            <tr>
              <th style="width: 355.2px; text-align: left !important;" colspan="3">Nome: ${data.cliente_nome}</th>
              <th style="width: 111.2px;" colspan="2">${data.cliente_telefone}</th>
            </tr>
            <tr>
              <td style="width: 472px;" colspan="5">&nbsp;</td>
            </tr>
            <tr>
              <th style="width: 45.6px;">item</th>
              <th style="width: 208.8px;">Descri&ccedil;&atilde;o</th>
              <th >Quant</th>
              <th>Ordem</th>
              <th style="width: 111.2px;">Tamanho</th>
            </tr>
          </thead>
          <tbody>%>`);
        html += ejs.render(
          `<% itensPed.forEach(function(item){%>
            <tr>     
              <td style="text-align:center"><%= item.item%></td>
              <td><%= item.descricao%></td>
              <td style="text-align:center"><%= item.quantidade %></td>
              <td style="text-align:center"><%= item.ordem %></td>
              <td style="text-align:center"><%= item.tamanho_nome %></td>
            </tr><% })%>`,
          { itensPed: itensPed }
        );
        html += ejs.render(`
      </tbody>
      </table>
      <p>Observa&ccedil;&otilde;es:<br /><strong>${data.observacao}</strong></p>
      </html>
        %>`);
        resolve(html);
      }
    } catch (error) {
      console.log("Falha ao criar html buffer", error);
    }
  });
}

module.exports = {
  getHtml,
};
