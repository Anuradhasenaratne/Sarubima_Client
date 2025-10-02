import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaXing,
  FaIdCard,
  FaPhone,
} from "react-icons/fa";
import axios from "axios";

export default function FarmerRegister() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    id: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await axios.post(
        import.meta.env.VITE_API_URL +"api/auth/farmers/register",
      {
        name: formData.name,
        email: formData.email,
        id: formData.id,
        address: formData.address,
        phone: formData.phone,
        password: formData.password,
      }
    );

    alert(res.data.message); // ✅ Show success message

    // Reset form
    setFormData({
      name: "",
      email: "",
      id: "",
      address: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setError(""); // clear any previous error
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Error registering farmer";
    setError(errorMsg);
    alert(errorMsg);
  }
};


  return (
    <div className="relative flex min-h-screen">
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center relative bg-green-100">
        <div className="absolute inset-0 flex items-center justify-center flex-col p-8">
          <h1 className="text-5xl font-bold text-black text-center px-4">
            Join with
            <hr className="border-0 my-2" />
            <span className="text-green-500">SARUBIMA </span>
            <span className="text-yellow-500">.LK</span>
            <span className="block mt-2 text-orange-500 text-lg font-medium">
              Create your account and start your journey
            </span>
          </h1>
          <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
            <svg
              className="w-10 h-10 text-green-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* SVG Divider */}
      <div className="absolute inset-y-0 left-1/0 -translate-x-1/1 hidden md:block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 1024"
          className="h-full"
          preserveAspectRatio="none"
        >
          <path d="M0 0L24 1024H0Z" fill="#ffffff" />
        </svg>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-start items-center w-full md:w-1/2 relative z-10">
        <div className="bg-transparent rounded-lg px-6 py-10 sm:w-3/4 lg:w-2/4">
          <h2 className="text-3xl font-bold text-green-500 text-center">
            Sign Up
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Create a new account to get started.
          </p>
          {/* Error Message */}
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="w-full mt-8" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <FaUser size={20} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <FaEnvelope size={20} className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            {/* NIC */}
            <div className="mb-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <FaIdCard size={20} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Enter your NIC"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <FaPhone size={20} className="text-gray-400 mr-2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your TP"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <FaUser size={20} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <FaLock size={20} className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <FaLock size={20} className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Google Register */}
          <div className="mt-6 w-full">
            <button
              type="button"
              className="flex items-center justify-center w-full py-2 bg-white border border-gray-300 rounded-lg shadow-md text-gray-700 hover:bg-gray-100 transition-all"
            >
              <FaGoogle className="text-green-500 mr-3 text-xl" />
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <div className="mt-2 text-gray-400 text-center">
            Already have an account?{" "}
            <a href="/Login" className="text-green-500 hover:underline">
              Log In
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center mt-8 space-x-6">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-600 text-2xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-700 text-2xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-2xl">
              <FaXing />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
