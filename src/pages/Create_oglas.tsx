import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataService } from "../services/dataService";
import { oglasService } from "../services/oglasService";
import { Grad, Kategorija, CreateOglasDto } from "../types";
import { toast } from "react-toastify";

const Create_oglas: React.FC = () => {
  const navigate = useNavigate();

  const [naslov, setNaslov] = useState("");
  const [opis, setOpis] = useState("");
  const [materijal, setMaterijal] = useState("");
  const [cena, setCena] = useState<number | "">("");
  const [mesto, setMesto] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [kategorijaId, setKategorijaId] = useState("");
  const [gradId, setGradId] = useState("");

  const [gradovi, setGradovi] = useState<Grad[]>([]);
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const apiKey = "4941e8d440ff9928482ecdda4e00cf0d";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradoviRes, kategorijeRes] = await Promise.all([
          dataService.getGradovi(),
          dataService.getKategorije(),
        ]);
        setGradovi(gradoviRes);
        setKategorije(kategorijeRes);
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Greška pri učitavanju podataka.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !naslov ||
      !opis ||
      !materijal ||
      !cena ||
      !mesto ||
      !kategorijaId ||
      !gradId
    ) {
      toast.error("Molimo popunite sva obavezna polja.");
      return;
    }

    setLoading(true);
    const newOglas: CreateOglasDto = {
      naslov,
      opis,
      materijal,
      cena: Number(cena),
      mesto,
      ImageUrls: imageUrls, // Changed to match backend DTO
      kategorija_Id: kategorijaId,
      grad_Id: gradId,
    };

    try {
      console.log("Sending oglas data:", newOglas); // Debug log
      const response = await oglasService.create(newOglas);
      console.log("Server response:", response); // Debug log
      toast.success("Oglas uspešno kreiran!");
      navigate("/oglasi");
    } catch (error) {
      console.error("Error creating oglas:", error); // Debug log
      toast.error("Greška prilikom kreiranja oglasa.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("image", file);

        console.log("Uploading file:", file.name); // Debug log

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        console.log("ImgBB response:", data); // Debug log

        if (data.success) {
          setImageUrls((prev) => [...prev, data.data.url]);
          toast.success("Slika uspešno dodata!");
        } else {
          console.error("ImgBB error:", data);
          toast.error(
            `Greška pri uploadu slike: ${
              data.error?.message || "Unknown error"
            }`
          );
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Greška pri konekciji sa imgbb.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Kreiraj novi oglas
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Naslov */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Naslov *
          </label>
          <input
            type="text"
            value={naslov}
            onChange={(e) => setNaslov(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Opis */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Opis *</label>
          <textarea
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            rows={4}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Materijal */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Materijal *
          </label>
          <input
            type="text"
            value={materijal}
            onChange={(e) => setMaterijal(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Cena */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Cena (RSD) *
          </label>
          <input
            type="number"
            value={cena}
            onChange={(e) =>
              setCena(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
            required
            min="0"
          />
        </div>

        {/* Mesto */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mesto *
          </label>
          <input
            type="text"
            value={mesto}
            onChange={(e) => setMesto(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Grad */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Grad *</label>
          <select
            value={gradId}
            onChange={(e) => setGradId(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">-- Izaberi grad --</option>
            {gradovi.map((grad) => (
              <option key={grad.id} value={grad.id}>
                {grad.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kategorija */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Kategorija *
          </label>
          <select
            value={kategorijaId}
            onChange={(e) => setKategorijaId(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">-- Izaberi kategoriju --</option>
            {kategorije.map((kat) => (
              <option key={kat.id} value={kat.id}>
                {kat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Slike */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Dodaj slike
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="mb-3"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-blue-600 text-sm mb-3">Uploading images...</p>
          )}
          <div className="flex flex-wrap gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Kreiranje..." : "Kreiraj oglas"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create_oglas;
