import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Loading from "../../components/Loading";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const fetchTables = async (axiosSecure, email) => {
  const response = await axiosSecure.get(`/tables?owner=${email}`);
  return response.data;
};

const Tables = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

  const {
    data: tables,
    isLoading: tablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useQuery({
    queryKey: ["tables", user?.email],
    queryFn: () => fetchTables(axiosSecure, user?.email),
    enabled: !!user?.email,
  });

  const openModal = (id) => {
    setTableToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTableToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await axiosSecure.delete(`/table?_id=${tableToDelete}`);
      toast.success("Table deleted successfully");
      refetchTables();
      closeModal();
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Failed to delete table");
    }
  };

  if (tablesLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[90svh] p-8 bg-gradient-to-r from-[#1b1b1e] to-[#282c34] text-[#d4d4dc]">
      <div className="max-w-4xl mx-auto bg-[#282c34] shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-[#d4d4dc] mb-8">Tables</h1>
        <div className="my-10">
          {tables?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className="grid grid-cols-6 gap-0 rounded-lg shadow-lg overflow-hidden"
                >
                  <Link
                    to={`/TableView/${table._id}`}
                    className="col-span-4 bg-gradient-to-r from-[#2e2e38] via-[#3c3c47] to-[#4b4b57] hover:bg-gradient-to-r hover:from-[#3c3c47] hover:via-[#4b4b57] hover:to-[#2e2e38] text-[#d4d4dc] text-lg px-4 py-4 font-semibold transition-all duration-300 ease-in-out"
                  >
                    {table.tableName}
                  </Link>
                  <Link
                    to={`/EditTable/${table._id}`}
                    className="flex items-center justify-center col-span-1 bg-[#4ecca3] hover:bg-[#3c997a] text-[#1b1b1e] text-3xl transition-all duration-300 ease-in-out"
                  >
                    <RiEdit2Fill />
                  </Link>

                  <button
                    type="button"
                    onClick={() => openModal(table._id)}
                    className="flex items-center justify-center col-span-1 bg-[#e57373] hover:bg-[#d32f2f] text-[#1b1b1e] text-3xl transition-all duration-300 ease-in-out"
                  >
                    <RiDeleteBin2Fill />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#a1a1aa] text-lg">No table data available</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <div className="mt-10 flex justify-end">
            <Link
              to="/CreateTable"
              className="inline-block bg-[#4ecca3] hover:bg-[#3c997a] text-[#1b1b1e] text-lg font-medium py-3 px-6 rounded-md shadow-md transition-all duration-300 ease-in-out"
            >
              Create Table
            </Link>
          </div>
          <div className="mt-10 flex justify-end">
            <Link
              to="/ImportCSV"
              className="inline-block bg-[#4ecca3] hover:bg-[#3c997a] text-[#1b1b1e] text-lg font-medium py-3 px-6 rounded-md shadow-md transition-all duration-300 ease-in-out"
            >
              Import From CSV
            </Link>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Tables;
