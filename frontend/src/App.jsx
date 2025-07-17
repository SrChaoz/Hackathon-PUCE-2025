import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PrivateRoute from './components/PrivateRoute';
import Songs from './pages/Songs';
import AddSong from './pages/AddSong';
import EditSong from './pages/EditSong';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Routes>
        <Route
          path="/songs"
          element={
            <PrivateRoute>
              <Songs />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-song"
          element={
            <PrivateRoute>
              <AddSong />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-song/:id"
          element={
            <PrivateRoute>
              <EditSong />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
