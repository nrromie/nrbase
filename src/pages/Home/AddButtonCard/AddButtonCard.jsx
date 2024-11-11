import { Link } from "react-router-dom";

const AddButtonCard = () => {
  return (
    <div className="flex flex-col items-center space-y-8 text-center p-6 bg-gradient-to-b from-[#282c34] to-[#1b1b1e] rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h1 className="text-5xl font-extrabold text-[#d4d4dc] mb-4">
        Welcome to Your Data Hub
      </h1>
      <p className="text-lg text-[#a1a1aa] leading-relaxed">
        Unleash the power of your data with comprehensive analysis and
        visualization tools. Effortlessly manage, analyze, and visualize your
        data all in one place.
      </p>
      <div className="flex flex-col space-y-4">
        <Link
          to="/AddSingleFieldAnalytics"
          className="inline-block bg-[#4ecca3] hover:bg-[#3c997a] text-[#1b1b1e] font-semibold py-3 px-8 rounded-md shadow-lg transition-all duration-300 ease-in-out"
        >
          Add Single Field Analytics
        </Link>
        
        <Link
          to="/AddMultiFieldAnalytics"
          className="inline-block bg-[#4ecca3] hover:bg-[#3c997a] text-[#1b1b1e] font-semibold py-3 px-8 rounded-md shadow-lg transition-all duration-300 ease-in-out"
        >
          Add Multi-Field Analytics
        </Link>
      </div>
    </div>
  );
};

export default AddButtonCard;
