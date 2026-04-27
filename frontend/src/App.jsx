import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Collection from "./pages/Collection";
import RecipeDetail from "./pages/RecipeDetail";
import Profile from "./pages/Profile";
import Kitchen from "./pages/Kitchen";
import Cookbook from "./pages/Cookbook";
import RecipeForm from "./pages/RecipeForm";
import Contact from "./pages/Contact";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/cookbook" element={<Cookbook />} />
            <Route path="/recipe/new" element={<RecipeForm />} />
            <Route path="/recipe/:id/edit" element={<RecipeForm />} />
          </Route>
        </Routes>
        <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
