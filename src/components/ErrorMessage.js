const ErrorMessage = ({ message }) => (
  <div className="container mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
    <p className="font-semibold">Error: {message}</p>
  </div>
);

export default ErrorMessage;