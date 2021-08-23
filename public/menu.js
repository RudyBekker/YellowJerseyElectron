const { app, BrowserWindow, Menu } = require('electron');
const mainProcess = require('./electron');
const path = require('path');
const Store = require('electron-store');
const storage = require('electron-localstorage');

var template = [
    {
        label: 'Dashboard', click() {
            loadWindowUrl('https://discover360.app/dashboard')
        }
    },
    {
        label: 'Facebook', click() {
            loadWindowUrl('https://www.facebook.com/groups/feed')
        }
    },
    {
        label: 'Setting', click() {
            loadWindowUrl(`file://${path.join(__dirname, '/setting.html')}`);
        }
    },
    {
        label: 'Quit',
        submenu: [
            {
                label: 'Exit',
                click() {
                    app.quit()
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    template = [
        {
            label: app.getName()
        },
        {
            label: 'Dashboard',
            submenu: [{
                label: 'dashboard',
                click() {
                    loadWindowUrl('https://discover360.app/dashboard')
                }
            }]
        },
        {
            label: 'Facebook',
            submenu: [{
                label: 'facebook',
                click() {
                    loadWindowUrl('https://www.facebook.com/groups/feed')
                }
            }]
        },
        {
            label: 'Setting',
            submenu: [{
                label: 'setting',
                click() {
                    loadWindowUrl('http://localhost:3000/setting');
                }
            }]
        },
        {
            label: "Edit",
            submenu: [
                {
                    label: "Undo",
                    accelerator: "CmdOrCtrl+Z",
                    selector: "undo:"
                },
                {
                    label: "Redo",
                    accelerator: "Shift+CmdOrCtrl+Z",
                    selector: "redo:"
                },
                {
                    type: "separator"
                },
                {
                    label: "Cut",
                    accelerator: "CmdOrCtrl+X",
                    selector: "cut:"
                },
                {
                    label: "Copy",
                    accelerator: "CmdOrCtrl+C",
                    selector: "copy:"
                },
                {
                    label: "Paste",
                    accelerator: "CmdOrCtrl+V",
                    selector: "paste:"
                },
                {
                    label: "Select All",
                    accelerator: "CmdOrCtrl+A",
                    selector: "selectAll:"
                }
            ]
        },
        {
            label: 'Quit',
            submenu: [
                {
                    label: 'Exit',
                    click() {
                        app.quit()
                    }
                }
            ]
        }
    ];
}


function loadWindowUrl(url) {
    return mainProcess.loadRedirectUrl(url);
}


module.exports = Menu.buildFromTemplate(template);

