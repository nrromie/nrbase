import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";

const AddMultifieldAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
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

  const handleTableSelection = (tableId) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter((id) => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  const handleFieldSelection = (field, tableId) => {
    const fieldKey = `${tableId}_${field.name}`;
    if (selectedFields.includes(fieldKey)) {
      setSelectedFields(selectedFields.filter((item) => item !== fieldKey));
    } else {
      setSelectedFields([...selectedFields, fieldKey]);
    }
  };

  const saveAnalytics = async () => {
    if (selectedFields.length === 0 || !chartType || !analyticsName) return;

    try {
      await axiosSecure.post("/analytics", {
        owner: user?.email,
        type: "multifield",
        fields: selectedFields.map((fieldKey) => {
          const [tableId, fieldName] = fieldKey.split("_");
          return { tableId, field: fieldName };
        }),
        chartType,
        analyticsName,
      });
      toast.success("Analytics added successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to add analytics");
    }

    console.log({
      owner: user?.email,
      type: "multifield",
      fields: selectedFields.map((fieldKey) => {
        const [tableId, fieldName] = fieldKey.split("_");
        return { tableId, field: fieldName };
      }),
      chartType,
      analyticsName,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[90svh] bg-gradient-to-r from-[#1b1b1e] to-[#282c34] flex flex-col items-center p-8 space-y-8">
      <h1 className="text-5xl font-extrabold text-[#d4d4dc] mb-4">
        Add Multifield Analytics
      </h1>
      <div className="max-w-4xl bg-[#333842] rounded-lg shadow-lg p-8 space-y-8 w-full">
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-[#a1a1aa]">Select Tables</label>
          <div className="space-y-2">
            {tables.map((table) => (
              <div key={table._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={table._id}
                  onChange={() => handleTableSelection(table._id)}
                  checked={selectedTables.includes(table._id)}
                />
                <label className="text-[#d4d4dc]">{table.tableName}</label>
              </div>
            ))}
          </div>
        </div>

        {selectedTables.length > 0 &&
          selectedTables.map((tableId) => {
            const table = tables.find((table) => table._id === tableId);
            return (
              <div key={tableId} className="flex flex-col space-y-4">
                <label className="text-lg text-[#a1a1aa]">
                  Select Fields for {table.tableName}
                </label>
                <div className="space-y-2">
                  {table.fields
                    .filter(
                      (field) =>
                        field.type === "number" || field.type === "calc"
                    )
                    .map((field) => (
                      <div
                        key={field.name}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          value={field.name}
                          onChange={() => handleFieldSelection(field, tableId)}
                          checked={selectedFields.includes(
                            `${tableId}_${field.name}`
                          )}
                        />
                        <label className="text-[#d4d4dc]">{field.name}</label>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}

        <div className="flex flex-col space-y-4">
          <label className="text-lg text-[#a1a1aa]">Select Chart Type</label>
          <select
            className="p-2 rounded bg-[#282c34] text-[#d4d4dc]"
            onChange={(e) => setChartType(e.target.value)}
            value={chartType}
          >
            <option value="">Choose a chart type</option>
            <option value="bar">Bar</option>
          </select>
        </div>

        <div className="flex flex-col space-y-4">
          <label className="text-lg text-[#a1a1aa]">Name of Analytics</label>
          <input
            type="text"
            placeholder="Enter name of analytics"
            className="p-2 rounded bg-[#282c34] text-[#d4d4dc]"
            value={analyticsName}
            onChange={(e) => setAnalyticsName(e.target.value)}
          />
        </div>

        {selectedFields.length > 0 && chartType && analyticsName && (
          <button
            onClick={saveAnalytics}
            className="px-6 py-3 bg-[#4ecca3] text-[#1b1b1e] rounded-md shadow-lg hover:bg-[#3c997a] transition duration-300 ease-in-out"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default AddMultifieldAnalytics;
