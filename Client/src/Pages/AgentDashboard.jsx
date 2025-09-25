import React, { useEffect, useState } from 'react';
import { 
  FaList, FaSignOutAlt, FaBell, FaUserCircle, 
  FaFlask, FaMapMarkerAlt, FaSun, FaTint, FaSeedling, 
  FaBolt, FaOilCan, FaClipboardList, FaMoneyBillWave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCashModal, setShowCashModal] = useState(false);
  const [soilTestData, setSoilTestData] = useState({
    ph: '', sunlight: '', moisture: '', soilMoisture: '', conductivity: '', woil: '', other: ''
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate();

  // Fetch agent + requests
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAgent(user);
      fetchRequests();
    }
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const res = await axios.get("/api/requests/agent-requests", config);
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSoilTestData({ ...soilTestData, [name]: value });
  };

  const handleCollectCash = async (request) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      // Update payment status to CompletedCOC
      await axios.put(
        `/api/requests/${request._id}/payment-status`,
        { paymentStatus: "CompletedCOC" },
        config
      );

      alert("Cash collected successfully! Payment status updated.");
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error collecting cash:", error);
      alert(error.response?.data?.message || "Failed to collect cash.");
    }
  };

  const handleCollectCashAndProceed = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      // Update payment status to CompletedCOC
      await axios.put(
        `/api/requests/${selectedRequest._id}/payment-status`,
        { paymentStatus: "CompletedCOC" },
        config
      );

      setShowCashModal(false);
      alert("Cash collected successfully! Payment status updated.");
      
      // After collecting cash, proceed with test submission
      await submitTestResults();
    } catch (error) {
      console.error("Error collecting cash:", error);
      alert(error.response?.data?.message || "Failed to collect cash.");
    }
  };

  const submitTestResults = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      let response;
      if (selectedRequest.soilTestResult) {
        response = await axios.put(
          `/api/soil-test-results/${selectedRequest._id}`,
          soilTestData,
          config
        );
      } else {
        response = await axios.post(
          `/api/soil-test-results/${selectedRequest._id}`,
          soilTestData,
          config
        );
      }

      // Update request status to Completed
      await axios.put(
        `/api/requests/${selectedRequest._id}/status`,
        { status: "Sample Collected" },
        config
      );

      alert("Soil test result saved successfully!");
      await fetchRequests();
      setActiveTab("completed");
      setSoilTestData({ ph: "", sunlight: "", moisture: "", soilMoisture: "", conductivity: "", woil: "", other: "" });
    } catch (error) {
      console.error("Error submitting soil test:", error);
      alert(error.response?.data?.message || "Failed to submit soil test.");
    }
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    
    // If payment is COCPending, show cash collection modal first
    if (selectedRequest.paymentStatus === "COCPending") {
      setShowCashModal(true);
      return;
    }

    // Continue with test submission if payment is already handled
    await submitTestResults();
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/Login");
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    
    if (request.status === "Sample Collected" && request.soilTestResult) {
      const result = request.soilTestResult;
      setSoilTestData({
        ph: result.ph || "",
        sunlight: result.sunlight || "",
        moisture: result.moisture || "",
        soilMoisture: result.soilMoisture || "",
        conductivity: result.conductivity || "",
        woil: result.woil || "",
        other: result.other || "",
      });
    } else {
      setSoilTestData({ ph: "", sunlight: "", moisture: "", soilMoisture: "", conductivity: "", woil: "", other: "" });
    }
  };

  const renderCashModal = () => {
    if (!showCashModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Collect Cash Payment</h3>
          <p className="mb-4">
            This farmer has selected cash payment. Please collect <strong>LKR {selectedRequest?.totalCost}</strong> before proceeding with the soil test.
          </p>
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setShowCashModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              onClick={handleCollectCashAndProceed}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center"
            >
              <FaMoneyBillWave className="mr-2" /> Confirm Cash Collected
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <p>Loading requests...</p>;
    switch(activeTab) {
      case 'requests':
        return (
          <RequestList 
            requests={requests.filter(r => r.status === 'Pending')} 
            onSelectRequest={handleSelectRequest}
            onCollectCash={handleCollectCash}
          />
        );
      case 'completed':
        return (
          <RequestList 
            requests={requests.filter(r => r.status === 'Completed')} 
            onSelectRequest={handleSelectRequest}
            onCollectCash={handleCollectCash}
          />
        );
      default:
        return (
          <RequestList 
            requests={requests.filter(r => r.status === 'Pending')} 
            onSelectRequest={handleSelectRequest}
            onCollectCash={handleCollectCash}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white">
        <div className="p-4 border-b border-green-700">
          <h1 className="text-xl font-bold">Agent Portal</h1>
          <div className="flex items-center mt-2 text-green-200 text-sm">
            <FaMapMarkerAlt className="mr-1" />
            <span>{agent?.district || "Unknown District"}</span>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center p-2 rounded-lg ${activeTab==='requests'?'bg-green-700':'hover:bg-green-700'}`}>
                <FaList className="mr-3" /> Pending Requests
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('completed')} className={`w-full flex items-center p-2 rounded-lg ${activeTab==='completed'?'bg-green-700':'hover:bg-green-700'}`}>
                <FaClipboardList className="mr-3" /> Completed Tests
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-green-700">
          <button className="w-full flex items-center p-2 rounded-lg hover:bg-green-700" onClick={handleLogout}>
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {activeTab==='requests'?'Pending Soil Test Requests':'Completed Soil Tests'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center">
              <div className="mr-3 text-right">
                <p className="text-sm font-medium">{agent?.name || "Agent Name"}</p>
                <p className="text-xs text-gray-500">Field Agent</p>
              </div>
              <FaUserCircle className="text-3xl text-gray-500" />
            </div>
          </div>
        </header>

        <main className="p-6">
          {selectedRequest ? (
            <SoilTestForm 
              request={selectedRequest} 
              data={soilTestData} 
              onChange={handleInputChange} 
              onSubmit={handleSubmitTest} 
              onCancel={() => setSelectedRequest(null)} 
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>
      {renderCashModal()}
    </div>
  );
};

const RequestList = ({ requests, onSelectRequest, onCollectCash }) => (
  <div>
    <div className="mb-6">
      <p className="text-gray-600">You have <span className="font-semibold">{requests.length}</span> soil test requests in your district.</p>
    </div>
    {requests.length > 0 ? (
      <div className="grid grid-cols-1 gap-6">
        {requests.map(req => (
          <div key={req._id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-green-800">Test #{"ST-" + (req._id).slice(-4).toUpperCase() || "N/A"}</h3>
                  <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">{req.status}</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    req.paymentStatus === 'CompletedCOC' ? 'bg-green-100 text-green-800' : 
                    req.paymentStatus === 'COCPending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    Payment: {req.paymentStatus}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">{req.farmer?.name}</p>
                <p className="text-sm text-gray-600">{req.address}</p>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Land Size:</span> <span className="ml-2 font-medium">{req.landSize} {req.landUnit}</span></div>
                  <div><span className="text-gray-500">Contact:</span> <span className="ml-2 font-medium">{req.farmer?.phone}</span></div>
                  <div><span className="text-gray-500">Farmer Name:</span> <span className="ml-2 font-medium">{req.farmer?.name}</span></div>
                  <div><span className="text-gray-500">Unit of testing:</span> <span className="ml-2 font-medium">{req.numberOfTests}</span></div>
                  <div><span className="text-gray-500">Request Date:</span> <span className="ml-2 font-medium">{new Date(req.createdAt).toLocaleDateString()}</span></div>
                  <div><span className="text-gray-500">Preferred Date:</span> <span className="ml-2 font-medium">{new Date(req.preferredDate).toLocaleDateString()}</span></div>
                  <div><span className="text-gray-500">Preferred Time:</span> <span className="ml-2 font-medium">{req.preferredTime}</span></div>
                  <div><span className="text-gray-500">Total Cost:</span> <span className="ml-2 font-medium">LKR {req.totalCost}</span></div>
                  {/* Show agent info if completed */}
                  {req.status === "Sample Collected" && req.agent && (
                    <div><span className="text-gray-500">Tested by:</span> <span className="ml-2 font-medium">{req.agent.name}</span></div>
                  )}
                </div>
                
                {/* Show test results if completed */}
                {req.status === "Sample Collected" && req.soilTestResult && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Test Results:</h4>
                    <p className="text-sm text-green-700">
                      pH: {req.soilTestResult.ph}, Moisture: {req.soilTestResult.moisture}%, 
                      Conductivity: {req.soilTestResult.conductivity}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                <button onClick={() => onSelectRequest(req)} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center">
                  <FaFlask className="mr-2" /> {req.status === 'Completed' ? 'View Details' : 'Perform Test'}
                </button>
                
                {/* Collect Cash button for COCPending status */}
                {req.paymentStatus === "COCPending" && (
                  <button 
                    onClick={() => onCollectCash(req)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <FaMoneyBillWave className="mr-2" /> Collect Cash
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <FaClipboardList className="text-3xl text-green-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
        <p className="mt-2 text-gray-500">There are currently no soil test requests in your district.</p>
      </div>
    )}
  </div>
);

const SoilTestForm = ({ request, data, onChange, onSubmit, onCancel }) => {
  const isCompleted = request.status === "Sample Collected";
  
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {isCompleted ? 'Soil Test Results for' : 'Soil Testing for'} {request.farmer?.name || "Unknown Farmer"}
        </h2>
        <p className="text-gray-600">Request ID: {request._id}</p>
        <p className="text-gray-600">Address: {request.address}</p>
        
        {/* Payment Status Indicator */}
        <div className="mt-3">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            request.paymentStatus === 'CompletedCOC' ? 'bg-green-100 text-green-800' : 
            request.paymentStatus === 'COCPending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            Payment: {request.paymentStatus}
          </span>
        </div>
        
        {isCompleted && (
          <p className="text-green-600 font-medium mt-2">This test has been completed and submitted.</p>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaFlask className="mr-2 text-green-600" /> 
          {isCompleted ? 'Soil Test Results' : 'Soil Test Details'}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaFlask className="mr-2 text-green-600" /> pH Level
              </label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                max="14" 
                name="ph" 
                value={data.ph} 
                onChange={onChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Enter pH value (0-14)" 
                required 
                readOnly={isCompleted}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaSun className="mr-2 text-yellow-500" /> Sunlight Exposure
              </label>
              <select 
                name="sunlight" 
                value={data.sunlight} 
                onChange={onChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required 
                disabled={isCompleted}
              >
                <option value="">Select sunlight level</option>
                <option value="Full Sun">Full Sun</option>
                <option value="Partial Sun">Partial Sun</option>
                <option value="Partial Shade">Partial Shade</option>
                <option value="Full Shade">Full Shade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaTint className="mr-2 text-blue-500" /> Moisture Level
              </label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                max="100" 
                name="moisture" 
                value={data.moisture} 
                onChange={onChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Enter moisture % (0-100)" 
                required 
                readOnly={isCompleted}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaSeedling className="mr-2 text-green-500" /> Soil Moisture
              </label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                max="100" 
                name="soilMoisture" 
                value={data.soilMoisture} 
                onChange={onChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Enter soil moisture % (0-100)" 
                required 
                readOnly={isCompleted}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaBolt className="mr-2 text-yellow-500" /> Electrical Conductivity
              </label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                name="conductivity" 
                value={data.conductivity} 
                onChange={onChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Enter conductivity (dS/m)" 
                required 
                readOnly={isCompleted}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaOilCan className="mr-2 text-gray-600" /> WOIL Level
              </label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                name="woil" 
                value={data.woil} 
                onChange={onChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Enter WOIL level" 
                required 
                readOnly={isCompleted}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Observations</label>
              <textarea 
                name="other" 
                value={data.other} 
                onChange={onChange} 
                rows="3" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Enter any additional observations"
                readOnly={isCompleted}
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            {!isCompleted ? (
              <>
                <button type="submit" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center">
                  <FaFlask className="mr-2" /> Submit Test Results
                </button>
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Back to List
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentDashboard;