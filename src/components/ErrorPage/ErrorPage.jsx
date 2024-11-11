import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="min-h-screen flex flex-col items-center justify-center bg-[#1b1b1e] text-[#d4d4dc] p-4"
    >
      <h1 className="text-4xl font-extrabold mb-4">Oops!</h1>
      <p className="text-lg mb-4">Sorry, an unexpected error has occurred.</p>
      <p className="text-sm text-[#a1a1aa] mb-6">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#4ecca3] text-[#1b1b1e] rounded-md shadow-lg hover:bg-[#3c997a] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4ecca3]"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
