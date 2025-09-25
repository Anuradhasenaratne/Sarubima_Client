import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaFlask,
  FaClipboardList,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaSeedling,
  FaCheckCircle,
  FaHourglassHalf,
  FaChartLine,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSyncAlt,
  FaExclamationCircle,
  FaFilter
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedTest, setSelectedTest] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [soilTests, setSoilTests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        // Check if user has Lab role
        if (userData.role !== "Lab") {
          setError("Access denied. Lab role required.");
          return;
        }

        setLab(userData);
        fetchTests();
      } catch (parseError) {
        console.error("Error parsing user data:", parseError);
        setError("Invalid user data. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (activeTab === "analytics" && lab) {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError("");

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        setError("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Fetch soil tests
      const response = await axios.get(`/api/lab/tests`, config);
      setSoilTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
      if (error.response?.status === 403) {
        setError("Access denied. You are not authorized to view lab tests.");
      } else if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to fetch tests. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`/api/lab/analytics`, config);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to load analytics data.");
    }
  };

  const handleRecommendationSubmit = async (e, testId) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      const trimmedRecommendation = recommendation?.trim();
      if (!trimmedRecommendation) {
        setError("Recommendation cannot be empty");
        return;
      }

      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) {
        setError("Authentication token missing. Please login again.");
        return;
      }

      // Split the recommendation into an array of crops
      const recommendedCrops = trimmedRecommendation.split(',').map(crop => crop.trim());
      
      await axios.put(
        `/api/lab/tests/${testId}/recommendation`,
        { 
          crops: recommendedCrops,
          labStaffId: lab._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Recommendation submitted successfully!');
      setRecommendation('');
      setSelectedTest(null);
      fetchTests();
      setActiveTab('completed');
    } catch (err) {
      console.error("Error submitting recommendation:", err);
      setError(err.response?.data?.message || "Failed to submit recommendation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/Login");
  };

  // Filter tests based on status
  const pendingTests = soilTests.filter((test) => test.status === "Sample Collected");
  const completedTests = soilTests.filter((test) => test.status === "Completed");
  
  // Filter completed tests by district if districtFilter exists
  const filteredCompletedTests = districtFilter 
    ? completedTests.filter(test => 
        test.district && test.district.toLowerCase().includes(districtFilter.toLowerCase()))
    : completedTests;

  // Filter tests by search term (ID or farmer name)
  const searchedTests = searchTerm 
    ? filteredCompletedTests.filter(test => 
        (test._id && test._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (test.farmer?.name && test.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())))
    : filteredCompletedTests;

  // Get unique districts for filter dropdown
  const uniqueDistricts = [...new Set(completedTests.map(test => test.district).filter(Boolean))];

  const renderContent = () => {
    if (error) {
      return (
        <div className="bg-red-50 p-6 rounded-lg shadow-sm mb-6 flex items-center">
          <FaExclamationCircle className="text-red-500 text-xl mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => fetchTests()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "pending":
        return (
          <TestList
            tests={pendingTests}
            onSelectTest={setSelectedTest}
            status="Sample Collected"
            loading={loading}
          />
        );
      case "completed":
        return (
          <TestList
            tests={searchedTests}
            onSelectTest={setSelectedTest}
            status="Completed"
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            districtFilter={districtFilter}
            onDistrictFilterChange={setDistrictFilter}
            uniqueDistricts={uniqueDistricts}
          />
        );
      case "analytics":
        return (
          <AnalyticsView
            tests={soilTests}
            analytics={analytics}
            loading={loading}
          />
        );
      default:
        return (
          <TestList
            tests={pendingTests}
            onSelectTest={setSelectedTest}
            status="Sample Collected"
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">Soil Test Analysis</h1>
          <p className="text-blue-200 text-sm">
            {lab?.district || "Unknown District"} Lab
          </p>
          <p className="text-blue-200 text-xs mt-1">
            Role: {lab?.role || "Unknown"}
          </p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("pending")}
                className={`w-full flex items-center p-2 rounded-lg ${
                  activeTab === "pending" ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <FaHourglassHalf className="mr-3" />
                Pending Tests
                {pendingTests.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingTests.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("completed");
                  setSearchTerm("");
                  setDistrictFilter("");
                }}
                className={`w-full flex items-center p-2 rounded-lg ${
                  activeTab === "completed"
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaCheckCircle className="mr-3" />
                Completed Tests
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center p-2 rounded-lg ${
                  activeTab === "analytics"
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaChartLine className="mr-3" />
                Analytics
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-blue-700">
          <button
            className="w-full flex items-center p-2 rounded-lg hover:bg-blue-700"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeTab === "pending"
                ? "Pending Soil Tests"
                : activeTab === "completed"
                ? "Completed Soil Tests"
                : "Soil Test Analytics"}
            </h1>
            <button
              onClick={() => fetchTests()}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700"
              title="Refresh data"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {activeTab === "completed" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID or farmer..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center">
              <div className="mr-3 text-right">
                <p className="text-sm font-medium">
                  {lab?.name || "Lab Technician"}
                </p>
                <p className="text-xs text-gray-500">Soil Analysis Lab</p>
              </div>
              <FaUserCircle className="text-3xl text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {selectedTest ? (
            <TestAnalysis
              test={selectedTest}
              recommendation={recommendation}
              onRecommendationChange={setRecommendation}
              onSubmit={(e) => handleRecommendationSubmit(e, selectedTest._id)}
              onCancel={() => setSelectedTest(null)}
              submitting={submitting}
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

// Test List Component
const TestList = ({ 
  tests, 
  onSelectTest, 
  status, 
  loading, 
  searchTerm, 
  onSearchChange,
  districtFilter,
  onDistrictFilterChange,
  uniqueDistricts
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-500">Loading tests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          {status === "Sample Collected" ? "Pending" : "Completed"} Tests:{" "}
          <span className="font-semibold">{tests.length}</span>
          {status === "Completed" && (searchTerm || districtFilter) && ` (filtered)`}
        </p>
        {tests.length > 0 && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "Sample Collected"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      {/* Search and filter for completed tests */}
      {status === "Completed" && (
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              placeholder="Search by ID or farmer..."
            />
          </div>
          
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={districtFilter}
              onChange={(e) => onDistrictFilterChange(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full appearance-none"
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {tests.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {tests.map((test) => (
            <div
              key={test._id}
              className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-blue-800">
                      Test #
                      {"ST-" + test._id?.slice(-4).toUpperCase() || "N/A"}
                      {/* {test._id?.slice(-6) || "N/A"} */}
                    </h3>
                    <span
                      className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                        test.status === "Sample Collected"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <FaUser className="text-gray-500 mr-2" />
                      <span className="text-gray-500">Farmer:</span>
                      <span className="ml-2 font-medium">
                        {test.farmer?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      <span className="text-gray-500">District:</span>
                      <span className="ml-2 font-medium">{test.district || "Unknown"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUser className="text-gray-500 mr-2" />
                      <span className="text-gray-500">Agent:</span>
                      <span className="ml-2 font-medium">
                        {test.agent?.name || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {test.status === "Completed" && test.recommendedCrops && test.recommendedCrops.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Recommended Crops: </span>
                        {test.recommendedCrops.join(", ")}
                      </p>
                      {test.recommendedBy && (
                        <p className="text-xs text-green-700 mt-1">
                          Recommended by: {test.recommendedBy.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                  {test.status === "Sample Collected" && (
                    <button
                      onClick={() => onSelectTest(test)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                    >
                      <FaFlask className="mr-2" />
                      Analyze Test
                    </button>
                  )}
                  {test.status === "Completed" && (
                    <button
                      onClick={() => onSelectTest(test)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center transition-colors"
                    >
                      <FaClipboardList className="mr-2" />
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <FaFlask className="text-3xl text-blue-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No {status.toLowerCase()} tests
            {(searchTerm || districtFilter) ? " matching your search" : ""}
          </h3>
          <p className="mt-2 text-gray-500">
            {status === "Sample Collected"
              ? "All tests have been analyzed. Great job!"
              : "No tests have been completed yet."}
          </p>
        </div>
      )}
    </div>
  );
};

// Test Analysis Component
const TestAnalysis = ({
  test,
  recommendation,
  onRecommendationChange,
  onSubmit,
  onCancel,
  submitting,
}) => {
  const isCompleted = test.status === "Completed";
  const hasRecommendation = test.recommendedCrops && test.recommendedCrops.length > 0;
  const results = test.results || {};

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Soil Test Analysis
        </h2>
        <p className="text-gray-600">
          Test ID: #{"ST-" + test._id?.slice(-4).toUpperCase() || "N/A"}
          

        </p>
        <p className="text-gray-600">
          Farmer: {test.farmer?.name || "Unknown"} | District: {test.district}
          
        </p>
        <p className="text-gray-600">
          Collected by: {test.agent?.name || "Unassigned"} on{" "}
          {new Date(test.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Test Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaFlask className="mr-2 text-blue-600" /> Soil Test Results
          </h3>

          {results ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="pH" value={results.ph} />
              <DetailItem label="Sunlight" value={results.sunlight} />
              <DetailItem label="Moisture" value={results.moisture} />
              <DetailItem
                label="Soil Moisture"
                value={results.soilMoisture}
              />
              <DetailItem
                label="Electrical Conductivity"
                value={results.conductivity}
              />
              <DetailItem label="WOIL" value={results.woil} />
              <div className="md:col-span-2">
                <DetailItem
                  label="Other Observations"
                  value={results.other || "No observations"}
                />
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
              <FaExclamationTriangle className="text-yellow-500 mr-2" />
              <p className="text-yellow-700">No test results available yet.</p>
            </div>
          )}
        </div>

        {/* Recommendation Form */}
        {isCompleted && hasRecommendation ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaSeedling className="mr-2 text-green-600" /> Crop Recommendation
            </h3>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">Recommended Crops:</p>
              <p className="mt-2 text-green-700">
                {test.recommendedCrops.join(", ")}
              </p>
              {test.recommendedBy && (
                <p className="text-xs text-green-700 mt-2">
                  Recommended by: {test.recommendedBy.name}
                </p>
              )}
              {test.recommendedAt && (
                <p className="text-xs text-green-700 mt-1">
                  On: {new Date(test.recommendedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="mt-6 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Back to List
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaSeedling className="mr-2 text-green-600" /> Crop Recommendation
            </h3>

            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommended Crops (comma-separated):
                </label>
                <textarea
                  value={recommendation}
                  onChange={(e) => onRecommendationChange(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter recommended crops separated by commas (e.g., Wheat, Corn, Soybean)..."
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple crops with commas
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Submit Recommendation
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics View Component
const AnalyticsView = ({ tests, analytics, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Soil Test Analytics
      </h1>

      {analytics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tests
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {analytics.totalTests}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaFlask className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completed Tests
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {analytics.completedTests}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Tests
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {analytics.pendingTests}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaHourglassHalf className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tests by District
              </h3>
              <div className="space-y-2">
                {analytics.testsByDistrict &&
                  analytics.testsByDistrict.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <span className="text-gray-600">{item._id}</span>
                      <span className="font-semibold">{item.count} tests</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Recommendations
              </h3>
              <div className="space-y-4">
                {tests
                  .filter(
                    (t) => t.status === "Completed" && t.recommendedCrops
                  )
                  .slice(0, 3)
                  .map((test) => (
                    <div
                      key={test._id}
                      className="p-3 border-b border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            Test #{test._id?.slice(-6) || "N/A"}
                            
                          </p>
                          <p className="text-sm text-gray-600">
                            {test.farmer?.name} - {test.district}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Completed
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {test.recommendedCrops.join(", ")}
                      </p>
                      {test.recommendedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          By: {test.recommendedBy.name}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">No analytics data available</div>
      )}
    </div>
  );
};

// Detail Item Component
const DetailItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  );
};

export default LabDashboard;