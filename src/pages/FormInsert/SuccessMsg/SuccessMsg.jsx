import { Link } from "react-router-dom";

const SuccessMsg = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#282c34] rounded-lg shadow-lg max-w-md p-6 text-center">
        <h2 className="text-2xl font-bold text-[#d4d4dc] mb-4">Success</h2>
        <p className="text-[#a1a1aa] mb-6">Form submitted successfully!</p>
        <Link
          to="/"
          className="inline-block bg-[#4ecca3] hover:bg-[#3c997a] text-[#1b1b1e] font-semibold py-3 px-8 rounded-md shadow-lg transition-all duration-300 ease-in-out"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessMsg;
