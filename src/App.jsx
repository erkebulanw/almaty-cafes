import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import CafeDetailPage from "./pages/CafeDetailPage.jsx";
import AddCafePage from "./pages/AddCafePage.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cafe/:id" element={<CafeDetailPage />} />
          <Route path="/add" element={<AddCafePage />} />
          <Route path="*" element={<p className="state">Page not found. Go back to the list of cafés.</p>} />
        </Routes>
      </main>
    </>
  );
}