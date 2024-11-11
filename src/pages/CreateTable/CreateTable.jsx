import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";

const CreateTable = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState({
    owner: user?.email,
    tableName: "",
    numRows: 1,
    fields: [{ name: "", type: "text" }],
  });

  const axiosSecure = useAxios();

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
      updatedFields[index].options
    ) {
      updatedFields[index] = {
        ...updatedFields[index],
        options: updatedFields[index].options
          .split(",")
          .map((option) => option.trim()),
      };
    }

    if (updatedFields[index].type === "calc" && updatedFields[index].formula) {
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

  const saveTable = () => {
    axiosSecure
      .post("/table", tableData)
      .then((response) => {
        toast.success("Table created successfully!");
        navigate("/tables");
      })
      .catch((error) => {
        toast.error("Failed to create table");
      });
  };

  const addField = () => {
    setTableData({
      ...tableData,
      fields: [...tableData.fields, { name: "", type: "text" }],
    });
  };

  const getNumberFields = () => {
    return tableData.fields
      .filter((field) => field.type === "number")
      .map((field) => field.name);
  };

  const renderConstraints = (fieldType, index) => {
    switch (fieldType) {
      case "text":
        return (
          <input
            type="number"
            name="maxLength"
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
            placeholder="Formula"
            className="p-2 mt-2 w-full bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:ring-2 focus:ring-[#4ecca3]"
            onChange={(e) => handleFieldChange(index, e)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#333842] text-[#d4d4dc] shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Create Table</h1>

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
              <option value="calc">Calculate</option>
            </select>

            <button
              type="button"
              onClick={() => deleteField(index)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
          {renderConstraints(field.type, index)}
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
          onClick={saveTable}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Save Table
        </button>
      </div>
    </div>
  );
};

export default CreateTable;
