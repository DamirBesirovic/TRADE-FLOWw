import api from "./api";
import { API_ENDPOINTS } from "../config/api";
import { Grad, Kategorija, User } from "../types";

export const dataService = {
  async getGradovi(): Promise<Grad[]> {
    const response = await api.get(API_ENDPOINTS.GRADOVI);
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response = await api.get(API_ENDPOINTS.GET_ALL_USERS);
    return response.data;
  },

  async getKategorije(): Promise<Kategorija[]> {
    const response = await api.get(API_ENDPOINTS.KATEGORIJE);
    return response.data;
  },

  async createGrad(name: string) {
    const response = await api.post(API_ENDPOINTS.GRADOVI, { name });
    return response.data;
  },

  async createKategorija(name: string) {
    const response = await api.post(API_ENDPOINTS.KATEGORIJE, { name });
    return response.data;
  },

  async updateGrad(id: string, name: string) {
    const response = await api.put(`${API_ENDPOINTS.GRADOVI}/${id}`, { name });
    return response.data;
  },

  async updateKategorija(id: string, name: string) {
    const response = await api.put(`${API_ENDPOINTS.KATEGORIJE}/${id}`, {
      name,
    });
    return response.data;
  },

  async deleteGrad(id: string) {
    const response = await api.delete(`${API_ENDPOINTS.GRADOVI}/${id}`);
    return response.data;
  },

  async deleteKategorija(id: string) {
    const response = await api.delete(`${API_ENDPOINTS.KATEGORIJE}/${id}`);
    return response.data;
  },
};
