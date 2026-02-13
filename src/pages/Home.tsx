import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Building2,
  Users,
  Shield,
  ArrowRight,
  Star,
  MapPin,
} from "lucide-react";
import { oglasService } from "../services/oglasService";
import { Oglas } from "../types";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Home: React.FC = () => {
  const [featuredOglasi, setFeaturedOglasi] = useState<Oglas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedOglasi = async () => {
      try {
        const response = await oglasService.getAll({ page: 1, pageSize: 6 });
        setFeaturedOglasi(response.items || []);
      } catch (error) {
        console.error("Error fetching featured oglasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedOglasi();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vaš partner za
              <span className="block text-blue-200">građevinski materijal</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Pronađite najbolje ponude za građevinski materijal u Srbiji.
              Povezujemo kupce i prodavce za uspešno poslovanje.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/oglasi"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Search className="mr-2 h-5 w-5" />
                Pretraži oglase
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Registruj se
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zašto izabrati OTSupply?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pružamo sigurnu i efikasnu platformu za trgovinu građevinskim
              materijalom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Širok asortiman
              </h3>
              <p className="text-gray-600">
                Pronađite sve što vam je potrebno za vaš građevinski projekat -
                od osnovnih materijala do specijalizovane opreme.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Provereni prodavci
              </h3>
              <p className="text-gray-600">
                Svi naši prodavci prolaze proces verifikacije kako biste mogli
                da kupujete sa poverenjem.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sigurna kupovina
              </h3>
              <p className="text-gray-600">
                Vaša sigurnost je naš prioritet. Koristimo najnovije tehnologije
                za zaštitu vaših podataka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Oglasi Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Najnoviji oglasi
            </h2>
            <p className="text-xl text-gray-600">
              Pogledajte najnovije ponude naših prodavaca
            </p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredOglasi.map((oglas) => (
                <div
                  key={oglas.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {oglas.imageUrls.length > 0 && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={oglas.imageUrls[0]}
                        alt={oglas.naslov}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400";
                        }}
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 font-medium">
                        {oglas.kategorija}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {oglas.grad}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {oglas.naslov}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {oglas.opis}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-lg font-bold text-green-600">
                        {oglas.cena.toLocaleString() + " RSD"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {oglas.prodavac}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/oglasi"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pogledaj sve oglase
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Spremni da počnete?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Pridružite se hiljadama zadovoljnih korisnika na OTSupply platformi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Registruj se kao kupac
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Postani prodavac
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
