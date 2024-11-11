import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
const Root = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      {user && (
        <div className="h-[10svh]">
          <Navbar />
        </div>
      )}

      <div className="min-h-[90svh] bg-gradient-to-r from-[#1b1b1e] to-[#282c34]">
        <Outlet></Outlet>
      </div>
      <Toaster />
    </div>
  );
};

export default Root;
