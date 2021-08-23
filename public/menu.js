const { app, BrowserWindow, Menu } = require("electron");
const mainProcess = require("./electron");
const path = require("path");
const Store = require("electron-store");
const storage = require("electron-localstorage");

var template = [
  {
    label: "Dashboard",
    submenu: [
      {
        label: "Admin Dashboard",
        click() {
          loadWindowUrl("https://app.yellowjersey.io/settings");
        },
      },
      {
        label: "Settings",
        click() {
          loadWindowUrl("https://app.yellowjersey.io/settings");
        },
      },
    ],
  },
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
        label: "Back",
        click() {
          loadWindowUrl("javascript:history.go(-1)");
        },
      },
    ],
  },
  {
    label: "Quit",
    submenu: [
      {
        label: "Exit",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  template = [
    {
      label: app.getName(),
    },
    {
      label: "Dashboard",
      submenu: [
        {
          label: "Admin Dashboard",
          click() {
            loadWindowUrl("https://app.yellowjersey.io/settings");
          },
        },
        {
          label: "Settings",
          click() {
            loadWindowUrl("https://app.yellowjersey.io/settings");
          },
        },
      ],
    },
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
          label: "Back",
          click() {
            window.history.back();
          },
        },
      ],
    },
    {
      label: "Quit",
      submenu: [
        {
          label: "Exit",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          selector: "undo:",
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          selector: "redo:",
        },
        {
          type: "separator",
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:",
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:",
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:",
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:",
        },
      ],
    },
  ];
}

function loadWindowUrl(url) {
  return mainProcess.loadRedirectUrl(url);
}

module.exports = Menu.buildFromTemplate(template);
