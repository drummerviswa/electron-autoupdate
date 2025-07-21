import { useEffect } from 'react'

function App() {
  useEffect(() => {
    window.api?.updateMessage?.(() => {
      alert('Update Available! Restarting soon...')
    })
  }, [])

  return (
    <div>
      <h1>Auto Update Test</h1>
    </div>
  )
}

export default App
