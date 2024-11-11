import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SuccessMsg from "./SuccessMsg/SuccessMsg";

const FormInsert = () => {
  const axiosSecure = useAxios();
  const { _id } = useParams();
  const [formData, setFormData] = useState([]);
  const [errorMessage, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch table fields using react-query
  const {
    data: tablefields,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tablefields"],
    queryFn: () =>
      axiosSecure.get(`/tablefields?_id=${_id}`).then((res) => res.data),
  });

  // Initialize formData as an array based on tablefields
  useEffect(() => {
    if (tablefields) {
      const initialData = tablefields.fields.map((field) => {
        switch (field.type) {
          case "number":
            return 0;
          case "select":
            return "";
          default:
            return "";
        }
      });
      setFormData(initialData);
    }
  }, [tablefields]);

  // Handle input changes by updating formData by field index
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[index] = value;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData;
    console.log(data);
    try {
      await axiosSecure.post(`/insertform?_id=${_id}`, data);
      toast.success("Data inserted successfully!");
      setIsOpen(true);
    } catch (error) {
      if (error?.status === 409) {
        setError(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Failed to insert data");
      }
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading table fields.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#333842] text-[#d4d4dc] shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Insert Data for {tablefields.tableName}
      </h2>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        {tablefields.fields.map((field, index) => {
          switch (field.type) {
            case "text":
              return (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm text-[#a1a1aa] mb-2">
                    {field.name}:
                  </label>
                  <input
                    type="text"
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    maxLength={field.maxLength}
                    className="w-full p-3 bg-[#2e2e38] border border-[#4b4b57] rounded text-[#d4d4dc] focus:ring-2 focus:ring-[#4ecca3]"
                  />
                </div>
              );
            case "number":
              return (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm text-[#a1a1aa] mb-2">
                    {field.name}:
                  </label>
                  <input
                    type="number"
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-3 bg-[#2e2e38] border border-[#4b4b57] rounded text-[#d4d4dc] focus:ring-2 focus:ring-[#4ecca3]"
                  />
                </div>
              );
            case "select":
              return (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm text-[#a1a1aa] mb-2">
                    {field.name}:
                  </label>
                  <select
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-3 bg-[#2e2e38] border border-[#4b4b57] rounded text-[#d4d4dc] focus:ring-2 focus:ring-[#4ecca3]"
                  >
                    <option value="">Select an option</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case "calc":
              return null;
            default:
              return (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm text-[#a1a1aa] mb-2">
                    {field.name}:
                  </label>
                  <input
                    type={field.type}
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full p-3 bg-[#2e2e38] border border-[#4b4b57] rounded text-[#d4d4dc] focus:ring-2 focus:ring-[#4ecca3]"
                  />
                </div>
              );
          }
        })}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
      <SuccessMsg isOpen={isOpen} />
    </div>
  );
};

export default FormInsert;
