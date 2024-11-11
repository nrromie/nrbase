import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import GoogleSignup from "../../components/GoogleSignup/GoogleSignup";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signin(email, password);
      toast.success("Successfully logged in");
      navigate("/");
    } catch (error) {
      setError("Invalid email or password");
      toast("Have you created an account?");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1b1b1e] to-[#282c34] text-[#d4d4dc]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#333842] rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block mb-2 text-sm text-[#a1a1aa]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full px-4 py-3 bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:outline-none focus:ring-2 focus:ring-[#4ecca3] transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm text-[#a1a1aa]">
              Password
            </label>
            <input
              type="password"
              value={password}
              name="password"
              placeholder="Enter your password"
              autoComplete="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:outline-none focus:ring-2 focus:ring-[#4ecca3] transition duration-300 ease-in-out"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 text-[#1b1b1e] bg-[#4ecca3] rounded hover:bg-[#3c997a] transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center justify-center my-4 text-[#a1a1aa]">
          <span className="mx-2">or</span>
        </div>

        <div>
          <GoogleSignup setError={setError} setLoading={setLoading} />
        </div>

        <p className="mt-4 text-sm text-center text-[#a1a1aa]">
          Don&apos;t have an account?{" "}
          <Link
            className="text-[#4ecca3] hover:text-[#3c997a] transition-all duration-300 ease-in-out"
            to="/SignUp"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
