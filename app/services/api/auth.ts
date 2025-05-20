import { api } from "./index";

export async function login(identifier: string, password: string) {
  const res = await api.post("/auth/local", { identifier, password });
  return res.data;
}

export async function register(
  username: string,
  email: string,
  password: string
) {
  const res = await api.post("/auth/local/register", {
    username,
    email,
    password,
  });
  return res.data;
}
