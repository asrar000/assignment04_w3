import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const TaskDetails = () => {
  const { isDark } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [validId, setValidId] = useState(true);
  const [taskStatus, setTaskStatus] = useState(null);
  const { data: task, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  useEffect(() => {
    // Check if ID is a valid number and within range (1-200 for JSONPlaceholder)
    const taskId = parseInt(id);
    if (isNaN(taskId) || taskId < 1 || taskId > 200) {
      setValidId(false);
    }
  }, [id]);

  // Load task status from localStorage
  useEffect(() => {
    if (task) {
      const savedStatuses = JSON.parse(localStorage.getItem('taskStatuses') || '{}');
      setTaskStatus(savedStatuses[task.id] !== undefined ? savedStatuses[task.id] : task.completed);
    }
  }, [task]);

  const toggleTaskStatus = () => {
    const newStatus = !taskStatus;
    setTaskStatus(newStatus);
    
    // Save to localStorage
    const savedStatuses = JSON.parse(localStorage.getItem('taskStatuses') || '{}');
    savedStatuses[task.id] = newStatus;
    localStorage.setItem('taskStatuses', JSON.stringify(savedStatuses));
  };

  // Show 404 for invalid IDs
  if (!validId) {
    return (
      <div className="container mx-auto mt-12 px-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-12 max-w-2xl mx-auto text-center`}>
          <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Task Not Found</h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            The task with ID {id} doesn't exist in our system.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/tasks')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
            >
              ← Back to Tasks
            </button>
            <button
              onClick={() => navigate('/')}
              className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-8 py-4 rounded-lg text-xl font-semibold transition`}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  // Additional check: if task data is null or empty after fetch
  if (!task || !task.id) {
    return (
      <div className="container mx-auto mt-12 px-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-12 max-w-2xl mx-auto text-center`}>
          <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Task Not Found</h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            The task you're looking for doesn't exist.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/tasks')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
            >
              ← Back to Tasks
            </button>
            <button
              onClick={() => navigate('/')}
              className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-8 py-4 rounded-lg text-xl font-semibold transition`}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4 pb-12">
      <button
        onClick={() => navigate('/tasks')}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ← Back to Tasks
      </button>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-8 max-w-2xl mx-auto`}>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Task Details</h1>
          {taskStatus && (
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Completed
            </span>
          )}
          {!taskStatus && (
            <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ⏳ Pending
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
            <p className={`text-xl ${taskStatus ? 'line-through opacity-60' : ''}`}>{task?.title}</p>
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
            <div className="flex items-center gap-4">
              <p className={`text-xl font-semibold ${taskStatus ? 'text-green-500' : 'text-yellow-500'}`}>
                {taskStatus ? 'Completed' : 'In Progress'}
              </p>
              <button
                onClick={toggleTaskStatus}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  taskStatus
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {taskStatus ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
            </div>
          </div>

          <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg`}>
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
              💡 <strong>Note:</strong> Status changes are saved locally and will persist across page reloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;