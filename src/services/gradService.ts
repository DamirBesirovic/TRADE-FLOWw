import api from "./api";
import { Grad } from "../types";

export const gradService = {
  async getAll(): Promise<Grad[]> {
    const response = await api.get("/api/Gradovi");
    return response.data;
  },

  async getById(id: string): Promise<Grad> {
    const response = await api.get(`/api/Gradovi/${id}`);
    return response.data;
  },
};
