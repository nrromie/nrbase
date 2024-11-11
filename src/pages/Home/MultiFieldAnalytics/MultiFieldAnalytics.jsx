import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
import CustomBarTwo from "../../../components/CustomBarTwo/CustomBarTwo";

const MultiFieldAnalytics = ({ analytic, refetchAnalytics }) => {
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

  function transformData(originalData) {
    const metrics = ["sum", "average", "max", "min"];
    const data = metrics.map((metric) => {
      const transformed = { name: metric };
      originalData.forEach((item) => {
        transformed[item.label] = parseFloat(item[metric]) || item[metric];
      });

      return transformed;
    });

    return data;
  }

  const formatedData = transformData(analytic?.data);

  const chartData = {
    fields: analytic?.fields,
    data: formatedData,
  };

  console.log(chartData);

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
          Fields: {analytic?.fields.map((field) => field.field).join(", ")}
        </h2>
        {analytic?.chartType === "bar" && <CustomBarTwo data={chartData} />}
      </div>

      <section className="bg-[#333842] rounded-b-lg p-4 text-gray-200 gap-4 shadow-lg">
        <div className="col-span-2 mb-4">
          <p className="w-full text-center text-2xl font-bold border-b-2 pb-2 border-[#4ecca3]">
            {analytic?.analyticsName}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left bg-[#282c34] text-white">
            <thead>
              <tr>
                {Object.keys(formatedData[0]).map((key) => (
                  <th key={key} className="p-4">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formatedData?.map((fieldData, index) => (
                <tr key={index} className="border-b border-[#444]">
                  {Object.keys(fieldData).map((key) => (
                    <td key={key} className="p-4">
                      {fieldData[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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

export default MultiFieldAnalytics;
