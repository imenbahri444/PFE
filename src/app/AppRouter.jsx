import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FacilityManagerRoutes from "../modules/facilityManager/routes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/fm" />} />
        <Route path="/fm/*" element={<FacilityManagerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
