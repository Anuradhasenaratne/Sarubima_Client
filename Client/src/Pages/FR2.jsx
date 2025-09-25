import React, { useState } from 'react';

const FarmerSoilTestRequest = () => {
  // Sri Lankan districts
  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", 
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  // Time slots for selection
  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    preferredDate: '',
    preferredTime: '',
    district: '',
    address: '',
    landSize: '',
    crops: ''
  });

  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState(districts);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle district search
  const handleDistrictSearch = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      district: value
    });

    if (value.length > 0) {
      setShowDistrictDropdown(true);
      const filtered = districts.filter(district => 
        district.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDistricts(filtered);
    } else {
      setShowDistrictDropdown(false);
      setFilteredDistricts(districts);
    }
  };

  // Select a district
  const selectDistrict = (district) => {
    setFormData({
      ...formData,
      district: district
    });
    setShowDistrictDropdown(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Soil Test Request</h1>
          <p className="mt-2 text-lg text-gray-600">Request a professional soil analysis for your farm</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Farmer Details */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Farmer Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Date Picker Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Collection Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Time Selector Field - Added after date picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Collection Time</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select District</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.district}
                      onChange={handleDistrictSearch}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Search for your district"
                      required
                    />
                  </div>
                  {showDistrictDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredDistricts.map((district, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                          onClick={() => selectDistrict(district)}
                        >
                          {district}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter your full property address"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (Acres)</label>
                  <input
                    type="number"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter land size in acres"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Crops</label>
                  <input
                    type="text"
                    name="crops"
                    value={formData.crops}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What are you currently growing?"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Section - Billing Information */}
            <div className="w-full md:w-1/2 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Billing Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Soil Test Request - Payment</h3>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Basic Soil Test</span>
                    <span className="font-medium">LKR 1,500.00</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Nutrient Analysis</span>
                    <span className="font-medium">LKR 1,000.00</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Contamination Screening</span>
                    <span className="font-medium">LKR 0</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">LKR 500.00</span>
                  </div>
                  
                  <div className="flex justify-between py-3 mt-2 border-t border-gray-300">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-green-600">LKR 3000.00</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select payment method</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile">Mobile Payment</option>
                    <option value="cash">Cash on Collection</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                  >
                    Submit Request
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 mt-4">
                  <p>By submitting this form, you agree to our terms and conditions. Your soil test results will be available within 7-10 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerSoilTestRequest;