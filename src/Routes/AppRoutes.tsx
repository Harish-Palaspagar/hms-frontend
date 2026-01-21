import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import PatientDashboard from "../Layout/PatientDashboard";
import DoctorDashboard from "../Layout/DoctorDashboard";
import PublicRoute from "./PublicRoute";
import Random from "../Components/Random/Random";
import PatientProfilePage from "../Pages/Patient/PatientProfilePage";
import DoctorProfilePage from "../Pages/Doctor/DoctorProfilePage";
import PatientAppointmentPage from "../Pages/Patient/PatientAppointmentPage";
import DoctorAppointmentPage from "../Pages/Doctor/DoctorAppointmentPage";
import DoctorAppointmentDetailsPage from "../Pages/Doctor/DoctorAppointmentDetaislPage";
import NotFoundPage from "../Pages/NotFoundPage";
import MedicinePage from "../Pages/Admin/AdminMedicinePage";
import AdminMedicinePage from "../Pages/Admin/AdminMedicinePage";
import AdminInventory from "../Pages/Admin/AdminInventory";
import AdminSalesPage from "../Pages/Admin/AdminSalesPage";
import AdminPatientPage from "../Pages/Admin/AdminPatientPage";
import AdminDoctorPage from "../Pages/Admin/AdminDoctorPage";
import AdminDashboardPage from "../Pages/Admin/AdminDashboardPage";
import DoctorDashboardPage from "../Pages/Doctor/DoctorDashboardPage";
import PatientDashboardPage from "../Pages/Patient/PatientDashboardPage";
import DoctorPatientsPage from "../Pages/Doctor/DoctorPatientsPage";
import DoctorPharmacyPage from "../Pages/Doctor/DoctorPharmacyPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="medicine" element={<AdminMedicinePage />} />
          <Route path="doctors" element={<AdminDoctorPage />} />
          <Route path="appointments" element={<Random />} />
          <Route path="patients" element={<AdminPatientPage />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="sales" element={<AdminSalesPage />} />
        </Route>
        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboardPage />} />
          <Route path="patients" element={<DoctorPatientsPage />} />
          <Route path="pharmacy" element={<DoctorPharmacyPage />} />
          <Route path="profile" element={<DoctorProfilePage />} />
          <Route path="appointments" element={<DoctorAppointmentPage />} />
          <Route
            path="appointments/:id"
            element={<DoctorAppointmentDetailsPage />}
          />

          <Route path="patients" element={<Random />} />
        </Route>
        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="dashboard" element={<PatientDashboardPage />} />
          <Route path="appointments" element={<PatientAppointmentPage />} />
          <Route path="book" element={<Random />} />
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
