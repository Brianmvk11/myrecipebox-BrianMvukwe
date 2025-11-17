import { Routes, Route } from "react-router-dom";
import AuthTabs from "./components/AuthTabs";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthTabs />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
