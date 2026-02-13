import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { zahtevService } from "../services/zahtevService";
import { oglasService } from "../services/oglasService";
import { Zahtev } from "../types";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Check,
  Eye,
  ExternalLink,
  Package,
} from "lucide-react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";

const SellerInbox: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [zahtevi, setZahtevi] = useState<Zahtev[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZahtev, setSelectedZahtev] = useState<Zahtev | null>(null);
  const [loadingOglas, setLoadingOglas] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    if (hasRole("Seller")) {
      fetchZahtevi();
    }
  }, [hasRole, currentPage, filter]);

  const fetchZahtevi = async () => {
    setLoading(true);
    try {
      const procitano = filter === "all" ? null : filter === "read";
      const response = await zahtevService.getZahteviForSeller(
        currentPage,
        pageSize,
        procitano
      );
      setZahtevi(response.items || []);
      setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
    } catch (error) {
      console.error("Error fetching zahtevi:", error);
      toast.error("Greška pri učitavanju zahteva");
    } finally {
      setLoading(false);
    }
  };

  const fetchOglasForZahtev = async (zahtev: Zahtev) => {
    if (zahtev.oglas) return; // Already loaded

    setLoadingOglas(true);
    try {
      const oglas = await oglasService.getById(zahtev.oglas_Id);
      setSelectedZahtev((prev) =>
        prev
          ? {
              ...prev,
              oglas: {
                id: oglas.id,
                naslov: oglas.naslov,
                materijal: oglas.materijal,
                cena: oglas.cena,
                kategorija: oglas.kategorija,
              },
            }
          : null
      );
    } catch (error) {
      console.error("Error fetching oglas:", error);
      toast.error("Greška pri učitavanju oglasa");
    } finally {
      setLoadingOglas(false);
    }
  };

  const handleMarkAsRead = async (zahtevId: string) => {
    try {
      await zahtevService.markAsRead(zahtevId);
      setZahtevi((prev) =>
        prev.map((z) => (z.id === zahtevId ? { ...z, procitano: true } : z))
      );
      toast.success("Zahtev označen kao pročitan");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Greška pri označavanju zahteva");
    }
  };

  const handleViewDetails = (zahtev: Zahtev) => {
    setSelectedZahtev(zahtev);
    if (!zahtev.procitano) {
      handleMarkAsRead(zahtev.id);
    }
    // Fetch oglas details when viewing
    fetchOglasForZahtev(zahtev);
  };

  const handleViewOglas = (oglasId: string) => {
    try {
      // Close the modal first
      setSelectedZahtev(null);

      // Navigate to the oglas details page
      navigate(`/oglasi/${oglasId}`);

      // Optional success message
      toast.success("Preusmeravanje na oglas...");
    } catch (error) {
      console.error("Error navigating to oglas:", error);
      toast.error("Greška pri otvaranju oglasa");
    }
  };

  if (!hasRole("Seller")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Pristup odbačen
          </h2>
          <p className="text-gray-600 mt-2">
            Morate biti registrovani kao prodavac da pristupite ovoj stranici
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Inbox - Zahtevi kupaca
          </h1>
          <p className="text-gray-600">
            Pregledajte i upravljajte zahtevima koje su vam poslali kupci
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
            >
              Svi zahtevi
            </Button>
            <Button
              variant={filter === "unread" ? "primary" : "outline"}
              onClick={() => {
                setFilter("unread");
                setCurrentPage(1);
              }}
            >
              Nepročitani
            </Button>
            <Button
              variant={filter === "read" ? "primary" : "outline"}
              onClick={() => {
                setFilter("read");
                setCurrentPage(1);
              }}
            >
              Pročitani
            </Button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : (
          <>
            {/* Zahtevi List */}
            {zahtevi.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nema zahteva
                </h3>
                <p className="text-gray-600">
                  {filter === "all"
                    ? "Još uvek niste primili zahteve od kupaca"
                    : `Nema ${
                        filter === "unread" ? "nepročitanih" : "pročitanih"
                      } zahteva`}
                </p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {zahtevi.map((zahtev) => (
                  <div
                    key={zahtev.id}
                    className={`bg-white rounded-lg shadow-sm border-l-4 ${
                      zahtev.procitano ? "border-gray-300" : "border-blue-500"
                    } p-6 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center space-x-4 mb-3">
                          {!zahtev.procitano && (
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(zahtev.poslatoVreme).toLocaleString(
                              "sr-RS"
                            )}
                          </div>
                          <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            <Package className="h-4 w-4 mr-1" />
                            <span></span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              <span className="font-medium">
                                {zahtev.telefon}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Količina:</strong> {zahtev.kolicina}
                            </div>
                          </div>
                          <div>
                            {zahtev.poruka && (
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  Poruka:
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {zahtev.poruka}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleViewDetails(zahtev)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Detaljnije</span>
                        </Button>
                        {!zahtev.procitano && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(zahtev.id)}
                            className="flex items-center space-x-1"
                          >
                            <Check className="h-4 w-4" />
                            <span>Označi kao pročitan</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
            )}
          </>
        )}

        {/* Details Modal */}
        <Modal
          isOpen={!!selectedZahtev}
          onClose={() => setSelectedZahtev(null)}
          title="Detalji zahteva"
          size="lg"
        >
          {selectedZahtev && (
            <div className="space-y-6">
              {/* Oglas Info */}
              {selectedZahtev.oglas ? (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-blue-600" />
                      Oglas za koji je poslat zahtev
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOglas(selectedZahtev.oglas!.id)}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Otvori oglas</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedZahtev.oglas.naslov}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedZahtev.oglas.kategorija}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Materijal: {selectedZahtev.oglas.materijal}
                      </p>
                      <div className="flex items-center text-green-600 font-semibold">
                        {selectedZahtev.oglas.cena.toLocaleString()} RSD
                      </div>
                    </div>
                  </div>
                </div>
              ) : loadingOglas ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <LoadingSpinner size="sm" />
                  <p className="text-sm text-gray-600 mt-2">
                    Učitavanje informacija o oglasu...
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Informacije o oglasu nisu dostupne
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Kontakt informacije
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{selectedZahtev.telefon}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Poslato:{" "}
                  {new Date(selectedZahtev.poslatoVreme).toLocaleString(
                    "sr-RS"
                  )}
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Detalji zahteva
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Količina
                    </label>
                    <p className="text-lg font-semibold">
                      {selectedZahtev.kolicina}
                    </p>
                  </div>
                </div>

                {selectedZahtev.poruka && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Poruka kupca
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900">{selectedZahtev.poruka}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SellerInbox;
