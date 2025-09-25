import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaShoppingCart, FaClipboardList, FaSignOutAlt, FaFileAlt, FaBell, FaHome } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user: contextUser, setUser, setShowUserLogin } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  

  // Get user data from localStorage if context doesn't have it
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const token = localStorage.getItem("token");

    if (userInfo && token) {
      setUserData(JSON.parse(userInfo));
    } else if (contextUser) {
      setUserData(contextUser);
    } else {
      setUserData(null);
    }
  }, [contextUser]);

  // Enhanced logout function
  const handleLogout = () => {
    // Clear all user-related data
    setUser(null);
    setUserData(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setProfileOpen(false);
    setShowLogoutConfirm(false);
    
    // Force a hard navigation to home to ensure clean state
    window.location.href = "/";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all bg-opacity-90 shadow-md">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2">
        <img src={assets.logo} alt="ShopEase Logo" className="h-9 w-9 object-contain" />
        <h1 className="text-2xl font-bold text-yellow-400">SARUBIMA</h1>
        <h1 className="text-2xl font-bold text-green-600">.LK</h1>
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-6 text-green-500">
        
        <NavLink 
          to="/" 
          className="relative flex items-center gap-2 py-1 font-semibold text-green-600 transition-all hover:text-yellow-300"
        >
          <FaHome className="text-lg" /> 
        </NavLink>
        
        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-green-500"
            type="text"
            placeholder="Search products"
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.920 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* User Info and Notifications */}
        {userData && (
          <div className="flex items-center gap-4">
            <div 
              onClick={() => navigate("/Notifications")} 
              className="relative cursor-pointer"
            >
              <FaBell className="text-xl text-green-600 hover:text-yellow-400 transition-colors" />
              <span className="absolute -top-2 -right-2 text-xs text-white bg-red-500 w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </div>
            
            <div className="relative inline-block" ref={menuRef}>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span className="text-green-600 font-semibold">
                  Hello, {userData.name.split(" ")[0] || userData.username}
                </span>
                <img
                  className="w-10 h-10 rounded-full border-2 border-white transition-transform hover:scale-105"
                  src={assets.profilePic}
                  alt="Profile"
                />
              </div>
              
              {profileOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 text-sm border border-gray-200">
                  <li
                    className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => { navigate("/Profile"); setProfileOpen(false); }}
                  >
                    <FaFileAlt className="text-green-600" /> Profile
                  </li>
                  <li
                    className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => { navigate("/FarmerDashboard"); setProfileOpen(false); }}
                  >
                    <FaClipboardList className="text-green-600" /> Farmer Dashboard
                  </li>
                  <li className="border-t border-gray-100 my-1"></li>
                  <li
                    className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 cursor-pointer text-red-600 transition-colors"
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    <FaSignOutAlt /> Log out
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
        
        {/* Login Button */}
        {!userData && (
          <div></div>
          // <button
          //   className="cursor-pointer px-6 py-2 bg-yellow-400 hover:bg-yellow-500 transition-colors text-white rounded-full font-medium"
          //   onClick={() => {
          //     setShowUserLogin(true);
          //     navigate("/Login");
          //   }}
          // >
          //   Login
          // </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setOpen(!open)} 
        aria-label="Menu" 
        className="sm:hidden text-green-600"
      >
        {open ? (
          <span className="text-2xl">✕</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <div className={`${open ? "flex" : "hidden"} absolute top-full left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-3 px-5 text-sm md:hidden`}>
        <NavLink to="/" className="block w-full py-2 border-b border-gray-100">Home</NavLink>
        <NavLink to="/Adminpanle" className="block w-full py-2 border-b border-gray-100">Admin Panel</NavLink>
        <NavLink to="/AgentDashboard" className="block w-full py-2 border-b border-gray-100">Agent Dashboard</NavLink>
        <NavLink to="/LabDashboard" className="block w-full py-2 border-b border-gray-100">Lab Dashboard</NavLink>
        
        {userData ? (
          <>
            <div className="w-full py-2 border-b border-gray-100">
              <span className="font-semibold text-green-600">Hello, {userData.name || userData.username}</span>
            </div>
            <NavLink to="/Profile" className="block w-full py-2 border-b border-gray-100">Profile</NavLink>
            <NavLink to="/FarmerDashboard" className="block w-full py-2 border-b border-gray-100">Farmer Dashboard</NavLink>
            <button 
              className="w-full text-left py-2 text-red-600 font-medium" 
              onClick={() => setShowLogoutConfirm(true)}
            >
              Log out
            </button>
          </>
        ) : (
          <button 
            className="cursor-pointer px-6 py-2 mt-2 bg-yellow-400 hover:bg-yellow-500 transition-colors text-white rounded-full text-sm" 
            onClick={() => { setShowUserLogin(true); navigate("/Login"); }}
          >
            Login
          </button>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;