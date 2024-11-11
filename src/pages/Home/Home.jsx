import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import AddButtonCard from "./AddButtonCard/AddButtonCard";
import Loading from "../../components/Loading";
import SingleFieldAnalytics from "./SingleFieldAnalytics/SingleFieldAnalytics";
import MultiFieldAnalytics from "./MultiFieldAnalytics/MultiFieldAnalytics";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const fetchTables = async (axiosSecure, email) => {
  const response = await axiosSecure.get(`/tables?owner=${email}`);
  return response.data;
};

const fetchAnalytics = async (axiosSecure, email) => {
  const response = await axiosSecure.get(`/analytics?owner=${email}`);
  return response.data;
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxios();

  const {
    data: tables,
    isLoading: tablesLoading,
    error: tablesError,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: () => fetchTables(axiosSecure, user?.email),
    enabled: !!user?.email,
  });

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetchAnalytics(axiosSecure, user?.email),
    enabled: !!user?.email,
  });

  if (analyticsLoading || tablesLoading) {
    return <Loading />;
  }

  if (analyticsError || tablesError) {
    return <div className="text-red-400">No internet connection</div>;
  }

  return (
    <div className="min-h-[90svh] bg-gradient-to-r from-[#1b1b1e] to-[#282c34] p-4 space-y-8">
      {analytics.length > 0 &&
        analytics.map((analytic) =>
          analytic?.type === "single-field-analytics" ? (
            <SingleFieldAnalytics
              key={analytic?._id}
              analytic={analytic}
              refetchAnalytics={refetchAnalytics}
            />
          ) : analytic?.type === "multifield" ? (
            <MultiFieldAnalytics
              key={analytic?._id}
              analytic={analytic}
              refetchAnalytics={refetchAnalytics}
            />
          ) : null
        )}

      {tables.length > 0 ? (
        <AddButtonCard />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[90svh] p-8">
          <div className="max-w-4xl bg-[#282c34] rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-5xl font-extrabold text-[#d4d4dc] mb-4">
              Welcome to the Dashboard
            </h1>
            <p className="text-lg text-[#a1a1aa]">
              Explore your tables, manage data, and get insights.
            </p>
            <Link
              to="/CreateTable"
              className="mt-6 inline-block bg-[#4ecca3] hover:bg-[#3c997a] text-[#1b1b1e] font-semibold py-3 px-8 rounded-md shadow-lg transition-all duration-300 ease-in-out"
            >
              Create your first table
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
