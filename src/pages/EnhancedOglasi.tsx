import React, { useEffect, useState } from "react";
import { oglasService } from "../services/oglasService";
import { Oglas } from "../types";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import SearchFilters from "../components/Oglasi/SearchFilters";
import OglasCard from "../components/Oglasi/OglasCard";
import Button from "../components/UI/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EnhancedOglasi: React.FC = () => {
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    kategorija: "",
    grad: "",
    minPrice: "",
    maxPrice: "",
  });

  const pageSize = 12;

  useEffect(() => {
    fetchOglasi();
  }, [currentPage, filters]);

  const fetchOglasi = async () => {
    setLoading(true);
    try {
      const response = await oglasService.getAll({
        page: currentPage,
        pageSize,
        search: filters.search || undefined,
        kategorija: filters.kategorija || undefined,
        grad: filters.grad || undefined,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      });

      setOglasi(response.items || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching oglasi:", error);
      toast.error("Greška pri učitavanju oglasa");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRateOglas = async (oglasId: string, rating: number) => {
    try {
      // You would implement the rating service here
      console.log("Rating oglas:", oglasId, "with", rating, "stars");
      toast.success("Ocena je zabeležena!");
    } catch (error) {
      console.error("Error rating oglas:", error);
      toast.error("Greška pri ocenjivanju");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Svi oglasi</h1>
          <p className="text-gray-600">
            Pronađite najbolje ponude za građevinski materijal
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters onFiltersChange={handleFiltersChange} />

        {loading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">Pronađeno oglasa</p>
            </div>

            {/* Oglasi Grid */}
            {oglasi.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <p className="text-xl font-semibold mb-2">Nema rezultata</p>
                  <p>Pokušajte sa drugim kriterijumima pretrage</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {oglasi.map((oglas) => (
                  <OglasCard
                    key={oglas.id}
                    oglas={oglas}
                    onRate={handleRateOglas}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prethodna</span>
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "primary" : "outline"
                        }
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10 h-10 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2"
                >
                  <span>Sledeća</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedOglasi;
