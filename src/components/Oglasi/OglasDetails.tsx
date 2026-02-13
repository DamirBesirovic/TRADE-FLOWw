import React, { useState } from "react";
import { useEffect } from "react";
import { MapPin, Building2, Phone, Mail, Send } from "lucide-react";
import { Oglas, Grad } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { zahtevService } from "../../services/zahtevService";
import { gradService } from "../../services/gradService";
import { toast } from "react-toastify";
import Button from "../UI/Button";
import Input from "../UI/Input";
import ImageCarousel from "../UI/ImageCarousel";

interface OglasDetailsProps {
  oglas: Oglas;
  onClose: () => void;
}

const OglasDetails: React.FC<OglasDetailsProps> = ({ oglas, onClose }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gradovi, setGradovi] = useState<Grad[]>([]);
  const [loadingGradovi, setLoadingGradovi] = useState(false);
  const [requestData, setRequestData] = useState({
    kolicina: 1,
    poruka: "",
    telefon: "",
    gradId: "",
  });

  useEffect(() => {
    if (showRequestForm) {
      fetchGradovi();
    }
  }, [showRequestForm]);

  const fetchGradovi = async () => {
    setLoadingGradovi(true);
    try {
      const data = await gradService.getAll();
      setGradovi(data);
    } catch (error) {
      console.error("Error fetching gradovi:", error);
      toast.error("Greška pri učitavanju gradova");
    } finally {
      setLoadingGradovi(false);
    }
  };

  const handleRequestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await zahtevService.createZahtev({
        oglasId: oglas.id,
        gradId: requestData.gradId || oglas.gradId, // Use buyer's selected grad or oglas grad as fallback
        kolicina: requestData.kolicina,
        poruka: requestData.poruka,
        telefon: requestData.telefon,
      });

      toast.success("Zahtev je uspešno poslat!");
      setShowRequestForm(false);
      onClose();
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Greška pri slanju zahteva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Images Carousel */}
      {oglas.imageUrls.length > 0 && (
        <div className="mb-6">
          <ImageCarousel images={oglas.imageUrls} alt={oglas.naslov} />
        </div>
      )}

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {oglas.kategorija}
              </span>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {oglas.grad}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {oglas.naslov}
            </h1>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">{oglas.opis}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Detalji proizvoda
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Materijal:</span>
                  <p className="font-medium">{oglas.materijal}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Lokacija:</span>
                  <p className="font-medium">{oglas.mesto}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Price */}
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 flex items-center justify-center">
              {oglas.cena.toLocaleString()} RSD
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Prodavac
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{oglas.prodavac}</p>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                Kontakt putem zahteva
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isAuthenticated && !hasRole("Seller") && (
            <div className="space-y-3">
              {!showRequestForm ? (
                <Button
                  onClick={() => setShowRequestForm(true)}
                  className="w-full flex items-center justify-center space-x-2"
                  size="lg"
                >
                  <Send className="h-5 w-5" />
                  <span>Pošalji zahtev</span>
                </Button>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold">Pošaljite zahtev prodavcu:</h4>
                  <form onSubmit={handleSendRequest} className="space-y-4">
                    <Input
                      label="Količina"
                      type="number"
                      name="kolicina"
                      value={requestData.kolicina}
                      onChange={handleRequestChange}
                      min="1"
                      required
                    />
                    <Input
                      label="Vaš broj telefona"
                      type="tel"
                      name="telefon"
                      value={requestData.telefon}
                      onChange={handleRequestChange}
                      placeholder="+381 11 123 4567"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vaš grad
                      </label>
                      <select
                        name="gradId"
                        value={requestData.gradId}
                        onChange={handleSelectChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loadingGradovi}
                      >
                        <option value="">Izaberite grad</option>
                        {gradovi.map((grad) => (
                          <option key={grad.id} value={grad.id}>
                            {grad.name}
                          </option>
                        ))}
                      </select>
                      {loadingGradovi && (
                        <p className="text-sm text-gray-500 mt-1">
                          Učitavanje gradova...
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Poruka
                      </label>
                      <textarea
                        name="poruka"
                        value={requestData.poruka}
                        onChange={handleRequestChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dodatne informacije o zahtevu..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRequestForm(false)}
                        className="flex-1"
                      >
                        Otkaži
                      </Button>
                      <Button
                        type="submit"
                        loading={loading}
                        className="flex-1"
                      >
                        Pošalji
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Prijavite se da biste mogli da pošaljete zahtev prodavcu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OglasDetails;
