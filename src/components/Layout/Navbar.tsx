import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Building2,
  User,
  LogOut,
  Settings,
  Plus,
  Home,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Uspešno ste se odjavili");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TRADE-FLOW</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Početna</span>
            </Link>
            <Link
              to="/oglasi"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Oglasi</span>
            </Link>

            {isAuthenticated && hasRole("Seller") && (
              <Link
                to="/create-oglas"
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Novi oglas</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Dobrodošli, {user?.ime || "Korisnik"}
                </span>

                <div className="flex items-center space-x-2">
                  <Link
                    to="/profil"
                    className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Profil"
                  >
                    <User className="h-5 w-5" />
                  </Link>

                  {hasRole("Admin") && (
                    <Link
                      to="/admin"
                      className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Admin panel"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Odjavi se"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Prijavi se
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Registruj se
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-3 space-y-2">
          <Link
            to="/"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Početna
          </Link>
          <Link
            to="/oglasi"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Oglasi
          </Link>
          {isAuthenticated && hasRole("Seller") && (
            <>
              <Link
                to="/create-oglas"
                className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Novi oglas
              </Link>
              <Link
                to="/inbox"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Inbox
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
