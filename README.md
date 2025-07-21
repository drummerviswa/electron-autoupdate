# 🪫 Electron auto update - github release

Step by step guide for you to setup auto update for your electron application using `electron-updater` and GitHub releases.

## Setup your electron application

- My personal choice is to use [electron-vite](https://electron-vite.org/) for a faster and more efficient development experience.

```
npm create @quick-start/electron@latest
```

```
✔ Project name: … <electron-app>
✔ Select a framework: › vue
✔ Add TypeScript? … No / Yes
✔ Add Electron updater plugin? … No / Yes
✔ Enable Electron download mirror proxy? … No / Yes

Scaffolding project in ./<electron-app>...
Done.
```

- Setup your IDE
  - Open the project in your favorite IDE (e.g., VSCode)
  - Install dependencies

```
cd <electron-app>

npm install
npm run dev
```

- Add the `electron-updater` package to your project

```
npm install electron-updater
```

- Add the following lines to your `src/main/index.js` file [Customize the existing setup of `mainWindow`]

```javascript
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
log.transports.file.level = 'info'
autoUpdater.logger = log
autoUpdater.autoDownload = true


let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.on('ping', () => console.log('pong'))
  createWindow()

  autoUpdater.checkForUpdates()

  autoUpdater.on('update-available', () => {
    log.info('Update available')
    mainWindow.webContents.send('update_available')
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded, quitting and installing...')
    autoUpdater.quitAndInstall()
  })

  autoUpdater.on('error', (err) => {
    log.error('Auto update error:', err)
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

- Add the following lines to your `src/preload/index.js` file

```javascript
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  updateMessage: (callback) => {
    ipcRenderer.on('update_available', callback)
  },
  checkForUpdates: () => {
    ipcRenderer.send('check_for_updates')
  },
  downloadUpdate: () => {
    ipcRenderer.send('download_update')
  }
})
```

- Setup your `package.json` file to include the `build` scripts

```json
{
  "scripts": {
    "build": "electron-builder",
    "publish": "electron-builder --publish always"
  },
  "build": {
    "appId": "com.yourname.app",
    "productName": "Electron AutoUpdate",
    "publish": [
      {
        "provider": "github",
        "owner": "drummerviswa",
        "repo": "electron-autoupdate"
      }
    ],
    "win": {
      "target": "nsis"
    }
  },
}
```

## Steps to auto update your electron app using GitHub releases

### Step - 1: Make changes in your electron app and push it to the github repo (desired new feature, bug fix, etc.)

### Step - 2: Setup your project for auto update by adding github token to your environment variables.

```
set GH_TOKEN=your_github_token
```

### Step - 4: Build your electron app

```
npm run build
```

### Step - 5: Create a new release on GitHub

```
npx electron-builder --publish always
```

# Contributing
Feel free to contribute by submitting issues or pull requests. Your contributions are welcome!
# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
# Author
Viswanathan P - [GitHub](https://github.com/drummerviswa)