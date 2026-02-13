import React, { useEffect, useState } from "react";
import axios from "axios";

interface Oglas {
  id: string;
  naslov: string;
  opis: string;
  cena: number;
}

function Oglasi() {
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOglasi = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7277/api/Oglasi?page=1&pageSize=6"
        );
        setOglasi(response.data.items);
      } catch (error) {
        console.error("Greška prilikom dohvatanja oglasa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOglasi();
  }, []);

  if (loading) {
    return <p className="p-4">Učitavanje oglasa...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Svi oglasi</h1>
      {oglasi.length === 0 ? (
        <p>Nema dostupnih oglasa.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {oglasi.map((oglas) => (
            <div
              key={oglas.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <h2 className="text-lg font-semibold">{oglas.naslov}</h2>
              <p className="text-gray-600">{oglas.opis}</p>
              <p className="text-sm mt-2 text-gray-800 font-bold">
                {oglas.cena} RSD
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Oglasi;
