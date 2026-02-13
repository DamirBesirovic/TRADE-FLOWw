import api from "./api";
import { API_ENDPOINTS } from "../config/api";
import {
  LoginRequest,
  RegisterRequest,
  RegisterSellerRequest,
  User,
  ChangePasswordDto,
} from "../types";
import { setAuthToken, setUserId, setUserRole, clearAuth } from "../utils/auth";

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    const { jwtToken } = response.data;

    setAuthToken(jwtToken);

    try {
      // Decode JWT to get user info
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      console.log("JWT Payload:", payload); // Debug log

      // Handle user ID - try different claim names
      const userId =
        payload.nameid ||
        payload.sub ||
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      if (userId) {
        setUserId(userId);
      }

      // Handle roles - they might be an array or string
      let roles =
        payload.role ||
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];

      console.log("Extracted roles:", roles); // Debug log

      // If roles is a string, convert to array
      if (typeof roles === "string") {
        roles = [roles];
      }

      // Store roles as comma-separated string for cookie storage
      if (roles && Array.isArray(roles)) {
        setUserRole(roles.join(","));
      } else if (roles) {
        setUserRole(roles);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      clearAuth();
      throw new Error("Invalid token format");
    }

    return response.data;
  },

  async register(userData: RegisterRequest) {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  async registerSeller(sellerData: RegisterSellerRequest) {
    const response = await api.post(API_ENDPOINTS.REGISTER_SELLER, sellerData);
    return response.data;
  },

  async getUserProfile(): Promise<User> {
    const response = await api.get(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  async updateUserProfile(userData: Partial<User>) {
    const response = await api.put(API_ENDPOINTS.UPDATE_USER_PROFILE, userData);
    return response.data;
  },

  async updateSellerProfile(sellerData: any) {
    const response = await api.put(
      API_ENDPOINTS.UPDATE_SELLER_PROFILE,
      sellerData
    );
    return response.data;
  },

  async changePassword(passwordData: ChangePasswordDto) {
    const response = await api.post(
      API_ENDPOINTS.CHANGE_PASSWORD,
      passwordData
    );
    return response.data;
  },
  async deleteAccount() {
    const response = await api.delete(API_ENDPOINTS.DELETE_ACCOUNT);
    clearAuth(); //brisu se auth podaci kako korisnik ne bi ostao ulogovan nakon brisanja naloga
    return response.data;
  },
};
