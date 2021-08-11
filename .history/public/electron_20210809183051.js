const path = require('path');
const Store = require('electron-store');
const os = require('os')

const { app, BrowserWindow, Menu, session } = require('electron');
const isDev = require('electron-is-dev');
const menu = require('./menu.js');
var request = require('request');

var facebookController = require('../src/Facebook/facebook.controller');
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
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'hammer.png')
  });
  windowScreen = win;
  win.loadURL('https://discover360.app/login');

  win.webContents.on('did-finish-load', function () {
    let currentURL = win.webContents.getURL();
    if (currentURL.includes('https://discover360.app/dashboard')) {
      store.set('isLoggedIn', true);
    }
    if (currentURL.includes('mbasic.facebook.com')) {
      if (currentURL.includes('facebook.com/groups'))
        facebookController.getFacebookGroupPosts(windowScreen);
      else windowScreen.webContents.executeJavaScript(`window.localStorage.removeItem('postList');`)
    }

    if (currentURL.includes('www.facebook.com') || currentURL.includes('web.facebook.com')) {
      console.log('currentURL', currentURL)
      facebookController.getFacebookMembersDetail(windowScreen, session, store);
    }
  });

  win.webContents.once('dom-ready', () => {

  });

  win.webContents.on('console-message', async (event, level, message, line, sourceId) => {
    if (message && message.includes('stopExtractor-->')) {
      message = message.replace('stopExtractor-->', '')
      await sendAudienDetailToDiscover(message);
     
    }
    // console.log('renderer console.%s: %s', ['debug', 'info', 'warn', 'error'][level + 1], message);
  });

  // Open the DevTools.
  if (isDev) {
    // win.webContents.openDevTools({ mode: 'detach' });
  }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  Menu.setApplicationMenu(menu);
})

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    store.set('isLoggedIn', false);
    app.quit();
  }
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function sendAudienDetailToDiscover(message) {
  console.log(JSON.parse(message));
  let token = store.get('token');
  var options = { method: 'POST',
  url: 'https://discover360.app/api/sources/create',
  headers: 
   { 
     authorization: 'Bearer xcDwA6JWOozc9stCAcgjjlDMPMlrBlhknoODGYJN',
     'content-type': 'application/json' },
  body: JSON.parse(message),
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

}

function loadRedirectUrl(url) {
  let isLoggedIn = store.get('isLoggedIn');
  windowScreen.webContents.executeJavaScript(`let token = window.localStorage.getItem('app-token'); Promise.resolve(token);`)
    .then((token) => {
      if(token) store.set('token', token);
      if ((url.includes('facebook') || url.includes('setting')) && !isLoggedIn) {
        return windowScreen.loadURL('https://discover360.app/login');
      }
      return windowScreen.loadURL(url);
    })
    .catch((error) => console.log(error));

}

exports.loadRedirectUrl = loadRedirectUrl;

