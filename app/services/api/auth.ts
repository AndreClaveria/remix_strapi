// server/api/auth.ts
import { api } from "./index";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginPayload {
  identifier: string; // username ou email
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const res = await api.post<RegisterResponse>("/auth/local/register", payload);
  return res.data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/local", payload);
  return res.data;
}
