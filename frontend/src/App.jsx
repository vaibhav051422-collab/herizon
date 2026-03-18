import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signuppage";
import Dashboard from "./pages/Dashboard";
import ChildcareHub from "./components/Dashboard/ChildcareHub"; // Import zaroori hai

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* 🔥 Dashboard Nested Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Dashboard ke base path par kya dikhega (Overview) */}
          <Route index element={<div>{/* Overview Content */}</div>} /> 
          <Route path="childcare" element={<ChildcareHub />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;