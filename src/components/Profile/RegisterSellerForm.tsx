import React, { useState } from "react";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import Button from "../UI/Button";
import Input from "../UI/Input";

interface RegisterSellerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const RegisterSellerForm: React.FC<RegisterSellerFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imeFirme: "",
    bio: "",
    phoneNumber: "",
    pfpUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.imeFirme.trim()) {
      newErrors.imeFirme = "Ime firme je obavezno";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio je obavezan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.registerSeller(formData);
      onSuccess();
    } catch (error) {
      console.error("Error registering as seller:", error);
      toast.error("Greška pri registraciji kao prodavac");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Ime firme"
        name="imeFirme"
        value={formData.imeFirme}
        onChange={handleChange}
        error={errors.imeFirme}
        placeholder="Građevinska firma DOO"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio firme *
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.bio
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }`}
          placeholder="Opišite vašu firmu i usluge koje pružate..."
          required
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
        )}
      </div>

      <Input
        label="Broj telefona"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="+381 64 123 4567"
      />

      <Input
        label="URL slike profila"
        name="pfpUrl"
        value={formData.pfpUrl}
        onChange={handleChange}
        placeholder="https://example.com/logo.jpg"
        helperText="URL do logoa vaše firme"
      />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Otkaži
        </Button>
        <Button type="submit" loading={loading}>
          Registruj se kao prodavac
        </Button>
      </div>
    </form>
  );
};

export default RegisterSellerForm;
