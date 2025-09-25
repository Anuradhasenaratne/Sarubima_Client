import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaFilter,
  FaTimes,
  FaUser,
  FaUserSlash,
  FaUserCheck,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSync,
  FaUserTie,
  FaCog,
  FaCircle,
  FaGlobe,
  FaClock
} from "react-icons/fa";

const AdminUserController = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "online"

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem("adminToken") || localStorage.getItem("authToken");
  };

  // Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return null;
    }
    return token;
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) return;
      
      const response = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to fetch users. Please try again.");
      }
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await axios.get("/api/admin/online-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOnlineUsers(response.data);
    } catch (err) {
      console.error("Error fetching online users:", err);
    }
  };

  // Toggle user hold status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(true);
      const token = getAuthToken();
      if (!token) return;
      
      await axios.put(
        `/api/admin/users/${userId}/hold`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setError("");
      fetchUsers(); // Refresh the list
      if (activeTab === "online") {
        fetchOnlineUsers(); // Refresh online users list
      }
    } catch (err) {
      setError("Failed to update user status. Please try again.");
      console.error("Status update error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUsers();
      fetchOnlineUsers();
      
      // Set up interval to refresh online users periodically
      const interval = setInterval(fetchOnlineUsers, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
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

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Filter users based on role, status and search term
  const filteredUsers = sortedUsers.filter((user) => {
    const roleMatch = filterRole === "All" || user.role === filterRole;
    const statusMatch = filterStatus === "All" || 
                       (filterStatus === "Active" && user.isActive) || 
                       (filterStatus === "Hold" && !user.isActive);
    
    const searchMatch = 
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.nic || "").includes(searchTerm) ||
      (user.registrationNo || "").includes(searchTerm);
    
    return roleMatch && statusMatch && searchMatch;
  });

  // Filter online users based on role and search term
  const filteredOnlineUsers = onlineUsers.filter((user) => {
    const roleMatch = filterRole === "All" || user.role === filterRole;
    
    const searchMatch = 
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.nic || "").includes(searchTerm) ||
      (user.registrationNo || "").includes(searchTerm);
    
    return roleMatch && searchMatch;
  });

  // Get current users for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = activeTab === "all" 
    ? filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
    : filteredOnlineUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    activeTab === "all" ? filteredUsers.length : filteredOnlineUsers.length / itemsPerPage
  );

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    if (sortConfig.direction === "asc") return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  // User roles for filter
  const roles = ["All", "Farmer", "Agent", "Lab", "Admin"];
  const statuses = ["All", "Active", "Hold"];

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.some(user => user._id === userId);
  };

  // Format last active time
  const formatLastActive = (lastActive) => {
    if (!lastActive) return "Never";
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInMinutes = Math.floor((now - lastActiveDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage all system users and their access</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={activeTab === "all" ? fetchUsers : fetchOnlineUsers}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaSync className="mr-2" />
            Refresh
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

      {/* Tabs for All Users vs Online Users */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm rounded-t-lg mr-2 ${
            activeTab === "all"
              ? "bg-white border-t border-l border-r border-gray-200 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Users ({users.length})
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm rounded-t-lg flex items-center ${
            activeTab === "online"
              ? "bg-white border-t border-l border-r border-gray-200 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("online")}
        >
          <FaCircle className="text-green-500 mr-1" size={10} />
          Online Now ({onlineUsers.length})
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, NIC, or ID"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FaUser className="text-gray-500" />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          {activeTab === "all" && (
            <div className="flex items-center space-x-2">
              <FaCog className="text-gray-500" />
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="text-sm text-gray-500 flex items-center">
            Showing {activeTab === "all" ? filteredUsers.length : filteredOnlineUsers.length} of{" "}
            {activeTab === "all" ? users.length : onlineUsers.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {renderSortIcon("name")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIcon("email")}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center">
                  Role
                  {renderSortIcon("role")}
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
              {activeTab === "online" && (
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("lastActive")}
                >
                  <div className="flex items-center">
                    Last Active
                    {renderSortIcon("lastActive")}
                  </div>
                </th>
              )}
              {activeTab === "all" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FaUser className="text-green-600" />
                      </div>
                      {activeTab === "all" && isUserOnline(user._id) && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.nic || user.registrationNo || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.district || "N/A"}
                </td>
                {activeTab === "online" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaClock className="mr-1 text-gray-400" size={12} />
                      {formatLastActive(user.lastActive)}
                    </div>
                  </td>
                )}
                {activeTab === "all" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "On Hold"}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailModal(true);
                      }}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {activeTab === "all" && (
                      <button
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        disabled={actionLoading}
                        className={`p-1 rounded ${
                          user.isActive
                            ? "text-red-600 hover:text-red-900 hover:bg-red-100"
                            : "text-green-600 hover:text-green-900 hover:bg-green-100"
                        }`}
                        title={user.isActive ? "Put on Hold" : "Activate User"}
                      >
                        {user.isActive ? <FaUserSlash /> : <FaUserCheck />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {activeTab === "online" 
              ? "No online users found matching your filters" 
              : "No users found matching your filters"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, activeTab === "all" ? filteredUsers.length : filteredOnlineUsers.length)} of{" "}
            {activeTab === "all" ? filteredUsers.length : filteredOnlineUsers.length} entries
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

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  User Details
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
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedUser.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedUser.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedUser.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span>{" "}
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {selectedUser.role}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedUser.isActive ? "Active" : "On Hold"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Online Status:</span>{" "}
                      {isUserOnline(selectedUser._id) ? (
                        <span className="flex items-center text-green-600">
                          <FaCircle className="mr-1" size={10} />
                          Online
                        </span>
                      ) : (
                        <span className="text-gray-500">Offline</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                    <FaUserTie className="mr-2" />
                    Additional Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">NIC/Registration:</span>{" "}
                      {selectedUser.nic || selectedUser.registrationNo || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">District:</span>{" "}
                      {selectedUser.district || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedUser.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Registered:</span>{" "}
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Last Active:</span>{" "}
                      {selectedUser.lastActive ? formatLastActive(selectedUser.lastActive) : "Never"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    toggleUserStatus(selectedUser._id, selectedUser.isActive);
                    setShowDetailModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    selectedUser.isActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {selectedUser.isActive ? (
                    <>
                      <FaUserSlash className="mr-2" />
                      Put on Hold
                    </>
                  ) : (
                    <>
                      <FaUserCheck className="mr-2" />
                      Activate User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserController;