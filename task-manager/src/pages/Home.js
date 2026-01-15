import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="container mx-auto mt-12 px-4">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-12 max-w-3xl mx-auto`}>
        <h1 className="text-5xl font-bold mb-6 text-center">Welcome to TaskManager</h1>
        <p className={`text-xl mb-8 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          A modern task management application built with React
        </p>
        <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-6 rounded-lg mb-8`}>
          <h2 className="text-2xl font-semibold mb-4">Features:</h2>
          <ul className="space-y-2">
            <li>✅ View and manage your tasks</li>
            <li>🔍 Search tasks by title</li>
            <li>📄 Pagination for easy navigation</li>
            <li>🌓 Light/Dark mode toggle</li>
            <li>📱 Responsive design</li>
          </ul>
        </div>
        <div className="text-center">
          <Link
            to="/tasks"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;