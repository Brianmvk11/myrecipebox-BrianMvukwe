import { Routes, Route } from "react-router-dom";
import AuthTabs from "./components/AuthTabs";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import AISuggestions from "./pages/AISuggestions";
import Favorites from "./pages/Favorites";
import AddRecipe from "./pages/AddRecipe";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthTabs />} />
      <Route path="/home" element={<Home />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} /> 
      <Route path="/ai_suggestions" element={<AISuggestions />} /> 
      <Route path="/favorites" element={<Favorites />} /> 
      <Route path="/add_recipe" element={<AddRecipe />} /> 
    </Routes>
  );
}
