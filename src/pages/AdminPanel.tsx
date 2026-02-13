import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Users, MapPin, Tag, BarChart3 } from "lucide-react";
import UserManagement from "../components/Admin/UserManagement";
import GradoviManagement from "../components/Admin/GradoviManagement";
import KategorijeManagement from "../components/Admin/KategorijeManagement";
import { dataService } from "../services/dataService";

type ActiveTab = "dashboard" | "users" | "gradovi" | "kategorije";

interface DashboardStats {
  usersCount: number;
  gradoviCount: number;
  kategorijeCount: number;
  loading: boolean;
}

const AdminPanel: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [stats, setStats] = useState<DashboardStats>({
    usersCount: 0,
    gradoviCount: 0,
    kategorijeCount: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true }));

        const [users, gradovi, kategorije] = await Promise.all([
          dataService.getUsers(),
          dataService.getGradovi(),
          dataService.getKategorije(),
        ]);

        setStats({
          usersCount: users.length,
          gradoviCount: gradovi.length,
          kategorijeCount: kategorije.length,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    if (hasRole("Admin") && activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [hasRole, activeTab]);

  if (!hasRole("Admin")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Pristup odbačen
          </h2>
          <p className="text-gray-600 mt-2">
            Morate biti administrator da pristupite ovoj stranici
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard" as const, name: "Dashboard", icon: BarChart3 },
    { id: "users" as const, name: "Korisnici", icon: Users },
    { id: "gradovi" as const, name: "Gradovi", icon: MapPin },
    { id: "kategorije" as const, name: "Kategorije", icon: Tag },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Ukupno korisnika</p>
                    <p className="text-2xl font-bold">
                      {stats.loading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats.usersCount
                      )}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Ukupno gradova</p>
                    <p className="text-2xl font-bold">
                      {stats.loading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats.gradoviCount
                      )}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Ukupno kategorija</p>
                    <p className="text-2xl font-bold">
                      {stats.loading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats.kategorijeCount
                      )}
                    </p>
                  </div>
                  <Tag className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dobrodošli u Admin panel
              </h3>
              <p className="text-gray-600">
                Izaberite tab za upravljanje određenim delom sistema.
              </p>
            </div>
          </div>
        );
      case "users":
        return <UserManagement />;
      case "gradovi":
        return <GradoviManagement />;
      case "kategorije":
        return <KategorijeManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
