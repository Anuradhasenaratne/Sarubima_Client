import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFlask,
  FaSun,
  FaTint,
  FaSeedling,
  FaBolt,
  FaOilCan,
  FaEllipsisH,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserAlt,
  FaClipboardCheck,
  FaFileDownload,
  FaTimesCircle,
  FaEye,
  FaPlus,
  FaFilter,
  FaCheckCircle,
  FaSpinner,
  FaUserTie,
  FaClock,
  FaLeaf,
} from "react-icons/fa";

const FarmerDashboard = () => {
  const { user: userFromContext } = useAppContext();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  // Get user data from localStorage if context doesn't have it
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUserData(JSON.parse(userInfo));
    } else if (userFromContext && typeof userFromContext === "object") {
      setUserData(userFromContext);
    }
  }, [userFromContext]);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!userFromContext && !localStorage.getItem("userInfo")) {
      navigate("/Login");
    }
  }, [userFromContext, navigate]);

  // Fetch user's soil test requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/requests/my-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch your soil test requests");
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userFromContext || localStorage.getItem("token")) {
      fetchRequests();
    }
  }, [userFromContext]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Sample Collected":
        return "bg-blue-100 text-blue-800";
      case "Assigned":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="inline mr-1" />;
      case "Sample Collected":
        return <FaFlask className="inline mr-1" />;
      case "Assigned":
        return <FaUserTie className="inline mr-1" />;
      case "Pending":
        return <FaClock className="inline mr-1" />;
      default:
        return <FaSpinner className="inline mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (status) => {
    switch (status) {
      case "Completed":
        return 100;
      case "Sample Collected":
        return 75;
      case "Assigned":
        return 50;
      case "Pending":
        return 25;
      default:
        return 0;
    }
  };

  const toggleDetails = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const handleNewRequest = () => {
    navigate("/FR");
  };

  // Helper function to safely display crops
  const displayCrops = (crops) => {
    if (Array.isArray(crops)) {
      return crops.join(", ");
    } else if (typeof crops === "string") {
      return crops;
    } else {
      return "Not specified";
    }
  };

  // Filter requests based on status
  const filteredRequests = requests.filter(
    (request) => filterStatus === "All" || request.status === filterStatus
  );

  // Function to generate and download PDF report
  const downloadReport = async (request, userData) => {
  try {
    // Dynamically import jsPDF
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF();
    let y = 20;

    // ---------- Header ----------
    doc.setFillColor(40, 180, 100);
    doc.rect(0, 0, 210, 20, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("Soil Test Report", 105, 13, { align: "center" });

    y += 20;

    // ---------- Request Details ----------
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text(`Request ID: ST-${request._id?.slice(-4).toUpperCase() || "N/A"}`, 20, y);
    y += 8;
    doc.text(`Farmer: ${userData?.name || "N/A"}`, 20, y);
    y += 8;
    doc.text(`Date: ${request.createdAt ? formatDate(request.createdAt) : "N/A"}`, 20, y);
    y += 8;
    doc.text(`District: ${request.district || "N/A"}`, 20, y);
    y += 8;
    doc.text(`Land Size: ${request.landSize || "N/A"} ${request.landUnit || ""}`, 20, y);

    y += 15;

    // ---------- Soil Parameters ----------
    if (request.soilTestResult) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 180, 100);
      doc.text("Soil Parameters:", 20, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      const params = [
        ["pH Level", request.soilTestResult.ph],
        ["Moisture", request.soilTestResult.moisture ? request.soilTestResult.moisture + "%" : "N/A"],
        ["Conductivity", request.soilTestResult.conductivity],
        ["Woil", request.soilTestResult.woil ? request.soilTestResult.woil + "%" : "N/A"],
        ["Sunlight", request.soilTestResult.sunlight],
        ["Other Parameters", request.soilTestResult.other],
      ];

      params.forEach(([label, value]) => {
        doc.text(`${label}: ${value || "N/A"}`, 25, y);
        y += 8;
      });

      y += 5;

      // ---------- Recommended Crops ----------
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 180, 100);
      doc.text("Recommended Crops:", 20, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      if (Array.isArray(request.soilTestResult.recommendedCrops) && request.soilTestResult.recommendedCrops.length > 0) {
        request.soilTestResult.recommendedCrops.forEach((crop) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(`• ${crop}`, 25, y);
          y += 7;
        });
      } else {
        doc.text("No recommendations available", 25, y);
        y += 10;
      }

      // ---------- Notes ----------
      if (request.soilTestResult.notes) {
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 180, 100);
        doc.text("Additional Notes:", 20, y);

        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        const splitNotes = doc.splitTextToSize(request.soilTestResult.notes, 170);
        doc.text(splitNotes, 25, y);
      }
    } else {
      doc.text("Soil test results not available yet", 20, y);
    }

    // ---------- Footer ----------
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
      doc.text("Generated by Sarubima.lk", 105, 292, { align: "center" });
    }

    // ---------- Save ----------
    doc.save(`Soil_Test_Report_ST-${request._id?.slice(-4).toUpperCase() || "N/A"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF report. Please try again.");
  }
};


  if (!userFromContext && !userData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800 flex items-center justify-center">
            <FaLeaf className="mr-2 text-green-600" /> My Soil Test Requests
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {userData?.name || "Farmer"}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">
              {requests.length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaClipboardCheck className="mr-1" /> Total Requests
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">
              {requests.filter((r) => r.status === "Completed").length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaCheckCircle className="mr-1" /> Completed
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-700">
              {
                requests.filter(
                  (r) =>
                    r.status === "Sample Collected" || r.status === "Assigned"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaSpinner className="mr-1" /> In Progress
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {requests.filter((r) => r.status === "Pending").length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaClock className="mr-1" /> Pending
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="text-lg font-medium text-gray-700 flex items-center">
              <FaFilter className="mr-2 text-green-600" /> Filter Requests
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <select
                  className="block w-full md:w-auto pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Sample Collected">Sample Collected</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleNewRequest}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" />
                New Request
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg
              className="h-12 w-12 mx-auto text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No soil test requests yet
            </h3>
            <p className="mt-2 text-gray-500">
              Get started by requesting your first soil test
            </p>
            <button
              onClick={handleNewRequest}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center mx-auto"
            >
              <FaPlus className="mr-2" />
              Request Soil Test
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Request Summary */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleDetails(request._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-green-800">
                          Request # ST-
                          {request._id?.slice(-4).toUpperCase() || "N/A"}
                        </h3>
                        <span
                          className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)} {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400" /> Request
                        Date: {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        LKR {request.totalCost?.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.landSize} {request.landUnit}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700 flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-gray-400" />{" "}
                        {request.district} District
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {request.address}
                      </p>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-500 transform ${
                        expandedRequest === request._id ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequest === request._id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                        <span
                          className={
                            request.status !== "Pending"
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          Requested
                        </span>
                        <span
                          className={
                            request.status === "Assigned" ||
                            request.status === "Sample Collected" ||
                            request.status === "Completed"
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          Agent Assigned
                        </span>
                        <span
                          className={
                            request.status === "Sample Collected" ||
                            request.status === "Completed"
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          Sample Collected
                        </span>
                        <span
                          className={
                            request.status === "Completed"
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          Analysis Complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${calculateProgress(request.status)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FaClipboardCheck className="mr-2 text-green-600" />{" "}
                          Request Details
                        </h4>
                        <dl className="space-y-2">
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">
                              Status:
                            </dt>
                            <dd className="text-sm font-medium">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                                  request.status
                                )}`}
                              >
                                {getStatusIcon(request.status)} {request.status}
                              </span>
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24 flex items-center">
                              <FaMapMarkerAlt className="mr-1" /> District:
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {request.district}
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">
                              Address:
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {request.address}
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">
                              Land Size:
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {request.landSize} {request.landUnit}
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">
                              Crops:
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {displayCrops(request.crops) || "N/A"}
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">
                              Tests:
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {request.numberOfTests}
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24 flex items-center">
                              <FaCalendarAlt className="mr-1" /> Preferred Date:
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {formatDate(request.preferredDate)}
                            </dd>
                          </div>
                          <div className="flex items-start">
                            <dt className="text-sm text-gray-500 w-24">
                              Preferred Time:
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {request.preferredTime}
                            </dd>
                          </div>
                          {request.agent && (
                            <div className="flex items-start">
                              <dt className="text-sm text-gray-500 w-24 flex items-center">
                                <FaUserTie className="mr-1" /> Assigned Agent:
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {request.agent.name} ({request.agent.phone})
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FaFlask className="mr-2 text-green-600" /> Soil Test
                          Results & Recommendations
                        </h4>
                        {request.soilTestResult ? (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Soil Parameters
                                </h5>
                                <div className="space-y-1 text-sm">
                                  <p className="flex items-center">
                                    <FaFlask className="mr-2 text-green-500" />
                                    <span className="text-gray-500">
                                      pH Level:
                                    </span>{" "}
                                    <span className="ml-1 text-gray-900">
                                      {request.soilTestResult.ph ||
                                        "Not available"}
                                    </span>
                                  </p>
                                  <p className="flex items-center">
                                    <FaTint className="mr-2 text-green-500" />
                                    <span className="text-gray-500">
                                      Moisture:
                                    </span>{" "}
                                    <span className="ml-1 text-gray-900">
                                      {request.soilTestResult.moisture ||
                                        "Not available"}
                                      %
                                    </span>
                                  </p>
                                  <p className="flex items-center">
                                    <FaBolt className="mr-2 text-green-500" />
                                    <span className="text-gray-500">
                                      Conductivity:
                                    </span>{" "}
                                    <span className="ml-1 text-gray-900">
                                      {request.soilTestResult.conductivity ||
                                        "Not available"}
                                    </span>
                                  </p>
                                  <p className="flex items-center">
                                    <FaOilCan className="mr-2 text-green-500" />
                                    <span className="text-gray-500">
                                      Woil:
                                    </span>{" "}
                                    <span className="ml-1 text-gray-900">
                                      {request.soilTestResult.woil ||
                                        "Not available"}
                                      %
                                    </span>
                                  </p>
                                  <p className="flex items-center">
                                    <FaSun className="mr-2 text-green-500" />
                                    <span className="text-gray-500">
                                      Sunlight:
                                    </span>{" "}
                                    <span className="ml-1 text-gray-900">
                                      {request.soilTestResult.sunlight ||
                                        "Not available"}
                                    </span>
                                  </p>
                                  <p className="flex items-center">
                                    <FaEllipsisH className="mr-2 text-green-500" />
                                    <span className="text-gray-500">
                                      Other Parameters:
                                    </span>{" "}
                                    <span className="ml-1 text-gray-900">
                                      {request.soilTestResult.other ||
                                        "Not available"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Recommended Crops
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {request.soilTestResult.recommendedCrops &&
                                  Array.isArray(
                                    request.soilTestResult.recommendedCrops
                                  ) ? (
                                    request.soilTestResult.recommendedCrops.map(
                                      (crop, index) => (
                                        <span
                                          key={index}
                                          className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded flex items-center"
                                        >
                                          <FaSeedling className="mr-1" /> {crop}
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <span className="text-gray-500">
                                      No recommendations available
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {request.soilTestResult.notes && (
                              <div className="mt-4">
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Additional Notes
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {request.soilTestResult.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Soil test results not available yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 flex items-center">
                        <FaEye className="mr-2" /> View Details
                      </button>
                      {request.status === "Completed" && (
                        <button
                          onClick={() => downloadReport(request)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 flex items-center"
                        >
                          <FaFileDownload className="mr-2" /> Download Report
                        </button>
                      )}
                      {request.status === "Pending" && (
                        <button className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 flex items-center">
                          <FaTimesCircle className="mr-2" /> Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
