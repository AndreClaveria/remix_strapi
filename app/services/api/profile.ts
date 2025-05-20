import { api } from "./index";

export async function getProfile(token: string | null) {
    const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  return response.data;
}

export async function getToken(): Promise<string | null> {
    try {
        const token = localStorage.getItem("token");
        return token;
        } catch (error) {
            console.error("Erreur récupération token:", error);
            return null;
        }    
}
