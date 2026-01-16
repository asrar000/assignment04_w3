import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const TaskList = () => {
  const { isDark } = useContext(ThemeContext);
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/todos?_limit=200');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const tasksPerPage = 20;

  // Load tasks and merge with localStorage status on mount
  useEffect(() => {
    if (data) {
      const savedStatuses = JSON.parse(localStorage.getItem('taskStatuses') || '{}');
      const updatedTasks = data.map(task => ({
        ...task,
        completed: savedStatuses[task.id] !== undefined ? savedStatuses[task.id] : task.completed
      }));
      setTasks(updatedTasks);
    }
  }, [data]);

  // Refresh tasks when returning from task details (to reflect status changes)
  useEffect(() => {
    const handleFocus = () => {
      if (data) {
        const savedStatuses = JSON.parse(localStorage.getItem('taskStatuses') || '{}');
        const updatedTasks = data.map(task => ({
          ...task,
          completed: savedStatuses[task.id] !== undefined ? savedStatuses[task.id] : task.completed
        }));
        setTasks(updatedTasks);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto mt-8 px-4 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Task List</h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Total: {filteredTasks.length} tasks
        </p>
      </div>
      
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
              task.completed ? 'border-green-500' : 'border-yellow-500'
            } block`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-2 ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Task ID: {task.id}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {task.completed && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Done
                  </span>
                )}
                {!task.completed && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No tasks found matching your search.</p>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              First
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Last
            </button>
          </div>
          
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Page {currentPage} of {totalPages} | Showing {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, filteredTasks.length)} of {filteredTasks.length} tasks
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskList;