import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";

const AddSingleFieldAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [labelField, setLabelField] = useState("");
  const [chartType, setChartType] = useState("");
  const [analyticsName, setAnalyticsName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  useEffect(() => {
    axiosSecure
      .get(`/tablesfields?owner=${user?.email}`)
      .then((response) => {
        setTables(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching tables:", error));
  }, [user?.email]);

  const saveAnalytics = async () => {
    if (!selectedTableId || !selectedField) return;

    try {
      await axiosSecure.post("/analytics", {
        owner: user?.email,
        type: "single-field-analytics",
        tableId: selectedTableId,
        field: selectedField,
        labelField: labelField,
        chartType,
        analyticsName,
      });
      toast.success("Analytics added successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to add analytics");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[90svh] bg-gradient-to-r from-[#1b1b1e] to-[#282c34] flex flex-col items-center p-8 space-y-8">
      <h1 className="text-5xl font-extrabold text-[#d4d4dc] mb-4">
        Add Single Field Analytics
      </h1>
      <div className="max-w-4xl bg-[#333842] rounded-lg shadow-lg p-8 space-y-8 w-full">
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-[#a1a1aa]">Select Table</label>
          <select
            className="p-2 rounded bg-[#282c34] text-[#d4d4dc]"
            onChange={(e) => setSelectedTableId(e.target.value)}
          >
            <option value="">Choose a table</option>
            {tables.map((table) => (
              <option key={table._id} value={table._id}>
                {table.tableName}
              </option>
            ))}
          </select>
        </div>

        {selectedTableId && (
          <>
            <div className="flex flex-col space-y-4">
              <label className="text-lg text-[#a1a1aa]">Select Field</label>
              <select
                className="p-2 rounded bg-[#282c34] text-[#d4d4dc]"
                onChange={(e) => setSelectedField(e.target.value)}
                value={selectedField}
              >
                <option value="">Choose a field</option>
                {tables
                  .find((table) => table._id === selectedTableId)
                  ?.fields.filter((field) => field.type === "number" || field.type === "calc")
                  .map((field, index) => (
                    <option key={index} value={field.name}>
                      {field.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col space-y-4">
              <label className="text-lg text-[#a1a1aa]">
                Select Label Field
              </label>
              <select
                className="p-2 rounded bg-[#282c34] text-[#d4d4dc]"
                onChange={(e) => setLabelField(e.target.value)}
                value={labelField}
              >
                <option value="">Choose a field</option>
                {tables
                  .find((table) => table._id === selectedTableId)
                  ?.fields.map((field, index) => (
                    <option key={index} value={field.name}>
                      {field.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col space-y-4">
              <label className="text-lg text-[#a1a1aa]">
                Select Chart Type
              </label>
              <select
                className="p-2 rounded bg-[#282c34] text-[#d4d4dc]"
                onChange={(e) => setChartType(e.target.value)}
                value={chartType}
              >
                <option value="">Choose a chart type</option>
                {/* <option value="line">Line</option>
                <option value="area">Area</option>
                <option value="column">Column</option> */}
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
              </select>
            </div>

            <div className="flex flex-col space-y-4">
              <label className="text-lg text-[#a1a1aa]">
                Name of Analytics
              </label>
              <input
                type="text"
                placeholder="Enter name of analytics"
                className="p-2 rounded bg-[#282c34] text-[#d4d4dc]"
                value={analyticsName}
                onChange={(e) => setAnalyticsName(e.target.value)}
              />
            </div>

            {selectedField && labelField && chartType && analyticsName && (
              <button
                onClick={saveAnalytics}
                className="px-6 py-3 bg-[#4ecca3] text-[#1b1b1e] rounded-md shadow-lg hover:bg-[#3c997a] transition duration-300 ease-in-out"
              >
                Save
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddSingleFieldAnalytics;
