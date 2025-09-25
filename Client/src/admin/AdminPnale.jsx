import React, { useState } from 'react';
import axios from "axios";
import { AdminRequest } from './AdminRequest';
import AdminUserController from './AdminUserController';
import DashboardSummary from './DashboardSummary';
import MonthlyRevenue from './MonthlyRevenue';
import { 
  FaTachometerAlt, FaList, FaUserPlus, FaFlask, FaSignOutAlt, 
  FaSearch, FaBell, FaUserCircle, FaChartLine, FaMoneyBill, 
  FaClipboardCheck, FaUsers, FaMapMarkerAlt, FaEnvelope, FaPhone 
} from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminPanel = () => {

  const [activeTab, setActiveTab] = useState('dashboard');
  

  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    nic: '',
    password: '',
  });

  const [labForm, setLabForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    registrationNo: '',
    password: '',
  });

  const handleAgentInputChange = (e) => {
    const { name, value } = e.target;
    setAgentForm({
      ...agentForm,
      [name]: value
    });
  };

  const handleLabInputChange = (e) => {
    const { name, value } = e.target;
    setLabForm({
      ...labForm,
      [name]: value
    });
  };

  
const handleAgentSubmit = async (e) => {
  e.preventDefault();

  try {
    // Correct URL with /auth prefix
    const res = await axios.post(
      "http://localhost:5000/api/auth/agents/register",
      agentForm
    );

    console.log("Agent registered:", res.data);
    alert(`Agent registered successfully!`);

    // Reset agent form
    setAgentForm({ name: '', email: '', phone: '', district: '', nic: '', password: '' });
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to register agent");
  }
};

const handleLabSubmit = async (e) => {
  e.preventDefault();

  try {
    // Submit labForm (not agentForm!) to correct endpoint
    const res = await axios.post(
      "http://localhost:5000/api/auth/labs/register",
      labForm
    );

    console.log("Lab registered:", res.data);
    alert(res.data.message);

    // Reset lab form
    setLabForm({ name: '', email: '', phone: '', address: '', district: '', registrationNo: '', password: '' });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to register lab");
  }
};

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardSummary />;
      case 'adminRequest':
  return <AdminRequest />;
      case 'AdminUserController':
        return <AdminUserController />;
        case 'MonthlyRevenue':
          return <MonthlyRevenue />;
      case 'agentRegister':
        return <AgentRegister form={agentForm} onChange={handleAgentInputChange} onSubmit={handleAgentSubmit} />;
      case 'labRegister':
        return <LabRegister form={labForm} onChange={handleLabInputChange} onSubmit={handleLabSubmit} />;
      default:
        return <DashboardSummary />;
    }
  };
   const navigate = useNavigate(); // ✅
 const handleLogout = () => {
  try {
    // Remove localStorage data
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    // Remove cookies if used
    // Cookies.remove("token");
    // Cookies.remove("userInfo");

    // (Optional) clear all localStorage/cookies if you want a full reset
    // localStorage.clear();
    // Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));

    // Redirect to login or home
    navigate("/Login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-65 bg-green-800 text-white">
        <div className="p-4 border-b border-green-700">
          <h1 className="text-xl font-bold">SARUBIMA Admin</h1>
          <p className="text-green-200 text-sm">Soil Testing Management</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`w-full flex items-center p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('adminRequest')} 
                className={`w-full flex items-center p-2 rounded-lg ${activeTab === 'adminRequest' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FaList className="mr-3" />
                Requests
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('AdminUserController')} 
                className={`w-full flex items-center p-2 rounded-lg ${activeTab === 'AdminUserController' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FaList className="mr-3" />
                AdminUserController
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('MonthlyRevenue')} 
                className={`w-full flex items-center p-2 rounded-lg ${activeTab === 'MonthlyRevenue' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FaList className="mr-3" />
                MonthlyRevenue
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('agentRegister')} 
                className={`w-full flex items-center p-2 rounded-lg ${activeTab === 'agentRegister' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FaUserPlus className="mr-3" />
                Register Agent
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('labRegister')} 
                className={`w-full flex items-center p-2 rounded-lg ${activeTab === 'labRegister' ? 'bg-green-700' : 'hover:bg-green-700'}`}
              >
                <FaFlask className="mr-3" />
                Register Lab
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-green-700">
          <button 
          onClick={handleLogout}
          className="w-full flex items-center p-2 rounded-lg hover:bg-green-700">
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center">
              <div className="mr-3 text-right">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <FaUserCircle className="text-3xl text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Dashboard Summary Component


// Request List Component


// Agent Registration Component
const AgentRegister = ({ form, onChange, onSubmit }) => {
  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", 
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Agent</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
              <input
                type="text"
                name="nic"
                value={form.nic}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                name="district"
                value={form.district}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <FaUserPlus className="mr-2" />
              Register Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Lab Registration Component
const LabRegister = ({ form, onChange, onSubmit }) => {
  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", 
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Register Testing Laboratory</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNo"
                value={form.registrationNo}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                name="district"
                value={form.district}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={onChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <FaFlask className="mr-2" />
              Register Laboratory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;