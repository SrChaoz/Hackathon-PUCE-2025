import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Songs from './pages/Songs';
import AddSong from './pages/AddSong';
import EditSong from './pages/EditSong';

const App = () => {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/add-song" element={<AddSong />} />
          <Route path="/edit-song/:id" element={<EditSong />} />
          {/* Otras rutas se agregarán aquí */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
