# printServer

Server para receber uma requisição externa e imprimir pedidos em impressoras diferentes definidas nos produtos

# Ex. Requisição:

{
  "itens": [
    {
      "item": 1,
      "produto_id": "11",
      "tamanho_id": "4",
      "quantidade": 1,
      "observacao": null,
      "ordem": "1/1",
      "descricao": "PIZZA BACON",
      "tamanho_nome": "Grande",
      "impressora": "CUPOM"
    },
    {
      "item": 2,
      "produto_id": "8",
      "tamanho_id": "6",
      "quantidade": 0.5,
      "observacao": null,
      "ordem": "1/2",
      "descricao": "PIZZA FILE BROCOLIS",
      "tamanho_nome": "Brotinho",
      "impressora": "CUPOM"
    },
    {
      "item": 2,
      "produto_id": "7",
      "tamanho_id": "6",
      "quantidade": 0.5,
      "observacao": null,
      "ordem": "2/2",
      "descricao": "PIZZA ALCATRA AO VINHO",
      "tamanho_nome": "Brotinho",
      "impressora": "CUPOM"
    }
  ],
  "forma_pagamento_id": 1,
  "retirar": 0,
  "endereco_id": "1",
  "observacao": null,
  "cliente_nome": "PAULO THIRY NETO",
  "cliente_telefone": "(67)99926-3220",
  "data_hora": "2021-04-20 00:11:03",
  "pedido_id": 56
}
