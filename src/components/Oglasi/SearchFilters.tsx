import React, { useEffect, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { dataService } from "../../services/dataService";
import { Grad, Kategorija } from "../../types";
import Input from "../UI/Input";
import Button from "../UI/Button";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    kategorija: string;
    grad: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    kategorija: "",
    grad: "",
    minPrice: "",
    maxPrice: "",
  });
  const [gradovi, setGradovi] = useState<Grad[]>([]);
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gradoviData, kategorijeData] = await Promise.all([
        dataService.getGradovi(),
        dataService.getKategorije(),
      ]);
      setGradovi(gradoviData);
      setKategorije(kategorijeData);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      kategorija: "",
      grad: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Pretražite oglase..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filteri</span>
        </Button>

        {(filters.kategorija ||
          filters.grad ||
          filters.minPrice ||
          filters.maxPrice) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            <span>Očisti filtere</span>
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Kategorija */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategorija
            </label>
            <select
              value={filters.kategorija}
              onChange={(e) => handleFilterChange("kategorija", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sve kategorije</option>
              {kategorije.map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Grad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grad
            </label>
            <select
              value={filters.grad}
              onChange={(e) => handleFilterChange("grad", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Svi gradovi</option>
              {gradovi.map((grad) => (
                <option key={grad.id} value={grad.id}>
                  {grad.name}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min. cena (RSD)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max. cena (RSD)
            </label>
            <input
              type="number"
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
