import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`${isDark ? 'bg-gray-800' : 'bg-blue-600'} p-4 shadow-lg`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">TaskManager</h1>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-white hover:text-gray-300 transition">Home</Link>
          <Link to="/tasks" className="text-white hover:text-gray-300 transition">Tasks</Link>
          <button
            onClick={toggleTheme}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;