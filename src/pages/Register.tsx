import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Building2, Eye, EyeOff, User, Store } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Register: React.FC = () => {
  const [step, setStep] = useState<'type' | 'user' | 'seller'>('type');
  const [userType, setUserType] = useState<'user' | 'seller'>('user');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    ime: '',
    prezime: '',
    // Seller specific
    bio: '',
    imeFirme: '',
    phoneNumber: '',
    pfpUrl: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateUserForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      newErrors.username = 'Unesite valjan email';
    }

    if (!formData.password) {
      newErrors.password = 'Lozinka je obavezna';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lozinka mora imati najmanje 6 karaktera';
    }

    if (!formData.ime.trim()) {
      newErrors.ime = 'Ime je obavezno';
    }

    if (!formData.prezime.trim()) {
      newErrors.prezime = 'Prezime je obavezno';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSellerForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio je obavezan';
    }

    if (!formData.imeFirme.trim()) {
      newErrors.imeFirme = 'Ime firme je obavezno';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUserForm()) return;

    setLoading(true);
    try {
      await authService.register({
        username: formData.username,
        password: formData.password,
        ime: formData.ime,
        prezime: formData.prezime
      });

      if (userType === 'seller') {
        setStep('seller');
      } else {
        toast.success('Uspešno ste se registrovali!');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data || 'Greška pri registraciji');
    } finally {
      setLoading(false);
    }
  };

  const handleSellerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSellerForm()) return;

    setLoading(true);
    try {
      // First login to get token
      await authService.login({
        username: formData.username,
        password: formData.password
      });

      // Then register as seller
      await authService.registerSeller({
        bio: formData.bio,
        imeFirme: formData.imeFirme,
        phoneNumber: formData.phoneNumber,
        pfpUrl: formData.pfpUrl
      });

      toast.success('Uspešno ste se registrovali kao prodavac!');
      navigate('/login');
    } catch (error: any) {
      console.error('Seller registration error:', error);
      toast.error(error.response?.data || 'Greška pri registraciji prodavca');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Izaberite tip naloga
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Kako želite da koristite Trade-Flow platformu?
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <button
                onClick={() => {
                  setUserType('user');
                  setStep('user');
                }}
                className="w-full flex items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <User className="h-8 w-8 text-blue-600 mr-4" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Kupac</h3>
                  <p className="text-sm text-gray-600">
                    Pretražujte i kupujte građevinski materijal
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setUserType('seller');
                  setStep('user');
                }}
                className="w-full flex items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Store className="h-8 w-8 text-green-600 mr-4" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Prodavac</h3>
                  <p className="text-sm text-gray-600">
                    Prodajte vaš građevinski materijal
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Već imate nalog? Prijavite se
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'user') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Osnovne informacije
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Unesite vaše osnovne podatke
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleUserRegistration}>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ime"
                  type="text"
                  name="ime"
                  value={formData.ime}
                  onChange={handleChange}
                  error={errors.ime}
                  placeholder="Marko"
                  required
                />
                <Input
                  label="Prezime"
                  type="text"
                  name="prezime"
                  value={formData.prezime}
                  onChange={handleChange}
                  error={errors.prezime}
                  placeholder="Petrović"
                  required
                />
              </div>

              <Input
                label="Email adresa"
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="marko@email.com"
                required
              />

              <div className="relative">
                <Input
                  label="Lozinka"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Unesite lozinku"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('type')}
                  className="flex-1"
                >
                  Nazad
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  {userType === 'seller' ? 'Nastavi' : 'Registruj se'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'seller') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Store className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Informacije o firmi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Unesite podatke o vašoj firmi
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSellerRegistration}>
              <Input
                label="Ime firme"
                type="text"
                name="imeFirme"
                value={formData.imeFirme}
                onChange={handleChange}
                error={errors.imeFirme}
                placeholder="Građevinska firma DOO"
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
                  className={`
                    w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.bio ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                  `}
                  placeholder="Opišite vašu firmu i usluge koje pružate..."
                  required
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                )}
              </div>

              <Input
                label="Broj telefona"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+381 11 123 4567"
              />

              <Input
                label="URL slike profila"
                type="url"
                name="pfpUrl"
                value={formData.pfpUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.jpg"
                helperText="Opciono - URL do logoa vaše firme"
              />

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('user')}
                  className="flex-1"
                >
                  Nazad
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  Registruj se
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Register;