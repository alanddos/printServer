// var nodeConsole = require("console");
// var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
// myConsole.log("Iniciando aplicacao de impressoras!");
// console.log(myConsole)

const {app, BrowserWindow, Menu, Tray, ipcMain  } = require("electron");
const electron = require("electron");
// Module to control application life.

// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow;

const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // launch the express server
  app.server = require(path.join(__dirname, "/server.js"));

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 280,
    autoHideMenuBar: true,
    useContentSize: true,
    webPreferences: {
      webSecurity: false,
    },
    webPreferences: {
      nodeIntegration: false,
    },
    icon: __dirname + "/img/ripp.png",
  });

  //ao minimizar vai para barra
  mainWindow.on("minimize", () => {
    mainWindow.setSkipTaskbar(true);
  });

  // Visit the express server page
  mainWindow.loadURL("http://localhost:3000/");
  mainWindow.focus();

  //carregando pelo express
  // mainWindow.loadURL(
  //   require("url").format({
  //     pathname: path.join(__dirname, "index.html"),
  //     protocol: "file:",
  //     slashes: true,
  //   })
  // );


  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  tray = new Tray(path.join(__dirname + "/img/ripp.png"));
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Abrir",
      click: () => {
        mainWindow.restore();
      },
    },
    {
      label: "Fechar",
      role: "quit",
    },
  ]);
  tray.setContextMenu(trayMenu);
  mainWindow.minimize();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("stdout", (event) => {
  event.reply("stdou_reply", myConsole);
});


