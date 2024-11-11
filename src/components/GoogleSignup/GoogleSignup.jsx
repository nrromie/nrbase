import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const GoogleSignup = ({ setError, setLoading }) => {
  const { googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={handleGoogleSignIn}
        aria-label="Log in with Google"
        className="p-3 rounded-sm text-2xl"
      >
        <FcGoogle />
      </button>
    </div>
  );
};

export default GoogleSignup;
