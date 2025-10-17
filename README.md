Com certeza! Aqui está o README formatado para exibição ideal no GitHub:
# PrintServer

## Visão Geral

O **PrintServer** é um serviço dedicado a receber requisições externas contendo informações de pedidos e rotear a impressão desses pedidos para impressoras específicas, de acordo com as definições associadas aos produtos.

É a camada de comunicação que permite que um sistema de pedidos (e-commerce, PDV, etc.) envie os dados de um pedido para serem impressos em diferentes setores (cozinha, bar, caixa, etc.).

## 🚀 Funcionalidades

* **Recebimento de Pedidos:** Escuta por requisições HTTP contendo os detalhes de um novo pedido.
* **Roteamento Inteligente de Impressão:** Analisa o campo `impressora` em cada item do pedido (`itens.impressora`) e direciona a impressão para a impressora configurada correspondente (ex: "CUPOM", "COZINHA", "BAR").
* **Processamento de Dados:** Formata os dados recebidos para um layout de impressão adequado.

## 📥 Exemplo de Requisição (JSON)

O servidor espera receber um objeto JSON com o seguinte formato (simplificado):

```json
{
  "itens": [
    {
      "item": 1,
      "produto_id": "11",
      "quantidade": 1,
      "descricao": "PIZZA BACON",
      "tamanho_nome": "Grande",
      "impressora": "CUPOM"  // **Chave para roteamento da impressão**
    },
    {
      "item": 2,
      "produto_id": "8",
      "quantidade": 0.5,
      "descricao": "PIZZA FILE BROCOLIS",
      "tamanho_nome": "Brotinho",
      "impressora": "CUPOM"
    },
    {
      "item": 2,
      "produto_id": "7",
      "quantidade": 0.5,
      "descricao": "PIZZA ALCATRA AO VINHO",
      "tamanho_nome": "Brotinho",
      "impressora": "CUPOM"
    }
  ],
  "forma_pagamento_id": 1,
  "cliente_nome": "PAULO THIRY NETO",
  "data_hora": "2021-04-20 00:11:03",
  "pedido_id": 56
}
```

💻 Desenvolvimento com Electron
Este projeto utiliza o Electron, o que requer atenção especial ao instalar dependências nativas.
⚠️ Reconstrução de Módulos Nativos (electron-rebuild)
Módulos Node.js nativos precisam ser reconstruídos para serem compatíveis com a versão do Electron utilizada. O processo deve ser executado toda vez que você rodar npm install ou alterar a versão do Electron.
Para mais detalhes, consulte: Using Native Node Modules with Electron
Reconstrução (Linux/macOS)
./node_modules/.bin/electron-rebuild

Reconstrução (Windows)
.\node_modules\.bin\electron-rebuild.cmd

⚙️ Configuração de Logs
Para fins de depuração e diagnóstico, ative o log do Electron.
Ativar Log (Windows - via Prompt de Comando)
set ELECTRON_ENABLE_LOGGING=true

Ativar Log (Linux/macOS - via Shell)
export ELECTRON_ENABLE_LOGGING=true


