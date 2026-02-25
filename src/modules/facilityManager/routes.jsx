import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import FM_Dashboard from "./pages/FM_Dashboard";
import FM_Users from "./pages/FM_Users";
import FM_Recommendations from "./pages/FM_Recommendations";
import FM_Rooms from "./pages/FM_Rooms";
import FM_Reports from "./pages/FM_Reports";
import FM_Bookings from "./pages/FM_Bookings";
import FM_ComfortRules from "./pages/FM_ComfortRules";
import FM_Anomalies from "./pages/FM_Anomalies";
import FM_History from "./pages/FM_History";
import FM_Settings from "./pages/FM_Settings";
import FM_Feedback from "./pages/FM_Feedback";
export default function FacilityManagerRoutes() {
  return (
    <DashboardLayout role="Facility Manager">
      <Routes>
        <Route index element={<FM_Dashboard />} />
        <Route path="users" element={<FM_Users />} />
        <Route path="recommendations" element={<FM_Recommendations />} />
        <Route path="rooms" element={<FM_Rooms />} />
        <Route path="reports" element={<FM_Reports />} />
        <Route path="bookings" element={<FM_Bookings />} />
        <Route path="comfort-rules" element={<FM_ComfortRules />} /> 
        <Route path="Anomalies" element={<FM_Anomalies />} /> 
        <Route path="History" element={<FM_History />} /> 
        <Route path="Settings" element={<FM_Settings />} /> 
        <Route path="Feedback" element={<FM_Feedback/>} />
      </Routes>
    </DashboardLayout>
  );
}
