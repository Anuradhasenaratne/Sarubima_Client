import React, { useState } from 'react';
import { FaFlask, FaSun, FaTint, FaSeedling, FaBolt, FaOilCan, FaEllipsisH, FaMapMarkerAlt, FaCalendarAlt, FaUserAlt, FaClipboardCheck } from 'react-icons/fa';
import { list } from '../assets/assets'; // Import your data

const Test= () => {
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const currentReport = list[currentReportIndex];

  const nextReport = () => {
    setCurrentReportIndex((prevIndex) => 
      prevIndex === list.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReport = () => {
    setCurrentReportIndex((prevIndex) => 
      prevIndex === 0 ? list.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Navigation */}
        <div className="bg-green-700 text-white p-4 md:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Soil Testing Report</h1>
            <p className="text-green-100 text-sm md:text-base">Detailed analysis of soil properties</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={prevReport}
              className="bg-green-800 hover:bg-green-900 p-2 rounded-full transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm">Report {currentReportIndex + 1} of {list.length}</span>
            <button 
              onClick={nextReport}
              className="bg-green-800 hover:bg-green-900 p-2 rounded-full transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Left Section - Soil Details */}
          <div className="md:w-1/2 p-4 md:p-6 border-r border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFlask className="mr-2 text-green-600" /> Soil Details
            </h2>
            
            <div className="space-y-3 md:space-y-4">
              <DetailItem icon={<FaFlask />} label="pH" value={currentReport.ph} />
              <DetailItem icon={<FaSun />} label="Sunlight" value={currentReport.sunlight} />
              <DetailItem icon={<FaTint />} label="Moisture" value={currentReport.moisture} />
              <DetailItem icon={<FaSeedling />} label="Soil Moisture" value={currentReport.soilMoisture} />
              <DetailItem icon={<FaBolt />} label="Electrical Conductivity" value={currentReport.conductivity} />
              <DetailItem icon={<FaOilCan />} label="WOIL" value={currentReport.woil} />
              <DetailItem icon={<FaEllipsisH />} label="Other" value={currentReport.other} />
            </div>
          </div>
          
          {/* Right Section - Testing Information */}
          <div className="md:w-1/2 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Testing Information</h2>
            
            <div className="space-y-3 md:space-y-4">
              <InfoItem icon={<FaClipboardCheck />} label="Testing ID" value={currentReport.testingId} />
              <InfoItem icon={<FaCalendarAlt />} label="Testing Date" value={currentReport.date} />
              <InfoItem icon={<FaMapMarkerAlt />} label="Property Address" value={currentReport.address} />
              <InfoItem icon={<FaUserAlt />} label="Tested By" value={currentReport.testedBy} />
              <InfoItem icon={<FaUserAlt />} label="Soil Collected By" value={currentReport.collectedBy} />
            </div>
          </div>
        </div>
        
        {/* Crop Recommendation Section */}
        <div className="p-4 md:p-6 bg-amber-50 border-t border-amber-100">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Crop Recommendation</h2>
          <p className="text-gray-700 text-sm md:text-base">
            {currentReport.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
      <div className="text-green-600 text-lg mr-3">{icon}</div>
      <div className="flex-1">
        <div className="text-xs md:text-sm text-gray-500">{label}</div>
        <div className="font-medium text-gray-800 text-sm md:text-base">{value}</div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start">
      <div className="text-green-600 text-lg mr-3 mt-1">{icon}</div>
      <div className="flex-1">
        <div className="text-xs md:text-sm text-gray-500">{label}</div>
        <div className="font-medium text-gray-800 text-sm md:text-base">{value}</div>
      </div>
    </div>
  );
};

export default Test;