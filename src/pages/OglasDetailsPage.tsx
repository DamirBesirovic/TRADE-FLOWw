import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { oglasService } from "../services/oglasService";
import { Oglas } from "../types";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";
import OglasDetails from "../components/Oglasi/OglasDetails";

const OglasDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [oglas, setOglas] = useState<Oglas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOglas(id);
    }
  }, [id]);

  const fetchOglas = async (oglasId: string) => {
    setLoading(true);
    try {
      const data = await oglasService.getById(oglasId);
      setOglas(data);
    } catch (error) {
      console.error("Error fetching oglas:", error);
      toast.error("Greška pri učitavanju oglasa");
      navigate("/oglasi");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/oglasi");
  };

  const handleBackToList = () => {
    navigate("/seller-inbox");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!oglas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oglas nije pronađen
          </h2>
          <p className="text-gray-600 mb-4">
            Oglas koji tražite ne postoji ili je uklonjen.
          </p>
          <Button onClick={handleBackToList}>Nazad u inbox</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Nazad u inbox</span>
          </Button>
        </div>

        {/* Oglas Details Component */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <OglasDetails oglas={oglas} onClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default OglasDetailsPage;
