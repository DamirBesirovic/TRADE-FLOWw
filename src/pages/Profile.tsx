import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { User, Seller, ChangePasswordDto } from "../types";
import { toast } from "react-toastify";
import {
  Edit,
  Building2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  UserPlus,
  Trash2,
  Lock,
} from "lucide-react";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import EditProfileForm from "../components/Profile/EditPorfileForm";
import RegisterSellerForm from "../components/Profile/RegisterSellerForm";
import DeleteAccountModal from "../components/Profile/DeleteAccountModal";
import ChangePasswordForm from "../components/Profile/ChangePasswordForm";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Profile: React.FC = () => {
  const { user: authUser, hasRole, dispatch } = useAuth();
  const [user, setUser] = useState<User | Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sellerRegisterOpen, setSellerRegisterOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profileData = await authService.getUserProfile();
      setUser(profileData);
      dispatch({ type: "SET_USER", payload: profileData });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Greška pri učitavanju profila");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    setEditModalOpen(false);
    fetchUserProfile();
    toast.success("Profil uspešno ažuriran");
  };

  const handleSellerRegistration = () => {
    setSellerRegisterOpen(false);
    fetchUserProfile();
    toast.success("Uspešno registrovani kao prodavac");
  };

  const handlePasswordChange = async (passwordData: ChangePasswordDto) => {
    setPasswordLoading(true);
    try {
      await authService.changePassword(passwordData);
      toast.success("Lozinka je uspešno promenjena");
      setChangePasswordModalOpen(false);
    } catch (error: any) {
      console.error("Error changing password:", error);

      // Handle specific error messages from backend
      if (error.response?.data?.errors) {
        // Handle validation errors array
        const errorMessages = error.response.data.errors
          .map((err: any) => err.description || err)
          .join(", ");
        toast.error(`Greška: ${errorMessages}`);
      } else if (error.response?.data) {
        // Handle single error message
        toast.error(
          typeof error.response.data === "string"
            ? error.response.data
            : "Greška pri promeni lozinke"
        );
      } else {
        toast.error("Greška pri promeni lozinke");
      }
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordChangeSuccess = () => {
    setChangePasswordModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Greška pri učitavanju profila
          </h2>
          <p className="text-gray-600 mt-2">Pokušajte ponovo kasnije</p>
        </div>
      </div>
    );
  }

  const isSeller = hasRole("Seller");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  {isSeller && (user as Seller).pfpUrl ? (
                    <img
                      src={(user as Seller).pfpUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">
                    {user.ime} {user.prezime}
                  </h1>
                  {isSeller && (
                    <p className="text-blue-200 text-lg mt-1">
                      {(user as Seller).imeFirme}
                    </p>
                  )}
                  <div className="flex items-center mt-2 space-x-4">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setEditModalOpen(true)}
                  variant="secondary"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Uredi profil
                </Button>

                <Button
                  onClick={() => setChangePasswordModalOpen(true)}
                  variant="secondary"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Promeni lozinku
                </Button>

                {!isSeller && (
                  <Button
                    onClick={() => setSellerRegisterOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Postani prodavac
                  </Button>
                )}

                {isSeller && (
                  <>
                    <Button
                      onClick={() => (window.location.href = "/my-ads")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Moji oglasi
                    </Button>

                    <Button
                      onClick={() => (window.location.href = "/seller-inbox")}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Inbox zahtevi
                    </Button>
                  </>
                )}

                {/* Dugme za brisanje naloga */}
                <Button
                  onClick={() => setDeleteModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Obriši nalog
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Osnovne informacije
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{user.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      Član od:{" "}
                      {new Date(user.datumRegistracije).toLocaleDateString(
                        "sr-RS"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              {isSeller && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informacije o firmi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Ime firme
                      </label>
                      <p className="text-gray-900">
                        {(user as Seller).imeFirme}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Bio
                      </label>
                      <p className="text-gray-900">{(user as Seller).bio}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-600">
                        {/* Ocena: {(user as Seller).ocena.toFixed(1)} / 5.0 */}
                      </span>
                    </div>
                    {(user as Seller).isVerified && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">
                          Verifikovano
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Uredi profil"
        size="lg"
      >
        <EditProfileForm
          user={user}
          onSuccess={handleProfileUpdate}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        title="Promena lozinke"
        size="md"
      >
        <ChangePasswordForm
          onSuccess={handlePasswordChangeSuccess}
          onCancel={() => setChangePasswordModalOpen(false)}
          onSubmit={handlePasswordChange}
          isLoading={passwordLoading}
        />
      </Modal>

      {/* Register as Seller Modal */}
      <Modal
        isOpen={sellerRegisterOpen}
        onClose={() => setSellerRegisterOpen(false)}
        title="Registracija kao prodavac"
        size="lg"
      >
        <RegisterSellerForm
          onSuccess={handleSellerRegistration}
          onCancel={() => setSellerRegisterOpen(false)}
        />
      </Modal>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          try {
            await authService.deleteAccount();
            toast.success("Nalog uspešno obrisan");
            dispatch({ type: "LOGOUT" });
            window.location.href = "/"; // redirect na home ili login
          } catch (error) {
            toast.error("Greška pri brisanju naloga");
            console.error(error);
          } finally {
            setDeleteModalOpen(false);
          }
        }}
      />
    </div>
  );
};

export default Profile;
