import React, { useContext, useState } from "react";
import Papa from "papaparse";
import toast from "react-hot-toast";
import "tailwindcss/tailwind.css";
import { AuthContext } from "../../providers/AuthProvider";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

const ImportCSV = () => {
  const [tableName, setTableName] = useState("");
  const [numRows, setNumRows] = useState(0);
  const [fields, setFields] = useState([]);
  const [sheet, setSheet] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileNameWithoutExtension = file.name
      .split(".")
      .slice(0, -1)
      .join(".");
    setTableName(fileNameWithoutExtension);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = Papa.parse(event.target.result, {
        header: true,
        skipEmptyLines: true,
      });
      setNumRows(csvData.data.length);

      if (csvData.meta.fields) {
        const fieldsWithTypes = csvData.meta.fields.map((field) => ({
          name: field,
          type: csvData.data.every((row) => !isNaN(row[field]))
            ? "number"
            : "text",
        }));
        setFields(fieldsWithTypes);

        const sheetData = csvData.data.map((row) =>
          csvData.meta.fields.map((field) => row[field])
        );
        setSheet(sheetData);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    const tableData = {
      tableName,
      numRows,
      fields,
      owner: user?.email,
      sheet,
    };
    console.log(tableData);
    axiosSecure
      .post("/table", tableData)
      .then((response) => {
        console.log(response.data);
        toast.success("CSV data uploaded successfully!");
        navigate("/tables");
      })
      .catch((error) => {
        toast.error("Failed to upload CSV data");
        console.error("Error:", error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-lg shadow-xl text-gray-200">
      <h1 className="text-2xl font-bold mb-4">Import CSV</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        className="space-y-4"
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full p-2 bg-gray-700 rounded-lg"
        />
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Table Name"
          className="w-full p-2 bg-gray-700 rounded-lg mt-2"
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
        >
          Upload
        </button>
      </form>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm bg-gray-800 text-gray-200">
          <thead>
            <tr className="bg-gray-900">
              {fields.map((field, index) => (
                <th key={index} className="px-4 py-2 border border-gray-700">
                  {field.name} ({field.type})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-gray-700">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 border border-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImportCSV;
