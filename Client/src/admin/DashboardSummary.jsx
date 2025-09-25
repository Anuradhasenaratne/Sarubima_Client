import React, { useState, useEffect } from "react";
import {
  FaClipboardCheck,
  FaMoneyBill,
  FaUsers,
  FaFlask,
  FaChartLine,
  FaSync,
  FaTint,
  FaSeedling,
  FaSun,
  FaHourglassHalf,
  FaCheckCircle
} from "react-icons/fa";

const DashboardSummary = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    scheduled: 0,
    collected: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock data for demonstration
  const mockData = {
    total: 24,
    pending: 5,
    scheduled: 3,
    collected: 8,
    inProgress: 2,
    completed: 6,
    cancelled: 0
  };
  
  const mockRecentRequests = [
    { id: 'ST1037', farmer: 'Ravi Perera' },
    { id: 'ST0982', farmer: 'Saman Silva' },
    { id: 'ST0954', farmer: 'Kamala Fernando' }
  ];

  // Simulate API fetch with mock data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration, we'll use mock data
      // In a real application, you would fetch from your API
      setStats(mockData);
      setRecentRequests(mockRecentRequests);
      
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again.");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Calculate revenue (assuming each completed request brings in LKR 3000)
  const revenue = stats.completed * 3000;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaSync className="mr-2" />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
          <button 
            onClick={() => setError("")} 
            className="absolute top-0 right-0 p-3"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaClipboardCheck className="text-green-600 text-xl" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.completed > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% completed` : 'No completed requests yet'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-800">LKR {revenue.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaMoneyBill className="text-blue-600 text-xl" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">From {stats.completed} completed tests</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaHourglassHalf className="text-purple-600 text-xl" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Awaiting processing</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCheckCircle className="text-yellow-600 text-xl" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Successfully processed</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-8">
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

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Request Trends</h2>
            <button className="text-sm text-green-600 hover:text-green-800">View Report</button>
          </div>
          <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FaChartLine className="text-4xl mx-auto mb-2" />
              <p>Request trend chart would be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Completed Tests</h2>
          <div className="space-y-4">
            {recentRequests.length > 0 ? (
              recentRequests.map((request, index) => (
                <div key={request.id || index} className="flex items-center justify-between p-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Soil Test #{request.id}</p>
                    <p className="text-sm text-gray-500">
                      From: {request.farmer}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No completed tests yet</p>
            )}
            <button 
              className="w-full mt-4 text-sm text-green-600 hover:text-green-800 text-center"
              onClick={() => console.log("View all requests clicked")}
            >
              View All Requests
            </button>
          </div>
        </div>
      </div>

      {/* Soil Health Metrics */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Soil Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaTint className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Moisture</p>
              <p className="text-xl font-bold text-gray-800">42%</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaSeedling className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average pH Level</p>
              <p className="text-xl font-bold text-gray-800">6.8</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FaSun className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sunlight Exposure</p>
              <p className="text-xl font-bold text-gray-800">78%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;