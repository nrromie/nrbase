import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import useAxios from "../hooks/useAxios";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchTable = async (axiosSecure, _id) => {
  const response = await axiosSecure.get(`/edit-table?_id=${_id}`);
  return response.data;
};

const saveTable = async (axiosSecure, _id, tableData) => {
  const response = await axiosSecure.put(`/edit-table?_id=${_id}`, tableData);
  return response.data;
};

const EditTable = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { _id } = useParams();
  const [tableData, setTableData] = useState({
    owner: user?.email,
    tableName: "",
    numRows: 1,
    fields: [{ name: "", type: "text" }],
  });
  const axiosSecure = useAxios();

  const { data, isLoading, error } = useQuery({
    queryKey: ["edit-table", _id],
    queryFn: () => fetchTable(axiosSecure, _id),
    enabled: !!_id,
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (tableData) => saveTable(axiosSecure, _id, tableData),
    onSuccess: () => {
      toast.success("Table updated successfully");
      navigate("/tables");
    },
    onError: () => {
      toast.error("Failed to update table");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData({ ...tableData, [name]: value });
  };

  const handleFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFields = [...tableData.fields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };

    if (
      updatedFields[index].type === "select" &&
      updatedFields[index].options && !Array.isArray(updatedFields[index].options)
    ) {
      updatedFields[index] = {
        ...updatedFields[index],
        options: updatedFields[index].options
          .split(",")
          .map((option) => option.trim()),
      };
    }

    if (updatedFields[index].type === "calc" && updatedFields[index].formula && !Array.isArray(updatedFields[index].formula)) {
      const formulaArray = updatedFields[index].formula
        .split(/([\+\-\*\/\(\)])/)
        .filter(Boolean);
      updatedFields[index] = {
        ...updatedFields[index],
        formula: formulaArray,
      };
    }
    setTableData({ ...tableData, fields: updatedFields });
  };

  const deleteField = (index) => {
    const updatedFields = tableData.fields.filter((_, i) => i !== index);
    setTableData({ ...tableData, fields: updatedFields });
  };

  const addField = () => {
    setTableData({
      ...tableData,
      fields: [...tableData.fields, { name: "", type: "text" }],
    });
  };

  const handleSaveTable = () => {
    mutation.mutate(tableData);
  };

  const renderConstraints = (fieldType, options, formula, maxLength, index) => {
    switch (fieldType) {
      case "text":
        return (
          <input
            type="number"
            name="maxLength"
            defaultValue={maxLength || undefined}
            placeholder="Max length"
            className="p-2 mt-2 w-full bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:ring-2 focus:ring-[#4ecca3]"
            onChange={(e) => handleFieldChange(index, e)}
          />
        );
      case "select":
        return (
          <input
            type="text"
            name="options"
            defaultValue={options || undefined}
            placeholder="Options (comma separated)"
            className="p-2 mt-2 w-full bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:ring-2 focus:ring-[#4ecca3]"
            onChange={(e) => handleFieldChange(index, e)}
          />
        );
      case "calc":
        return (
          <input
            type="text"
            name="formula"
            defaultValue={formula || undefined}
            placeholder="Formula"
            className="p-2 mt-2 w-full bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:ring-2 focus:ring-[#4ecca3]"
            onChange={(e) => handleFieldChange(index, e)}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error fetching table data</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#333842] text-[#d4d4dc] shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Edit Table</h1>

      <div className="mb-4">
        <label className="block text-sm text-[#a1a1aa] mb-2">Table Name</label>
        <input
          type="text"
          name="tableName"
          value={tableData.tableName}
          onChange={handleInputChange}
          placeholder="Enter table name"
          className="w-full p-3 bg-[#2e2e38] border border-[#4b4b57] rounded text-[#d4d4dc] focus:ring-2 focus:ring-[#4ecca3]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-[#a1a1aa] mb-2">
          Number of Rows
        </label>
        <input
          type="number"
          name="numRows"
          value={tableData.numRows}
          onChange={handleInputChange}
          placeholder="Enter number of rows"
          className="w-full p-3 bg-[#2e2e38] border border-[#4b4b57] rounded text-[#d4d4dc] focus:ring-2 focus:ring-[#4ecca3]"
        />
      </div>

      {tableData.fields.map((field, index) => (
        <div
          key={index}
          className="mb-4 p-4 bg-[#2e2e38] border border-[#4b4b57] rounded-lg"
        >
          <div className="flex items-center gap-4 mb-2">
            <input
              type="text"
              name="name"
              value={field.name}
              onChange={(e) => handleFieldChange(index, e)}
              placeholder="Field Name"
              className="w-full p-2 bg-[#333842] text-[#d4d4dc] border border-[#4b4b57] rounded focus:ring-2 focus:ring-[#4ecca3]"
            />
            <select
              name="type"
              value={field.type}
              onChange={(e) => handleFieldChange(index, e)}
              className="p-2 bg-[#333842] text-[#d4d4dc] border border-[#4b4b57] rounded focus:ring-2 focus:ring-[#4ecca3]"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Boolean</option>
              <option value="email">Email</option>
              <option value="select">Select</option>
              <option value="calc">Calculation</option>
            </select>
            <button
              type="button"
              onClick={() => deleteField(index)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
          {renderConstraints(
            field.type,
            field.options,
            field.formula,
            field.maxLength,
            index
          )}
        </div>
      ))}

      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={addField}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add Field
        </button>
        <button
          onClick={handleSaveTable}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Save Table
        </button>
      </div>
    </div>
  );
};

export default EditTable;
