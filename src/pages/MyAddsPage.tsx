import React, { useEffect, useState } from "react";
import { oglasService } from "../services/oglasService";
import { Oglas } from "../types";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import OglasCard from "../components/Oglasi/OglasCard";
import { toast } from "react-toastify";

const MyAdsPage: React.FC = () => {
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const response = await oglasService.getMyAds();
      setOglasi(response.items); // API vraća { items: [...] }
    } catch (error) {
      console.error("Greška pri učitavanju mojih oglasa:", error);
      toast.error("Greška pri učitavanju mojih oglasa");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOglas = async (oglasId: string) => {
    setDeletingId(oglasId);
    try {
      await oglasService.delete(oglasId);
      setOglasi((prevOglasi) =>
        prevOglasi.filter((oglas) => oglas.id !== oglasId)
      );
      toast.success("Oglas je uspešno obrisan");
    } catch (error) {
      console.error("Greška pri brisanju oglasa:", error);
      toast.error("Greška pri brisanju oglasa");
    } finally {
      setDeletingId(undefined);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Moji oglasi</h1>
        <div className="text-sm text-gray-600">
          {oglasi.length} {oglasi.length === 1 ? "oglas" : "oglasa"}
        </div>
      </div>

      {oglasi.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nemate objavljenih oglasa
            </h3>
            <p className="text-gray-600 mb-6">
              Počnite sa objavljivanjem vašeg prvog oglasa da biste započeli
              prodaju građevinske robe.
            </p>
            <button
              onClick={() => (window.location.href = "/create-oglas")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Objavi prvi oglas
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {oglasi.map((oglas) => (
            <div key={oglas.id} className="group">
              <OglasCard
                oglas={oglas}
                showDeleteButton={true}
                onDelete={handleDeleteOglas}
                deletingId={deletingId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAdsPage;
