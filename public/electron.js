const path = require('path');
const Store = require('electron-store');
const os = require('os')
const fetch = require('node-fetch');

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
      nodeIntegration: true,
      devTools: false
    },
    icon: path.join(__dirname, 'YellowJerseyLogo.png')
  });
  windowScreen = win;
  win.loadURL('https://app.yellowjersey.io/login');
  const filter = {
    urls: [
      "https://app.yellowjersey.io/login"
    ]
  }
  
  win.webContents.on('did-finish-load', function () {
    let currentURL = win.webContents.getURL();
    if (currentURL.includes('https://app.yellowjersey.io/settings')) {
      store.set('isLoggedIn', true);
    }
    if (currentURL.includes('https://mbasic.facebook.com')) {
      if (currentURL.includes('/groups'))
        facebookController.getFacebookGroupPosts(windowScreen);
      else windowScreen.webContents.executeJavaScript(`sessionStorage.removeItem('isStart'); sessionStorage.removeItem('postList')`)

    }

    if (currentURL.includes('www.facebook.com') || currentURL.includes('web.facebook.com')) {
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

    if (message && message.includes('totalPostExtractor-->')) {
      message = message.replace('totalPostExtractor-->', '')
      await sendPostDetailToDiscover(message);
    }
    // console.log('renderer console.%s: %s', ['debug', 'info', 'warn', 'error'][level + 1], message);
  });

  // Open the DevTools.
  // if (isDev) {
  //   win.webContents.openDevTools({ mode: 'detach' });
  // }
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
  store.set('isLoggedIn', false);
  app.quit();
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function sendPostDetailToDiscover(message) {
  let token = store.get('token');
  var options = {
    method: 'POST',
    url: 'https://discover360.app/api/groups',
    headers:
    {
      authorization: 'Bearer ' + token,
      'content-type': 'application/json'
    },
    body: message ? JSON.parse(message) : {},
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });
}

function sendAudienDetailToDiscover(message) {
  let token = store.get('token');
  let user_email = store.get('user_email');
  var options = {
    method: 'POST',
    url: 'https://discover360.app/api/sources/create',
    headers:
    {
      authorization: 'Bearer ' + token,
      'content-type': 'application/json'
    },
    body: JSON.parse(message),
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });
  if (user_email) message.user_email = user_email;
  return fetch('https://275331af05cc8b5e03a513cfcb29d134.m.pipedream.net', {
    method: "POST",
    headers: {
      authorization: 'Bearer ' + token,
      'content-type': 'application/json'
    },
    body: message
  }).then(res => res.text())
    .then(body => console.log(body));


}

async function loadRedirectUrl(url) {
  let isLoggedIn = store.get('isLoggedIn');
  if ((url.includes('facebook') || url.includes('setting')) && !isLoggedIn) return windowScreen.loadURL('https://app.yellowjersey.io/login');
  await windowScreen.webContents.executeJavaScript(`let token = window.localStorage.getItem('app-token'); Promise.resolve(token);`)
    .then((token) => {
      if (token) store.set('token', token);
      return windowScreen.loadURL(url);
    })
    .catch((error) => console.log(error));

}

exports.loadRedirectUrl = loadRedirectUrl;

