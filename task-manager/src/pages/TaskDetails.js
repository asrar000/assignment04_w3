import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const TaskDetails = () => {
  const { isDark } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: task, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto mt-8 px-4">
      <button
        onClick={() => navigate('/tasks')}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ← Back to Tasks
      </button>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-8 max-w-2xl mx-auto`}>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Task Details</h1>
          {task?.completed && (
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Completed
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Task ID
            </label>
            <p className="text-2xl font-bold">{task?.id}</p>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Title
            </label>
            <p className="text-xl">{task?.title}</p>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              User ID
            </label>
            <p className="text-xl">{task?.userId}</p>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Status
            </label>
            <p className={`text-xl font-semibold ${task?.completed ? 'text-green-500' : 'text-yellow-500'}`}>
              {task?.completed ? 'Completed' : 'In Progress'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;