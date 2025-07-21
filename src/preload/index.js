import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  updateMessage: (callback) => {
    ipcRenderer.on('update_available', callback)
  }
})
