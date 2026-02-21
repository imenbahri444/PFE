import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import FM_Dashboard from "./pages/FM_Dashboard";
import FM_Users from "./pages/FM_Users";
import FM_Recommendations from "./pages/FM_Recommendations";
import FM_Rooms from "./pages/FM_Rooms";
import FM_Reports from "./pages/FM_Reports";
import FM_Bookings from "./pages/FM_Bookings";
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

      </Routes>
    </DashboardLayout>
  );
}
