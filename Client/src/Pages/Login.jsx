import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaGoogle, FaHome } from "react-icons/fa";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setUser } = useAppContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonPulsing, setIsButtonPulsing] = useState(true);
  const navigate = useNavigate();

  // Stop the pulsing animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonPulsing(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Save user info + token
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      // Update context
      if (res.data.role === "Farmer") {
        setUser(true);
      } else {
        setUser(res.data);
      }

      alert(`Welcome ${res.data.name}`);

      // Redirect by role
      if (res.data.role === "Admin") navigate("/AdminPanel");
      else if (res.data.role === "Lab") navigate("/LabDashboard");
      else if (res.data.role === "Agent" ) navigate("/AgentDashboard");
      else if (res.data.role === "Farmer") navigate("/");

      setFormData({ email: "", password: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error logging in";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side */}
      <div className="hidden md:flex w-1/2 bg-green-100 items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-5xl font-bold text-black">
            Welcome back to <br />
            <span className="text-green-600">SARUBIMA</span>
            <span className="text-yellow-500">.LK</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Log in and continue your journey 🌱
          </p>
          
          {/* Animated Home Button */}
          <div className="mt-8">
            <Link to="/">
              <button 
                className={`relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 shadow-sm hover:bg-green-700 transition-all duration-300 ease-in-out transform ${isButtonPulsing ? 'animate-pulse' : ''} ${isButtonHovered ? 'scale-105 -translate-y-1' : ''}`}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                {/* Home icon */}
                <FaHome className={`w-5 h-5 mr-2 transition-transform duration-300 ${isButtonHovered ? 'rotate-12' : ''}`} />
                
                Go Home
                
                {/* Animated circles on hover */}
                {isButtonHovered && (
                  <>
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-green-200 animate-ping opacity-75"></span>
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-green-300"></span>
                  </>
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-600 text-center">
            Log In
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Enter your credentials to access your account
          </p>

          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          {/* Login form */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <FaEnvelope size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <FaLock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Google login */}
          <button
            type="button"
            className="mt-6 w-full flex items-center justify-center py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-green-500 mr-2" />
            Log in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Register link */}
          <p className="text-gray-500 text-center">
            Don't have an account?{" "}
            <Link to="/Register"
             onClick={() => window.scrollTo(0, 0)} 
             className="text-green-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}