import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import GoogleSignup from "../../components/GoogleSignup/GoogleSignup";
import { updateProfile } from "firebase/auth";
import axios from "axios";

const image_hosting_key = import.meta.env.VITE_IMG_HOST_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Signup = () => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    let photoUrl = ""; // store uploaded photo URL if exists

    // Upload photo if one is selected
    if (photo) {
      const formData = new FormData();
      formData.append("image", photo);
      console.log(image_hosting_api);

      try {
        const res = await axios.post(image_hosting_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data.success) {
          photoUrl = res.data.data.display_url;
        }
      } catch (uploadError) {
        setError("Failed to upload photo. Please try again.");
        setLoading(false);
        return;
      }
    }

    try {
      // Create user with email and password
      const result = await createUser(email, password);
      const user = result.user;

      // Update profile with display name and photo URL
      await updateProfile(user, {
        displayName: name,
        photoURL: photoUrl,
      });

      // Redirect after signup
      navigate("/");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1b1b1e] to-[#282c34] text-[#d4d4dc]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#333842] rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center">Sign Up</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <label className="block mb-2 text-sm text-[#a1a1aa]">Photo</label>
            <input
              type="file"
              name="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full px-4 py-3 bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:outline-none focus:ring-2 focus:ring-[#4ecca3] transition duration-300 ease-in-out"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm text-[#a1a1aa]">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:outline-none focus:ring-2 focus:ring-[#4ecca3] transition duration-300 ease-in-out"
              required
            />
          </div>
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
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              minLength={6}
              className="w-full px-4 py-3 bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:outline-none focus:ring-2 focus:ring-[#4ecca3] transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm text-[#a1a1aa]">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength={6}
              className="w-full px-4 py-3 bg-[#2e2e38] text-[#d4d4dc] border border-[#4b4b57] rounded focus:outline-none focus:ring-2 focus:ring-[#4ecca3] transition duration-300 ease-in-out"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 text-[#1b1b1e] bg-[#4ecca3] rounded hover:bg-[#3c997a] transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center justify-center my-4 text-[#a1a1aa]">
          <span className="mx-2">or</span>
        </div>

        <div>
          <GoogleSignup setError={setError} setLoading={setLoading} />
        </div>

        <p className="mt-4 text-sm text-center text-[#a1a1aa]">
          Already have an account?{" "}
          <Link
            className="text-[#4ecca3] hover:text-[#3c997a] transition-all duration-300 ease-in-out"
            to="/login"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
