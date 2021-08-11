const { app, BrowserWindow, Menu } = require('electron');
const mainProcess = require('./electron');
const path = require('path');
const Store = require('electron-store');
const storage = require('electron-localstorage');

const template = [
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
            loadWindowUrl('http://localhost:3000/setting'); 
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

function loadWindowUrl(url) {
    return mainProcess.loadRedirectUrl(url);
}


module.exports = Menu.buildFromTemplate(template);

