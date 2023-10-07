const { app, BrowserWindow, globalShortcut, screen } = require('electron')

const url = 'https://calendar.google.com/calendar'
let mainWindow = null
let ignoreMouseEvents = true

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    const winWidth = Math.round(width * 0.8)
    const winHeight = Math.round(height * 0.8)

    mainWindow = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        x: Math.round((width - winWidth) / 2),
        y: Math.round((height - winHeight) / 2),
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: false,
        hasShadow: false,
        type: 'desktop',
        closable: false
    })

    mainWindow.loadURL(url)

    mainWindow.setIgnoreMouseEvents(ignoreMouseEvents)

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    const toggleWindowVisibility = () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    }

    globalShortcut.register('CommandOrControl+Alt+H', toggleWindowVisibility)

    globalShortcut.register('CommandOrControl+Alt+C', () => {
        ignoreMouseEvents = !ignoreMouseEvents
        mainWindow.setIgnoreMouseEvents(ignoreMouseEvents)
    })

    globalShortcut.register('CommandOrControl+Alt+R', () => {
        mainWindow.webContents.session.clearStorageData({ storages: ['cookies'] });
        mainWindow.reload();
    });
}

app.on('ready', createWindow)

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})