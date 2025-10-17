
# PrintServer

## Visão Geral

O **PrintServer** é um serviço dedicado a receber requisições externas (como pedidos de um e-commerce ou PDV) e rotear a impressão desses pedidos para impressoras específicas. Ele atua como uma camada de comunicação inteligente, garantindo que os itens de um pedido sejam impressos nos seus respectivos setores (cozinha, bar, caixa, etc.).

O projeto é desenvolvido utilizando **Node.js** e **Electron** para facilitar a distribuição e o gerenciamento de dependências de impressão nativas em ambientes desktop.

## 🚀 Funcionalidades Chave

* **Recebimento de Pedidos:** Escuta por requisições HTTP na porta `3000`.
* **Roteamento Inteligente:** Direciona a impressão com base no campo `itens.impressora` definido no JSON do pedido.
* **Processamento de HTML:** Utiliza **EJS** para renderizar os dados do JSON em um layout de impressão (`80mm`) antes da conversão para PDF.
* **Comunicação em Tempo Real:** Inclui suporte a **Socket.io** para logs de status, notificações de erro/sucesso de impressão e interface de reimpressão.

---

## 🔌 API Endpoints

O servidor é executado na porta **3000** e expõe as seguintes rotas:

| Método | Rota | Descrição | Corpo da Requisição |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Retorna o arquivo **index.html**, que é a interface de status e log. | *Nenhum* |
| **POST** | `/impressoras` | **Lista todas as impressoras** disponíveis e instaladas no sistema operacional. | Opcional: Filtros para pesquisa. |
| **POST** | `/imprimir` | Rota principal. Recebe os dados do pedido, processa o HTML com EJS, e envia para a impressão. | **JSON** do pedido. |

### Exemplo de Requisição (`POST /imprimir`)

O servidor espera um objeto JSON com o roteamento definido em cada item:

```json
{
  "itens": [
    {
      "descricao": "PIZZA BACON",
      "tamanho_nome": "Grande",
      "impressora": "CUPOM"  // **Chave para roteamento da impressão**
    },
    // ... outros itens
  ],
  "cliente_nome": "PAULO THIRY NETO",
  "data_hora": "2021-04-20 00:11:03",
  "pedido_id": 56
}

💻 Lógica de Impressão (Módulo impressao.js)
O serviço de impressão é a camada central do PrintServer. O fluxo de impressão é executado em três passos principais:
1. Preparação (Conversão e Serialização)
| Método | Descrição |
|---|---|
| printHtml(data) | Gerencia o lote. Itera sobre a lista de HTMLs recebidos (streamAsyncIterator) e chama makePdf para cada um, garantindo o processamento sequencial e assíncrono. |
| makePdf(data) | Criação Assíncrona de PDF. Utiliza html-pdf para transformar o HTML do pedido em um arquivo PDF temporário, formatado para largura de 80mm, pronto para ser enviado à impressora. |
2. Envio (Impressão Nativa)
| Método | Descrição |
|---|---|
| printNow(dados) | Recebe o caminho dos PDFs gerados e envia cada arquivo para a impressora configurada (data.impressora). Utiliza comandos específicos da biblioteca printer para lidar com as diferenças entre Windows (printDirect - buffer) e Linux/macOS (printFile). |
| getPrinters() | Retorna a lista de impressoras disponíveis, utilizada pela rota /impressoras. |
3. Notificação
 * Ao final de makePdf e dentro de printNow, o status (sucesso ou falha) da operação é enviado para o front-end via Socket.io utilizando o método sendDirectMessage().
🖥️ Interface de Status (index.html)
A interface de acesso via GET / permite monitorar o servidor e interagir com os logs em tempo real via Socket.io.
Eventos Socket.io
| Evento | Direção | Propósito |
|---|---|---|
| stdout | Servidor -> Cliente | Exibe o último status (sucesso ou erro) no campo de status principal. |
| html | Servidor -> Cliente | Recebe o HTML do pedido processado. Renderiza o log detalhado e o botão de reimpressão na lista de mensagens. |
| reimprimir | Cliente -> Servidor | Evento acionado pelo botão da interface. Envia o JSON do pedido para ser processado e impresso novamente. |
🛠️ Desenvolvimento e Execução (Electron)
Este projeto utiliza o Electron, o que exige um passo adicional para lidar com módulos Node.js nativos (como a biblioteca printer).
⚠️ Reconstrução de Módulos Nativos
É mandatório executar o electron-rebuild toda vez que você rodar npm install ou alterar a versão do Electron:
Linux/macOS
./node_modules/.bin/electron-rebuild

Windows
.\node_modules\.bin\electron-rebuild.cmd

⚙️ Configuração de Logs
Para debug, ative o log do Electron.
Windows (Prompt de Comando)
set ELECTRON_ENABLE_LOGGING=true

Linux/macOS (Shell)
export ELECTRON_ENABLE_LOGGING=true


