import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const NotFound = () => {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="container mx-auto mt-12 px-4">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-12 max-w-2xl mx-auto text-center`}>
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className={`text-xl mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          The page you're looking for doesn't exist.
        </p>
        <p className={`text-sm mb-8 ${isDark ? 'text-gray-500' : 'text-gray-500'} font-mono`}>
          Requested URL: {location.pathname}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate('/tasks')}
            className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-8 py-4 rounded-lg text-xl font-semibold transition`}
          >
            View Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;