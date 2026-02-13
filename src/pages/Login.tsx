import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { Building2, Eye, EyeOff } from "lucide-react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!credentials.username.trim()) {
      newErrors.username = "Email je obavezan";
    } else if (!/\S+@\S+\.\S+/.test(credentials.username)) {
      newErrors.username = "Email format nije valjan";
    }

    if (!credentials.password) {
      newErrors.password = "Lozinka je obavezna";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.login(credentials);

      // Fetch user profile after successful login
      const userData = await authService.getUserProfile();
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: userData,
          token: credentials.username, // We'll get the actual token from cookies
        },
      });

      toast.success("Uspešno ste se prijavili");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Neispravni podaci za prijavu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Prijavite se na vaš nalog
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ili{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              registrujte novi nalog
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <Input
              label="Email adresa"
              name="username"
              type="email"
              value={credentials.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="vas.email@example.com"
              required
            />

            <div className="relative">
              <Input
                label="Lozinka"
                name="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Unesite lozinku"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Prijavite se
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
