const path = require("path");
const Store = require("electron-store");
const os = require("os");
const fetch = require("node-fetch");

const { app, BrowserWindow, Menu, session } = require("electron");
const isDev = require("electron-is-dev");
const menu = require("./menu.js");
var request = require("request");

var windowScreen = "";
const store = new Store();

function createWindow() {
  // Create the browser window.
  // and load the index.html of the app.
  // win.loadFile("index.html");

  var win = new BrowserWindow({
    width: 1281,
    height: 800,
    minWidth: 1281,
    minHeight: 800,
    webPreferences: {
      preload: `${__dirname}/renderer.js`,
      nodeIntegration: true,
      devTools: false,
    },
    icon: path.join(__dirname, "YellowJerseyLogo.png"),
  });

  //webFrame.setZoomFactor(1);
  windowScreen = win;
  win.loadURL("https://app.yellowjersey.io/login");
  const filter = {
    urls: ["https://app.yellowjersey.io/login"],
  };

  // Open the DevTools.
  // if (isDev) {
  //   win.webContents.openDevTools({ mode: 'detach' });
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  Menu.setApplicationMenu(menu);
});

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  store.set("isLoggedIn", false);
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

async function loadRedirectUrl(url) {
  let isLoggedIn = store.get("isLoggedIn");
  if ((url.includes("facebook") || url.includes("setting")) && !isLoggedIn)
    return windowScreen.loadURL("https://discover360.app/login");
  await windowScreen.webContents
    .executeJavaScript(
      `let token = window.localStorage.getItem('app-token'); Promise.resolve(token);`
    )
    .then((token) => {
      if (token) store.set("token", token);
      return windowScreen.loadURL(url);
    })
    .catch((error) => console.log(error));
}

function goBackPage() {
  return windowScreen.webContents.executeJavaScript(`history.back()`);
}

function goNextPage() {
  return windowScreen.webContents.executeJavaScript(`history.forward()`);
}

exports.goBackPage = goBackPage;
exports.goNextPage = goNextPage;
exports.loadWindowUrl = loadWindowUrl;
