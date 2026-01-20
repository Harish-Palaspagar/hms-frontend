import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 font-body">
      <div className="text-center px-6">
        <h1 className="text-[120px] font-heading font-bold text-primary-600 leading-none">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-neutral-800">
          Page Not Found
        </h2>

        <p className="mt-2 text-neutral-500 max-w-md mx-auto">
          The page you are trying to access does not exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-5 inline-flex items-center justify-center rounded-md
             bg-primary-600 px-4 py-2 text-xs font-medium text-white
             hover:bg-primary-700 transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
