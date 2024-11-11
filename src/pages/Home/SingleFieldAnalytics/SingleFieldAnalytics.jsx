import React, { useState } from "react";
import CustomPieChart from "../../../components/CustomPieChart/CustomPieChart";
import CustomBarChart from "../../../components/CustomBarChart/CustomBarChart";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const SingleFieldAnalytics = ({ analytic, refetchAnalytics }) => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxios();

  const onConfirm = () => {
    setIsOpen(false);
    axiosSecure
      .delete(`/analytics?_id=${analytic?._id}`)
      .then((res) => {
        toast.success("Analytics deleted successfully!");
        refetchAnalytics();
      })
      .catch((err) => {
        toast.error("Failed to delete analytics");
      });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const chartData = {
    data: analytic?.data,
    field: analytic?.field,
  };

  return (
    <div className="relative max-w-4xl mb-4 bg-gray-800 rounded-lg shadow-xl p-4 mx-auto border border-[#15523e]">
      <h1 className="text-3xl font-bold text-green-400">
        {analytic?.analyticsName}
      </h1>

      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 text-[#a1a1aa] text-xl hover:text-red-500 transition duration-300 ease-in-out"
      >
        <FaTrash className="text-lg" />
      </button>

      <div className="bg-[#2e2e38] rounded-t-lg text-gray-200">
        <h2 className="font text-gray-400 m-2">
          Table: {analytic?.tableName} | Field: {analytic?.field}
        </h2>
        {analytic?.chartType === "pie" && (
          <CustomPieChart chartData={chartData} />
        )}
        {analytic?.chartType === "bar" && (
          <CustomBarChart chartData={chartData} />
        )}
      </div>

      <section className="bg-[#333842] rounded-b-lg p-4 text-gray-200 grid grid-cols-2 gap-4 shadow-lg">
        <div className="col-span-2 mb-4">
          <p className="w-full text-center text-2xl font-bold border-b-2 pb-2 border-[#4ecca3]">
            {analytic?.analyticsName} ({analytic?.count})
          </p>
        </div>
        <div className="bg-[#282c34] p-4 rounded-md shadow-md">
          <p className="font-semibold">Sum</p>
          <p className="text-xl">{analytic?.sum}</p>
        </div>
        <div className="bg-[#282c34] p-4 rounded-md shadow-md">
          <p className="font-semibold">Average</p>
          <p className="text-xl">{analytic?.average}</p>
        </div>
        <div className="bg-[#282c34] p-4 rounded-md shadow-md">
          <p className="font-semibold">Max</p>
          <p className="text-xl">{analytic?.max}</p>
        </div>
        <div className="bg-[#282c34] p-4 rounded-md shadow-md">
          <p className="font-semibold">Min</p>
          <p className="text-xl">{analytic?.min}</p>
        </div>
      </section>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default SingleFieldAnalytics;
