import api from "./api";
import { API_ENDPOINTS } from "../config/api";

export interface AdminUser {
  id: string;
  ime: string;
  prezime: string;
  username: string;
  email: string;
  datumRegistracije: string;
  roles: string[];
  // Seller specific fields (if applicable)
  imeFirme?: string;
  bio?: string;
  phoneNumber?: string;
  pfpUrl?: string;
  ocena?: number;
  isVerified?: boolean;
}

export const adminService = {
  // Users management
  async getAllUsers(): Promise<AdminUser[]> {
    const response = await api.get(API_ENDPOINTS.GET_ALL_USERS);
    return response.data;
  },

  // Gradovi management
  async createGrad(name: string) {
    const response = await api.post(API_ENDPOINTS.GRADOVI, { name });
    return response.data;
  },

  async updateGrad(id: string, name: string) {
    const response = await api.put(`${API_ENDPOINTS.GRADOVI}/${id}`, { name });
    return response.data;
  },

  async deleteGrad(id: string) {
    const response = await api.delete(`${API_ENDPOINTS.GRADOVI}/${id}`);
    return response.data;
  },

  // Kategorije management
  async createKategorija(name: string) {
    const response = await api.post(API_ENDPOINTS.KATEGORIJE, { name });
    return response.data;
  },

  async updateKategorija(id: string, name: string) {
    const response = await api.put(`${API_ENDPOINTS.KATEGORIJE}/${id}`, {
      name,
    });
    return response.data;
  },

  async deleteKategorija(id: string) {
    const response = await api.delete(`${API_ENDPOINTS.KATEGORIJE}/${id}`);
    return response.data;
  },
};
