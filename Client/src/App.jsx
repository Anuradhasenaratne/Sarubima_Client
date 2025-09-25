import React from "react";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Footer from "./Components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Pages/Login";
import Test from "./Pages/Test";
import FR from "./Pages/FR";
import RequestList from "./Pages/RequestList";
import AdminPnale from "./admin/AdminPnale";
import AgentDashboard from "./Pages/AgentDashboard";
import LabDashboard from "./Pages/LabDashboard";
import FarmersList from "./admin/FarmersList";
import axios from "axios";
import FarmerDashboard from "./Pages/FarmerDashboard";
import { AdminRequest } from "./admin/AdminRequest";
import AdminUserController from "./admin/AdminUserController";
import DashboardSummary from "./admin/DashboardSummary";
import MonthlyRevenue from "./admin/MonthlyRevenue";



axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true; // Allow cookies to be sent with requests

const App = () => {
  const location = useLocation();

  // Hide Navbar & Footer for admin, agent, and lab dashboard paths
  const hideNavbarFooter = ["AdminPanel", "AgentDashboard", "LabDashboard","Login"].some(path =>
    location.pathname.includes(path)
  );

  return (
    <div>
      {!hideNavbarFooter && <Navbar />}

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Test" element={<Test />} />
          <Route path="/FR" element={<FR />} />
          <Route path="/RequestList" element={<RequestList />} />
          <Route path="/AdminPanel" element={<AdminPnale />} />
          <Route path="/AgentDashboard" element={<AgentDashboard />} />
          <Route path="/LabDashboard" element={<LabDashboard />} />
          <Route path="/FarmersList" element={<FarmersList />} />
          <Route path="/FarmerDashboard" element={<FarmerDashboard />} />
          <Route path="/AdminRequest" element={<AdminRequest />} />
          <Route path="/AdminUserController" element={<AdminUserController />} />
           <Route path="/DashboardSummary" element={<DashboardSummary />} />
           <Route path="/MonthlyRevenue" element={<MonthlyRevenue />} />
          

        </Routes>
      </div>

      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default App;
