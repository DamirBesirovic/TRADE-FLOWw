import React, { useState } from "react";
import { authService } from "../../services/authService";
import { User, Seller } from "../../types";
import { toast } from "react-toastify";
import Button from "../UI/Button";
import Input from "../UI/Input";

interface EditProfileFormProps {
  user: User | Seller;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ime: user.ime,
    prezime: user.prezime,
    username: user.username,
    // Seller specific fields
    ...("imeFirme" in user && {
      imeFirme: user.imeFirme,
      bio: user.bio,
      phoneNumber: user.phoneNumber || "",
      pfpUrl: user.pfpUrl || "",
    }),
  });

  const isSeller = "imeFirme" in user;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSeller) {
        await authService.updateSellerProfile(formData);
      } else {
        await authService.updateUserProfile({
          ime: formData.ime,
          prezime: formData.prezime,
          username: formData.username,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Greška pri ažuriranju profila");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Ime"
          name="ime"
          value={formData.ime}
          onChange={handleChange}
          required
        />
        <Input
          label="Prezime"
          name="prezime"
          value={formData.prezime}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Email"
        name="username"
        type="email"
        value={formData.username}
        onChange={handleChange}
        required
      />

      {isSeller && (
        <>
          <Input
            label="Ime firme"
            name="imeFirme"
            value={formData.imeFirme}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio firme
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <Input
            label="Broj telefona"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <Input
            label="URL slike profila"
            name="pfpUrl"
            value={formData.pfpUrl}
            onChange={handleChange}
            helperText="URL do logoa vaše firme"
          />
        </>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Otkaži
        </Button>
        <Button type="submit" loading={loading}>
          Sačuvaj promene
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
