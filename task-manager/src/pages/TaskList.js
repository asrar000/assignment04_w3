import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const TaskList = () => {
  const { isDark } = useContext(ThemeContext);
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const filteredTasks = data?.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="container mx-auto mt-8 px-4 pb-12">
      <h1 className="text-4xl font-bold mb-6">Task List</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full px-4 py-3 rounded-lg border-2 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
          } focus:outline-none focus:border-blue-500`}
        />
      </div>

      <div className="grid gap-4">
        {currentTasks.map(task => (
          <Link
            key={task.id}
            to={`/tasks/${task.id}`}
            className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} 
              p-6 rounded-lg shadow-md transition border-l-4 ${
              task.completed ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Task ID: {task.id}
                </p>
              </div>
              {task.completed && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Done
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No tasks found matching your search.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          
          <span className={`px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;