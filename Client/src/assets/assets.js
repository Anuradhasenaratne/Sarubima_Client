import logo from "./logo-white.png";
import profilePic from "./profile_pic.png";

export const assets = {
  logo,
  profilePic,
};

// In your data file (e.g., data.js)
export const list = [
  {
    id: 1,
    testingId: "ST-2023-0876",
    date: "October 15, 2023",
    address: "123 Farm Road, Agricultural District",
    testedBy: "John Smith (AgriTech Labs)",
    collectedBy: "Robert Johnson (Field Agent)",
    ph: "6.8",
    sunlight: "Full Sun",
    moisture: "32%",
    soilMoisture: "45%",
    conductivity: "1.2 dS/m",
    woil: "0.45 mg/kg",
    other: "Moderate organic matter",
    recommendation: "Based on the soil analysis, we recommend planting wheat, barley, and legumes. The soil pH and conductivity levels are ideal for these crops. Consider adding nitrogen-rich fertilizer to optimize yield potential."
  },
  {
    id: 2,
    testingId: "ST-2023-0921",
    date: "November 3, 2023",
    address: "456 Harvest Lane, Farming District",
    testedBy: "Sarah Wilson (SoilCare Labs)",
    collectedBy: "Michael Brown (Field Agent)",
    ph: "7.2",
    sunlight: "Partial Sun",
    moisture: "28%",
    soilMoisture: "38%",
    conductivity: "0.8 dS/m",
    woil: "0.32 mg/kg",
    other: "Low organic matter, high clay content",
    recommendation: "Based on the soil analysis, we recommend planting corn and soybeans. Consider adding phosphorus and potassium fertilizers to improve soil quality and yield."
  },
  {
    id: 3,
    testingId: "ST-2023-1025",
    date: "December 5, 2023",
    address: "789 Orchard Street, Fruit Growing District",
    testedBy: "Emily Chen (SoilCare Labs)",
    collectedBy: "David Miller (Field Agent)",
    ph: "6.5",
    sunlight: "Full Sun",
    moisture: "35%",
    soilMoisture: "48%",
    conductivity: "1.5 dS/m",
    woil: "0.51 mg/kg",
    other: "High organic matter, sandy loam",
    recommendation: "Based on the soil analysis, we recommend planting fruits like strawberries and blueberries. The soil conditions are perfect for acid-loving plants."
  }
];
  