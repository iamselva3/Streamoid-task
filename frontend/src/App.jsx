// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MappingPage from "./Pages/MappingPage";
import SellerUploadPage from "./Pages/SellerUploadPage";
import MarketplaceUploadPage from "./Pages/MarketplaceUploadPage";
import MappingListPage from "./Pages/MappingList";
import HomePage from "./Pages/Home";
import NavBar from "./Pages/Nav";
import LoginPage from "./Pages/Loginpage"; // create if you haven't
import PrivateRoute from "./components/Privateroutes";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Routes>
        {/* public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* protected routes */}
        <Route
          path="/marketplace-upload"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <MarketplaceUploadPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller-upload"
          element={
            <PrivateRoute allowedRoles={["seller", "admin","superadmin"]}>
              <SellerUploadPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/mapping"
          element={
            <PrivateRoute allowedRoles={["seller", "admin", "superadmin"]}>
              <MappingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/mappings"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin", "seller"]}>
              <MappingListPage />
            </PrivateRoute>
          }
        />

        {/* redirect base to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
