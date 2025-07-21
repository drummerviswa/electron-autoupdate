import { useEffect } from 'react'

function App() {
  useEffect(() => {
    window.api?.updateMessage?.(() => {
      alert('Update Available! Restarting soon...')
    })
  }, [])

  return (
    <div>
      <h1>Welcome to the AutoUpdate Example</h1>
      <p>This app will automatically update when a new version is available.</p>
      <p>Check the console for update messages.</p>
      <button onClick={() => window.api?.checkForUpdates()}>Check for Updates</button>
      <button onClick={() => window.api?.downloadUpdate()}>Download Update</button>
    </div>
  )
}

export default App
