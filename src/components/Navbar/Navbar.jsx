import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogOut = async () => {
    try {
      await logOut();
      alert("You have logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const navlinksStyle = ({ isActive }) =>
    isActive
      ? "block text-[#4ecca3] hover:text-[#4ecca3] transition duration-200"
      : "block text-[#d4d4dc] hover:text-[#4ecca3] transition duration-200";

  return (
    <nav className="bg-[#1b1b1e] shadow-md fixed w-full h-[10svh] top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-semibold text-[#4ecca3]">
          NrBase
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="/" className={navlinksStyle}>
            Home
          </NavLink>
          <NavLink to="/tables" className={navlinksStyle}>
            Tables
          </NavLink>
          <NavLink to="/CreateTable" className={navlinksStyle}>
            Create Table
          </NavLink>
          {user ? (
            <>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-10 h-10 rounded-full"
                  alt="User"
                />
              ) : (
                <span className="text-[#a1a1aa]">{user.email}</span>
              )}
              <button
                onClick={handleLogOut}
                className="px-4 py-2 bg-[#4ecca3] text-[#1b1b1e] rounded hover:bg-[#3c997a] transition duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-[#4ecca3] text-[#1b1b1e] rounded hover:bg-[#3c997a] transition duration-200"
            >
              Log In
            </Link>
          )}
        </div>

        <div className="flex gap-4 md:hidden">
          {user.photoURL && (
            <img
              src={user.photoURL}
              className="md:hidden w-10 h-10 rounded-full"
              alt="User"
            />
          )}

          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none text-[#d4d4dc]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#282c34] shadow-md">
          <div className="px-4 py-2 space-y-2">
            <NavLink to="/" onClick={toggleMenu} className={navlinksStyle}>
              Home
            </NavLink>
            <NavLink
              to="/tables"
              onClick={toggleMenu}
              className={navlinksStyle}
            >
              Tables
            </NavLink>
            <NavLink
              to="/CreateTable"
              onClick={toggleMenu}
              className={navlinksStyle}
            >
              Create Table
            </NavLink>
            {user ? (
              <>
                <span className="text-[#a1a1aa]">{user.email}</span>
                <button
                  onClick={() => {
                    handleLogOut();
                    toggleMenu();
                  }}
                  className="block text-[#d4d4dc] hover:text-[#4ecca3] transition duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block text-[#d4d4dc] hover:text-[#4ecca3] transition duration-200"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
