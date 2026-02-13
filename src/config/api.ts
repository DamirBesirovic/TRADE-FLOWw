export const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7277";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/Auth/Login",
  REGISTER: "/api/Auth/Register",
  REGISTER_SELLER: "/api/Auth/RegisterSeller",

  // User
  USER_PROFILE: "/api/User/profile",
  UPDATE_USER_PROFILE: "/api/User/update-profile",
  UPDATE_SELLER_PROFILE: "/api/User/update-seller-profile",
  GET_ALL_USERS: "/api/User/get-all-users",
  DELETE_ACCOUNT: "/api/User/delete-account",
  CHANGE_PASSWORD: "/api/User/change-password",

  // Oglasi
  OGLASI: "/api/Oglasi",

  // Gradovi
  GRADOVI: "/api/Gradovi",

  // Kategorije
  KATEGORIJE: "/api/Kategorije",

  //Zahtevi

  ZAHTEVI: "api/Zahtevi",
} as const;
