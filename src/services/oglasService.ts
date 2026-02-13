import api from "./api";
import { API_ENDPOINTS } from "../config/api";
import { Oglas, CreateOglasDto } from "../types";

interface OglasFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  kategorija?: string;
  grad?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const oglasService = {
  async getAll(filters: OglasFilters = {}) {
    const {
      page = 1,
      pageSize = 20,
      search,
      kategorija,
      grad,
      minPrice,
      maxPrice,
    } = filters;

    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (search) params.append("search", search);
    if (kategorija) params.append("kategorija", kategorija);
    if (grad) params.append("grad", grad);
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());

    const response = await api.get(`${API_ENDPOINTS.OGLASI}?${params}`);
    return response.data;
  },
  async create(oglasData: CreateOglasDto) {
    const response = await api.post(API_ENDPOINTS.OGLASI, oglasData);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ENDPOINTS.OGLASI}/${id}`);
    return response.data;
  },
  async getById(id: string): Promise<Oglas> {
    const response = await api.get(`${API_ENDPOINTS.OGLASI}/${id}`);
    return response.data;
  },
  async getMyAds(page: number = 1, pageSize: number = 20) {
    const response = await api.get(`${API_ENDPOINTS.OGLASI}/my-ads`, {
      params: { page, pageSize },
    });
    return response.data;
  },
};
