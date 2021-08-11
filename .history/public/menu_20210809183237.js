const { app, BrowserWindow, Menu } = require("electron");
const mainProcess = require("./electron");
const path = require("path");
const Store = require("electron-store");
const storage = require("electron-localstorage");

const template = [
  {
    label: "Email",
    submenu: [
      {
        label: "Gmail",
        click() {
          loadWindowUrl("https://accounts.google.com/b/1/AddMailService");
        },
      },
      {
        label: "Outlook",
        click() {
          loadWindowUrl("https://outlook.office365.com/mail/");
        },
      },
      {
        label: "YJ Dash",
        click() {
          loadWindowUrl("https://dash.yellowjersey.dev/admin/");
        },
      },
    ],
  },
  {
    label: "YellowJersey",
    submenu: [
      {
        label: "Dashboard",
        click() {
          loadWindowUrl("https://dash.yellowjersey.dev/admin/");
        },
      },
      {
        label: "Support",
        click() {
          loadWindowUrl("https://outlook.office365.com/mail/");
        },
      },
      {
        label: "Exit",
        click() {
          app.quit();
        },
      },
    ],
  },
];

function loadWindowUrl(url) {
  return mainProcess.loadRedirectUrl(url);
}

module.exports = Menu.buildFromTemplate(template);
