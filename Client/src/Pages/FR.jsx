import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const FarmerSoilTestRequest = () => {
  const navigate = useNavigate();

  // Sri Lankan districts
  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];

  // Time periods for selection
  const timePeriods = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  // Form state
  const [formData, setFormData] = useState({
    phone: "",
    preferredDate: "",
    preferredTime: "",
    district: "",
    address: "",
    landSize: "",
    landUnit: "",
    crops: "",
    paymentMethod: "cash",
  });

  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState(districts);
  const [submitted, setSubmitted] = useState(false);

  // Pricing information
  const soilTestingCost = 1500;
  const labAnalysisCost = 1500;
  const additionalCostPerUnit = 700;

  // Calculate costs based on land size
  const calculateCosts = () => {
    let landSqFt = 0;

    if (formData.landUnit === "acres" && formData.landSize) {
      landSqFt = parseFloat(formData.landSize) * 43560;
    } else if (formData.landUnit === "sqft" && formData.landSize) {
      landSqFt = parseFloat(formData.landSize);
    }

    if (landSqFt <= 0)
      return {
        subtotal: soilTestingCost + labAnalysisCost,
        total: soilTestingCost + labAnalysisCost,
        numberOfTests: 1,
        landSqFt: 0,
      };

    const numberOfTests = Math.ceil(landSqFt / 5000);
    const subtotal =
      soilTestingCost +
      labAnalysisCost +
      (numberOfTests - 1) * additionalCostPerUnit;
    const total = subtotal;

    return { subtotal, total, numberOfTests, landSqFt };
  };

  const costs = calculateCosts();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle district search
  const handleDistrictSearch = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      district: value,
    });

    if (value.length > 0) {
      setShowDistrictDropdown(true);
      const filtered = districts.filter((district) =>
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
      district: district,
    });
    setShowDistrictDropdown(false);
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      phone: "",
      preferredDate: "",
      preferredTime: "",
      district: "",
      address: "",
      landSize: "",
      landUnit: "acres",
      crops: "",
    });
    setSubmitted(false);
  };

  // Handle form submission
  const [requestId, setRequestId] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
          import.meta.env.VITE_API_URL +"/api/requests",
        formData,
        config
      );

      console.log("Request created:", data);
      setSubmitted(true);

      // Save request ID
      setRequestId(data._id || data.id); // adjust depending on your API response

      console.log("Request created:", data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error creating request:", error.response?.data || error);
      alert("There was an error submitting your request. Please try again.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // ---------- Header with Branding ----------
    doc.setFillColor(0, 128, 0); // green bar
    doc.rect(0, 0, pageWidth, 20, "F");

    doc.setFontSize(18);
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.text("SARUBIMA.LK", 14, 13, { align: "left" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Agricultural Solutions Provider", pageWidth - 14, 8, {
      align: "right",
    });
    doc.text("123 World Trade Center, Colombo, Sri Lanka", pageWidth - 14, 12, {
      align: "right",
    });
    doc.text("+94 123 456 7890 | contact@SARUBIMA.org", pageWidth - 14, 16, {
      align: "right",
    });

    y = 35;

    // ---------- Invoice Title ----------
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Soil Test Invoice", 14, y);
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y);
    y += 10;

    // ---------- Invoice Metadata ----------
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, y);
    doc.text(
      `Request ID: ${
        "ST-" + (requestId ? requestId.slice(-4).toUpperCase() : "N/A")
      }`,
      pageWidth - 14,
      y,
      { align: "right" }
    );
    y += 8;
    doc.text(`Customer Contact: ${formData.phone || "N/A"}`, 14, y);
    y += 14;

    // ---------- Order Details ----------
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 14, y);
    y += 6;
    doc.setLineWidth(0.2);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const items = [
      ["Soil Testing", soilTestingCost.toFixed(2)],
      ["Lab Analysis", labAnalysisCost.toFixed(2)],
    ];

    if (costs.numberOfTests > 1) {
      items.push([
        `Additional Tests (${
          costs.numberOfTests - 1
        } × ${additionalCostPerUnit})`,
        (additionalCostPerUnit * (costs.numberOfTests - 1)).toFixed(2),
      ]);
    }

    items.forEach(([label, price]) => {
      doc.text(label, 20, y);
      doc.text(price, pageWidth - 20, y, { align: "right" });
      y += 6;
    });

    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, y);
    doc.text(costs.total.toFixed(2), pageWidth - 20, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 16;

    y += 10;
doc.setFontSize(12);
doc.setFont("helvetica", "bold");
doc.text("Payment Method", 14, y);
y += 6;
doc.setFont("helvetica", "normal");

let paymentLabel = "N/A";
if (formData.paymentMethod === "card") {
  paymentLabel = "Credit/Debit Card (Pending)";
} else if (formData.paymentMethod === "cash") {
  paymentLabel = "Cash on Collection (Pending)";
}
doc.text(paymentLabel, 20, y);
y += 20;


    // ---------- Customer Information ----------
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 14, y);
    y += 6;
    doc.line(14, y, pageWidth - 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Phone: ${formData.phone || "N/A"}`, 20, y);
    doc.text(`District: ${formData.district || "N/A"}`, pageWidth - 20, y, {
      align: "right",
    });
    y += 6;

    doc.text(`Preferred Date: ${formData.preferredDate || "N/A"}`, 20, y);
    doc.text(
      `Preferred Time: ${formData.preferredTime || "N/A"}`,
      pageWidth - 20,
      y,
      { align: "right" }
    );
    y += 6;

    doc.text(
      `Land Size: ${
        formData.landSize ? `${formData.landSize} ${formData.landUnit}` : "N/A"
      }`,
      20,
      y
    );
    y += 6;
    doc.text(`Address: ${formData.address || "N/A"}`, 20, y);
    y += 6;
    doc.text(`Current Crops: ${formData.crops || "N/A"}`, 20, y);
    y += 20;

    // ---------- Footer ----------
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing SARUBIMA.LK", pageWidth / 2, y, {
      align: "center",
    });
    y += 5;
    doc.text(
      "For inquiries, contact +94 123 456 7890 | contact@SARUBIMA.org",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    // ---------- Save PDF ----------
    doc.save(`SoilTestInvoice_${formData.phone || "N/A"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            Soil Test Request
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Request a professional soil analysis for your farm
          </p>
        </div>

       

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Pricing Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Base test includes soil testing (LKR {soilTestingCost}) and
                  lab analysis (LKR {labAnalysisCost}) for up to 5000 sq.ft.
                </p>
                {/* <p>
                  Additional 5000 sq.ft increments cost LKR{" "}
                  {additionalCostPerUnit} each.
                </p> */}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Farmer Details */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Farmer Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                    disabled={submitted}
                  />
                </div>

                {/* Date Picker Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Collection Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={submitted}
                  />
                </div>

                {/* Time Period Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Collection Time
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={submitted}
                  >
                    <option value="">Select a time period</option>
                    {timePeriods.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select District
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.district}
                      onChange={handleDistrictSearch}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Search for your district"
                      required
                      disabled={submitted}
                    />
                  </div>
                  {showDistrictDropdown && !submitted && (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter your full property address"
                    required
                    disabled={submitted}
                  ></textarea>
                </div>

                {/* Land Size with Unit Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Size
                    </label>
                    <input
                      type="number"
                      name="landSize"
                       value={formData.landSize}
                       //value={5000}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter land size"
                      required
                      disabled={submitted}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      name="landUnit"
                      value={formData.landUnit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={submitted}
                    >

                       <option value="acres">Acres</option>
                       <option value="sqft">Square Feet</option>
                     
                     
                    </select>
                  </div>
                </div>

                {/* Land Size Information */}
                {formData.landSize && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      Your land size is approximately{" "}
                      {costs.landSqFt.toLocaleString()} sq.ft and requires{" "}
                      {costs.numberOfTests} soil test(s).
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Crops
                  </label>
                  <input
                    type="text"
                    name="crops"
                    value={formData.crops}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What are you currently growing?"
                    disabled={submitted}
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Billing Information */}
            <div className="w-full md:w-1/2 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Billing Information
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Soil Test Request - Payment
                  </h3>

                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Soil Testing</span>
                    <span className="font-medium">
                      LKR {soilTestingCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Lab Analysis</span>
                    <span className="font-medium">
                      LKR {labAnalysisCost.toFixed(2)}
                    </span>
                  </div>

                  {costs.numberOfTests > 1 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">
                        Additional Tests ({costs.numberOfTests - 1} ×{" "}
                        {additionalCostPerUnit})
                      </span>
                      <span className="font-medium">
                        LKR{" "}
                        {(
                          additionalCostPerUnit *
                          (costs.numberOfTests - 1)
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-3 mt-2 border-t border-gray-300">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      LKR {costs.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    name="paymentMethod"
                    value={formData.paymentMethod} // ✅ add this
                    onChange={handleInputChange}
                    disabled={submitted}
                  >
                    <option value="">Select payment method</option>
                    {/* <option value="card">Credit/Debit Card</option> */}

                    <option value="cash">Cash on Collection</option>
                  </select>
                </div>

                {!submitted ? (
                  <div className="pt-4">
                    <button
                      onClick={() => window.scrollTo(0, 0)}
                      type="submit"
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                    >
                      Submit Request
                    </button>
                  </div>
                ) : (
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={generatePDF}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center mb-4"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Invoice PDF
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                    >
                      Create Another Request
                    </button>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-4">
                  <p>
                    By submitting this form, you agree to our terms and
                    conditions. Your soil test results will be available within
                    7-10 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
 {/* Success Message */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Request Submitted Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your soil test request has been submitted. You can now
                    download your invoice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Hidden PDF Content */}
      </div>

    </div>
  );
};

export default FarmerSoilTestRequest;
