import { useEffect } from 'react'

function App() {
  useEffect(() => {
    window.api?.updateMessage?.(() => {
      alert('Update Available! Restarting soon...')
    })
  }, [])

  return (
    <div>
      <h1>This is the new version of the application</h1>
      <h1>Test the new &apos;Auto Update Feature&apos;</h1>
    </div>
  )
}

export default App
