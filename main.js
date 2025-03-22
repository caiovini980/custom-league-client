const { app, BrowserWindow } = require('electron/main')
const path = require(`node:path`)

const { Constants } = require(`./constants`)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, `preload.js`)
    }
  })

  win.loadFile(Constants.FileNames.HTML_FILE_NAME)
}

app.whenReady().then(() => {
  createWindow()

  app.on(Constants.Events.ACTIVATE_EVENT, () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
  })

  app.on(Constants.Events.WINDOW_ALL_CLOSED_EVENT, () => {
    if (process.platform != Constants.Platforms.MACOS_PLATFORM_NAME) {
        app.quit();
    }
    })
})
