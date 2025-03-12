import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PlanNewTrip from "./components/new-trip/PlanNewTrip";
import TripDetails from "./components/edit-trip/TripDetails";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./Home";
import ProtectedRoute from "./components/ProtectedRoutes";
import ResetPassword from "./components/forgotpassword/ResetPassword";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import TripExpenses from "./components/expenses/TripExpenses";
import OwedShare from "./components/expenses/OwedShare"; // Import OwedShare
import UserHome from "./components/dashboard/UserHome";
import TripHistory from "./components/history/TripHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/plan-new-trip" element={<ProtectedRoute element={PlanNewTrip} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/trips/:tripId" element={<ProtectedRoute element={TripDetails} />} />
        <Route path="/trips/:tripId/expenses" element={<ProtectedRoute element={TripExpenses} />} />
        <Route path="/trips/:tripId/owed-share" element={<ProtectedRoute element={OwedShare} />} /> {/* New Route */}
        <Route path="/UserHome" element={<ProtectedRoute element={UserHome} />} />
        <Route path="/history" element={<ProtectedRoute element={TripHistory} />}/>
      </Routes>
    </Router>
  );
}

export default App;
