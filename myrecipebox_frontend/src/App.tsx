import { Routes, Route } from "react-router-dom";
import AuthTabs from "./components/AuthTabs";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthTabs />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
