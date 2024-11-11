import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cell from "./Cell/Cell";
import Loading from "../../components/Loading";
import "tailwindcss/tailwind.css";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Row from "./Row/Row";

const fetchTable = async (axiosSecure, _id) => {
  const response = await axiosSecure.get(`/table?_id=${_id}`);
  return response.data;
};

const saveTable = async (axiosSecure, _id, tableData) => {
  const response = await axiosSecure.put(`/table?_id=${_id}`, tableData);
  return response.data;
};

const TableView = () => {
  const { _id } = useParams();
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState([]);
  const [numRows, setNumRows] = useState(0);
  const [selectedCell, setSelectedCell] = useState({
    row: null,
    field: null,
    value: "",
  });

  const axiosSecure = useAxios();

  const { data, isLoading, error } = useQuery({
    queryKey: ["table", _id],
    queryFn: () => fetchTable(axiosSecure, _id),
    enabled: !!_id,
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
      setSheet(data.sheet || []);
      setNumRows(data.numRows);
      setLoading(false);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (updatedTableData) =>
      saveTable(axiosSecure, _id, updatedTableData),
    onSuccess: () => {
      toast.success("Changes saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save changes");
    },
    onMutate: () => {
      toast.loading("Saving changes...", { id: "save-loading" });
    },

    onSettled: () => {
      toast.dismiss("save-loading");
    },
  });

  const handleInputChange = (rowIndex, fieldIndex, value) => {
    setSheet((prevSheet) => {
      const newSheet = [...prevSheet];
      newSheet[rowIndex] = newSheet[rowIndex] || [];
      newSheet[rowIndex][fieldIndex] = value;
      return newSheet;
    });

    if (selectedCell.row === rowIndex && selectedCell.field === fieldIndex) {
      setSelectedCell((prev) => ({ ...prev, value }));
    }
  };

  const handleCellClick = (rowIndex, fieldIndex, value) => {
    setSelectedCell({ row: rowIndex, field: fieldIndex, value });
  };

  if (loading || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSaveChanges = () => {
    mutation.mutate({ ...tableData, sheet });
  };

  return (
    <div className="w-full p-3 bg-[#282c34] text-[#d4d4dc]">
      <div className="sticky top-[10svh] bg-[#282c34] py-2 border-b border-[#4b4b57] shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl mr-2 font-semibold">{tableData.tableName}</h2>
          <div className="flex items-center space-x-2">
            {selectedCell.value && (
              <div className="border px-3 py-1 rounded max-w-max text-gray-300 bg-[#333842]">
                {selectedCell.value}
              </div>
            )}
            <Link
              to={`/FormInsert/${_id}`}
              className="px-3 py-2 bg-[#4ecca3] text-[#1b1b1e] rounded-md shadow-lg hover:bg-[#3c997a] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4ecca3]"
            >
              Form Insert
            </Link>
            <button
              onClick={handleSaveChanges}
              className="px-3 py-2 bg-[#4ecca3] text-[#1b1b1e] rounded-md shadow-lg hover:bg-[#3c997a] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4ecca3]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="rounded-t-lg bg-[#333842]">
            <tr className="text-left">
              <th title="Ranking" className="p-3 border border-[#4b4b57]">
                #
              </th>
              {tableData?.fields?.map((field, index) => (
                <th
                  key={index}
                  title={field.name}
                  className="p-3 border min-w-20 border-[#4b4b57]"
                >
                  {field.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <Row
                key={rowIndex}
                handleCellClick={handleCellClick}
                handleInputChange={handleInputChange}
                rowIndex={rowIndex}
                tableData={tableData}
                selectedCell={selectedCell}
                sheet={sheet}
                setSelectedCell={setSelectedCell}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
