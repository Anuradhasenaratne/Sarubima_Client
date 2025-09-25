import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaFilter,
  FaTimes,
  FaUserTie,
  FaFlask,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSync,
  FaUser,
  FaSeedling,
  FaMapMarkerAlt,
  FaSignInAlt,
  FaEdit,
  FaPlus,
  FaChartLine,
  FaDownload,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard
} from "react-icons/fa";

export const AdminRequest = () => {
  const [requests, setRequests] = useState([]);
  const [agents, setAgents] = useState([]);
  const [recommenders, setRecommenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showLogin, setShowLogin] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    scheduled: 0,
    collected: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });
  const [assignmentData, setAssignmentData] = useState({
    soilCollectorId: "",
    cropRecommenderId: ""
  });
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");

  // Sri Lanka districts
  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", 
    "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", 
    "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", 
    "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", 
    "Trincomalee", "Vavuniya"
  ];

  // Months for filter
  const months = [
    "All", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Get current and past years for filter
  const currentYear = new Date().getFullYear();
  const years = ["All", currentYear, currentYear - 1, currentYear - 2];

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem("adminToken") || localStorage.getItem("authToken");
  };

  // Get auth token with better error handling
  const getAuthToken = () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setShowLogin(true);
      return null;
    }
    return token;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", loginData);
      
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setError("");
        setShowLogin(false);
        fetchRequests();
        fetchAgents();
        fetchRecommenders();
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all soil test requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) return;
      
      const response = await axios.get("/api/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
      
      // Calculate statistics
      const statsData = {
        total: response.data.length,
        pending: response.data.filter(r => r.status === "Pending").length,
        scheduled: response.data.filter(r => r.status === "Scheduled").length,
        collected: response.data.filter(r => r.status === "Sample Collected").length,
        inProgress: response.data.filter(r => r.status === "In Progress").length,
        completed: response.data.filter(r => r.status === "Completed").length,
        cancelled: response.data.filter(r => r.status === "Cancelled").length
      };
      setStats(statsData);
      
      setError("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
        setShowLogin(true);
        // Clear invalid token
        localStorage.removeItem("adminToken");
        localStorage.removeItem("authToken");
      } else {
        setError("Failed to fetch requests. Please try again.");
      }
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all agents
  const fetchAgents = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await axios.get("/api/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(response.data);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  // Fetch all recommenders
  const fetchRecommenders = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await axios.get("/api/recommenders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecommenders(response.data);
    } catch (err) {
      console.error("Error fetching recommenders:", err);
    }
  };

  // Assign agents to a request
  const handleAssignAgents = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      if (!token) return;
      
      await axios.put(`/api/requests/${selectedRequest._id}/assign`, assignmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setError("");
      setShowAssignmentModal(false);
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError("Failed to assign agents. Please try again.");
      console.error("Assignment error:", err);
    }
  };

  // Update request status
  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      await axios.put(`/api/requests/${selectedRequest._id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setError("");
      setShowDetailModal(false);
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError("Failed to update status. Please try again.");
      console.error("Status update error:", err);
    }
  };

  // Update payment status
  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      await axios.put(`/api/requests/${selectedRequest._id}/payment-status`, { paymentStatus: newPaymentStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setError("");
      setShowDetailModal(false);
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError("Failed to update payment status. Please try again.");
      console.error("Payment status update error:", err);
    }
  };

  // Export requests as CSV
  const exportToCSV = () => {
    const headers = [
      "ID", 
      "Farmer Name", 
      "Phone", 
      "District", 
      "Status", 
      "Payment Method",
      "Payment Status",
      "Created At", 
      "Soil Collector", 
      "Soil Collector ID",
      "Crop Recommender",
      "Crop Recommender ID"
    ];
    
    const csvData = filteredRequests.map(request => [
      request._id,
      request.farmer?.name || "N/A",
      request.phone,
      request.district,
      request.status,
      request.paymentMethod || "N/A",
      request.paymentStatus || "N/A",
      new Date(request.createdAt).toLocaleDateString(),
      request.agent?.name || "Not assigned",
      request.agent?.employeeId || "N/A",
      request.soilTestResult?.recommendedBy?.name || "Not assigned",
      request.soilTestResult?.recommendedBy?.employeeId || "N/A"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `soil-test-requests-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchRequests();
      fetchAgents();
      fetchRecommenders();
    } else {
      setLoading(false);
      setShowLogin(true);
    }
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort requests
  const sortedRequests = [...requests].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Filter requests based on status, district, date and search term
  const filteredRequests = sortedRequests.filter((request) => {
    const statusMatch = filterStatus === "All" || request.status === filterStatus;
    const districtMatch = filterDistrict === "All" || request.district === filterDistrict;
    
    // Date filtering
    let monthMatch = true;
    let yearMatch = true;
    
    if (filterMonth !== "All" && request.createdAt) {
      const requestMonth = new Date(request.createdAt).getMonth() + 1;
      const selectedMonth = months.indexOf(filterMonth);
      monthMatch = requestMonth === selectedMonth;
    }
    
    if (filterYear !== "All" && request.createdAt) {
      const requestYear = new Date(request.createdAt).getFullYear();
      yearMatch = requestYear === parseInt(filterYear);
    }
    
    const searchMatch = 
      (request.farmer?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.phone || "").includes(searchTerm) ||
      (request._id || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && districtMatch && monthMatch && yearMatch && searchMatch;
  });

  // Get current requests for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Sample Collected":
        return "bg-purple-100 text-purple-800";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status badge class
  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "COCPending":
        return "bg-orange-100 text-orange-800";
      case "CompletedCOC":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    if (sortConfig.direction === "asc") return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the soil test requests management system
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span>{error}</span>
                <button 
                  onClick={() => setError("")} 
                  className="absolute top-0 right-0 p-3"
                >
                  <FaTimes />
                </button>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaSignInAlt className="mr-2" />
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Soil Test Requests Management
          </h1>
          <p className="text-gray-600">Manage and track all soil testing requests</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span>{error}</span>
          <button 
            onClick={() => setError("")} 
            className="absolute top-0 right-0 p-3"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone or ID"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Sample Collected">Sample Collected</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
            >
              <option value="All">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            <button 
              onClick={fetchRequests}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaSync className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-500 flex items-center">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-6">
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-xl font-bold text-blue-600">{stats.scheduled}</div>
          <div className="text-xs text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-xl font-bold text-purple-600">{stats.collected}</div>
          <div className="text-xs text-gray-600">Collected</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-xl font-bold text-indigo-600">{stats.inProgress}</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-xs text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center">
                  Request ID
                  {renderSortIcon("_id")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("farmer.name")}
              >
                <div className="flex items-center">
                  Farmer
                  {renderSortIcon("farmer.name")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Date
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("district")}
              >
                <div className="flex items-center">
                  District
                  {renderSortIcon("district")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Soil Collector
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crop Recommender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRequests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-700">
                    ST-{request._id?.slice(-4).toUpperCase() || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.farmer?.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">{request.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.district}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    {request.paymentMethod === "cash" ? (
                      <FaMoneyBillWave className="text-green-600 mr-1" />
                    ) : (
                      <FaCreditCard className="text-blue-600 mr-1" />
                    )}
                    {request.paymentMethod || "N/A"}
                  </div>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(
                      request.paymentStatus
                    )}`}
                  >
                    {request.paymentStatus || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.agent ? (
                    <div>
                      <div className="font-medium">{request.agent.name}</div>
                      <div className="text-xs">ID: {request.agent.employeeId}</div>
                    </div>
                  ) : (
                    "Not assigned"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.soilTestResult?.recommendedBy ? (
                    <div>
                      <div className="font-medium">{request.soilTestResult.recommendedBy.name}</div>
                      <div className="text-xs">ID: {request.soilTestResult.recommendedBy.employeeId}</div>
                    </div>
                  ) : (
                    "Not assigned"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailModal(true);
                      }}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setAssignmentData({
                          soilCollectorId: request.agent?._id || "",
                          cropRecommenderId: request.soilTestResult?.recommendedBy?._id || ""
                        });
                        setShowAssignmentModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                      title="Assign Agents"
                    >
                      <FaUserTie />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No requests found matching your filters
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page 
                    ? 'bg-green-600 text-white' 
                    : 'border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Request Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Request Details: ST-
                  {selectedRequest._id?.slice(-4).toUpperCase() || "N/A"}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                    <FaUser className="mr-2" />
                    Farmer Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedRequest.farmer?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedRequest.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedRequest.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">District:</span>{" "}
                      {selectedRequest.district || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Land Size:</span>{" "}
                      {selectedRequest.landSize} {selectedRequest.landUnit}
                    </p>
                    <p>
                      <span className="font-medium">Crops:</span>{" "}
                      {selectedRequest.crops || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                    <FaUserTie className="mr-2" />
                    Assignment Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Soil Collector:</span>{" "}
                      {selectedRequest.agent ? (
                        <span>{selectedRequest.agent.name} (ID: {selectedRequest.agent.employeeId})</span>
                      ) : (
                        "Not assigned"
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Crop Recommender:</span>{" "}
                      {selectedRequest.soilTestResult?.recommendedBy ? (
                        <span>{selectedRequest.soilTestResult.recommendedBy.name} (ID: {selectedRequest.soilTestResult.recommendedBy.employeeId})</span>
                      ) : (
                        "Not assigned"
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        selectedRequest.status
                      )}`}>
                        {selectedRequest.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {selectedRequest.paymentMethod || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(
                        selectedRequest.paymentStatus
                      )}`}>
                        {selectedRequest.paymentStatus || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Total Cost:</span>{" "}
                      LKR {selectedRequest.totalCost?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedRequest.soilTestResult && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                    <FaFlask className="mr-2" />
                    Test Results
                  </h3>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="font-medium">pH:</span>{" "}
                        {selectedRequest.soilTestResult.ph || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Moisture:</span>{" "}
                        {selectedRequest.soilTestResult.moisture || "N/A"}%
                      </div>
                      <div>
                        <span className="font-medium">Conductivity:</span>{" "}
                        {selectedRequest.soilTestResult.conductivity || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Sunlight:</span>{" "}
                        {selectedRequest.soilTestResult.sunlight || "N/A"}
                      </div>
                    </div>

                    {selectedRequest.soilTestResult.recommendedCrops && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1 flex items-center">
                          <FaSeedling className="mr-1" />
                          Recommended Crops
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.soilTestResult.recommendedCrops.map((crop, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedRequest.status !== "Completed" && selectedRequest.status !== "Cancelled" && (
                  <>
                    {selectedRequest.status === "Pending" && (
                      <button
                        onClick={() => handleStatusUpdate("Scheduled")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Mark as Scheduled
                      </button>
                    )}
                    {selectedRequest.status === "Scheduled" && (
                      <button
                        onClick={() => handleStatusUpdate("Sample Collected")}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                      >
                        Mark as Collected
                      </button>
                    )}
                    {selectedRequest.status === "Sample Collected" && (
                      <button
                        onClick={() => handleStatusUpdate("In Progress")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                      >
                        Mark as In Progress
                      </button>
                    )}
                    {selectedRequest.status === "In Progress" && (
                      <button
                        onClick={() => handleStatusUpdate("Completed")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </>
                )}
                
                {/* Payment Status Buttons */}
                {selectedRequest.paymentStatus !== "Paid" && (
                  <button
                    onClick={() => handlePaymentStatusUpdate("Paid")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Mark as Paid
                  </button>
                )}
                {selectedRequest.paymentStatus === "COCPending" && (
                  <button
                    onClick={() => handlePaymentStatusUpdate("CompletedCOC")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Complete COC
                  </button>
                )}
                
                {selectedRequest.status !== "Cancelled" && (
                  <button
                    onClick={() => handleStatusUpdate("Cancelled")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel Request
                  </button>
                )}
                
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Assign Agents to Request: ST-
                  {selectedRequest._id?.slice(-4).toUpperCase() || "N/A"}
                </h2>
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleAssignAgents}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soil Collector
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={assignmentData.soilCollectorId}
                    onChange={(e) => setAssignmentData({...assignmentData, soilCollectorId: e.target.value})}
                  >
                    <option value="">Select a Soil Collector</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} - ID: {agent.employeeId} - {agent.district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Recommender
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={assignmentData.cropRecommenderId}
                    onChange={(e) => setAssignmentData({...assignmentData, cropRecommenderId: e.target.value})}
                  >
                    <option value="">Select a Crop Recommender</option>
                    {recommenders.map(recommender => (
                      <option key={recommender._id} value={recommender._id}>
                        {recommender.name} - ID: {recommender.employeeId} - {recommender.district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignmentModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Assign Agents
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};