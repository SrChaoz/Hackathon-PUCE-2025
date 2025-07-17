import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-green-500">MyMusicApp</div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/songs" className="hover:text-green-500">Canciones</Link>
        </li>
        <li>
          <Link to="/add-song" className="hover:text-green-500">Agregar Canción</Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-green-500">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
