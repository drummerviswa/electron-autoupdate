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
