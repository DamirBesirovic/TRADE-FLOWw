export interface User {
  id: string;
  username: string;
  email: string;
  ime: string;
  prezime: string;
  datumRegistracije: string;
  phoneNumber?: string;
  isFirstLogin: boolean;
  roles: string[];
}

export interface Seller extends User {
  imeFirme: string;
  bio: string;
  pfpUrl?: string;
  ocena: number;
  isVerified: boolean;
}

export interface Grad {
  id: string;
  name: string;
}

export interface Kategorija {
  id: string;
  name: string;
}

export interface Oglas {
  id: string;
  naslov: string;
  opis: string;
  materijal: string;
  cena: number;
  mesto: string;
  imageUrls: string[];
  kategorija: string;
  kategorijaId: string;
  grad: string;
  gradId: string;
  prodavac: string;
  prodavacId: string;
}

export interface CreateOglasDto {
  naslov: string;
  opis: string;
  materijal: string;
  cena: number;
  mesto: string;
  ImageUrls: string[]; // Changed to match backend DTO (uppercase I)
  kategorija_Id: string;
  grad_Id: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  ime: string;
  prezime: string;
}

export interface RegisterSellerRequest {
  bio: string;
  imeFirme: string;
  mesto?: string;
  phoneNumber?: string;
  pfpUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface Zahtev {
  id: string;
  oglas_Id: string;
  grad_Id: string;
  kupac_Id: string;
  kolicina: number;
  poruka: string;
  telefon: string;
  poslatoVreme: string;
  procitano: boolean;
  vlasnikOglasa_KorisnikId: string;
  oglas?: {
    id: string;
    naslov: string;
    materijal: string;
    cena: number;
    kategorija: string;
  };
  // Optional grad info
  grad?: {
    id: string;
    name: string;
  };
}

export interface CreateZahtevDto {
  oglasId: string;
  gradId: string;
  kolicina: number;
  poruka: string;
  telefon: string;
}
