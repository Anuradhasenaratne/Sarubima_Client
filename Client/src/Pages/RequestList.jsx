import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const UserRequestList = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) navigate("/Login");
  }, [user, navigate]);

  const [userRequests] = useState([
    { id: "ST-2023-0876", date: "2023-10-15", status: "Completed", district: "Colombo", landSize: "2.5 acres", cost: "LKR 3,000.00", address: "123 Farm Road, Colombo", recommendation: "Wheat, barley, and legumes recommended" },
    { id: "ST-2023-0921", date: "2023-10-18", status: "In Progress", district: "Gampaha", landSize: "1.2 acres", cost: "LKR 3,000.00", address: "456 Harvest Lane, Gampaha", recommendation: "Analysis in progress" },
    { id: "ST-2023-1025", date: "2023-10-22", status: "Scheduled", district: "Kandy", landSize: "4.0 acres", cost: "LKR 4,500.00", address: "789 Orchard Street, Kandy", recommendation: "Awaiting sample collection" },
    { id: "ST-2023-1102", date: "2023-10-25", status: "Pending", district: "Kurunegala", landSize: "3.2 acres", cost: "LKR 3,000.00", address: "321 Plantation Road, Kurunegala", recommendation: "Payment pending" },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedRequest, setExpandedRequest] = useState(null);

  const filteredRequests = userRequests.filter(
    (request) => filterStatus === "All" || request.status === filterStatus
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-purple-100 text-purple-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDetails = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  if (!user) return null; // Prevent rendering if user not logged in

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">My Soil Test Requests</h1>
          <p className="mt-2 text-lg text-gray-600">View and manage your soil testing requests</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">{userRequests.length}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">{userRequests.filter(r => r.status === "Completed").length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-700">{userRequests.filter(r => r.status === "In Progress").length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-yellow-700">{userRequests.filter(r => r.status === "Pending" || r.status === "Scheduled").length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="text-lg font-medium text-gray-700">Filter Requests</div>
            <div className="flex space-x-4">
              <select
                className="block w-full md:w-auto pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Request
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Request Summary */}
                <div className="p-6 cursor-pointer" onClick={() => toggleDetails(request.id)}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-green-800">{request.id}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">Request Date: {request.date}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-sm font-medium text-gray-900">{request.cost}</p>
                      <p className="text-sm text-gray-600">{request.landSize}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">{request.district} District</p>
                      <p className="text-sm text-gray-600 truncate">{request.address}</p>
                    </div>
                    <svg className={`h-5 w-5 text-gray-500 transform ${expandedRequest === request.id ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequest === request.id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Request Details</h4>
                        <dl className="space-y-2">
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">Status:</dt>
                            <dd className="text-sm font-medium">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                                {request.status}
                              </span>
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">District:</dt>
                            <dd className="text-sm text-gray-900">{request.district}</dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">Address:</dt>
                            <dd className="text-sm text-gray-900">{request.address}</dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">Land Size:</dt>
                            <dd className="text-sm text-gray-900">{request.landSize}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendation</h4>
                        <p className="text-sm text-gray-900">{request.recommendation}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-3">
                      <button className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200">
                        Download Report
                      </button>
                      {request.status === "Pending" && (
                        <button className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200">
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg className="h-12 w-12 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
              <p className="mt-2 text-gray-500">You don't have any requests matching the selected filter.</p>
              <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
                Create Your First Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRequestList;
