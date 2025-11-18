import { Routes, Route } from "react-router-dom";
import AuthTabs from "./components/AuthTabs";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthTabs />} />
      <Route path="/home" element={<Home />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} /> 
    </Routes>
  );
}
