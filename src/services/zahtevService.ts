import api from "./api";
import { CreateZahtevDto, Zahtev } from "../types";

export const zahtevService = {
  async createZahtev(zahtevData: CreateZahtevDto) {
    const response = await api.post("/api/Zahtevi", zahtevData);
    return response.data;
  },

  async getZahteviForSeller(
    pageNumber = 1,
    pageSize = 7,
    procitano?: boolean | null
  ) {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (procitano !== null && procitano !== undefined) {
      params.append("procitano", procitano.toString());
    }

    const response = await api.get(`/api/Zahtevi?${params}`);
    return response.data;
  },

  async markAsRead(zahtevId: string) {
    const response = await api.put(`/api/Zahtevi/mark-as-read/${zahtevId}`);
    return response.data;
  },
  async getZahtevWithOglas(zahtevId: string) {
    const response = await api.get(`/api/Zahtevi/${zahtevId}/with-oglas`);
    return response.data;
  },
};
