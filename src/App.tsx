import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Oglasi from "./pages/Oglasi";
import Create_oglas from "./pages/Create_oglas";
import Profile from "./pages/Profile";
import SellerInbox from "./pages/SellerInbox";
import EnhancedOglasi from "./pages/EnhancedOglasi";
import AdminPanel from "./pages/AdminPanel";
import OglasDetailsPage from "./pages/OglasDetailsPage";
import MyAdsPage from "./pages/MyAddsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/oglasi" element={<Oglasi />} /> */}
              <Route path="/my-ads" element={<MyAdsPage />} />
              <Route path="/oglasi/:id" element={<OglasDetailsPage />} />
              <Route path="/oglasi" element={<EnhancedOglasi />} />
              <Route path="/create-oglas" element={<Create_oglas />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/seller-inbox" element={<SellerInbox />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
