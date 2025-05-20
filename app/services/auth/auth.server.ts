import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { User } from "~/services/types/auth";
import { api } from "~/services/api/index"; // Utilisation de votre api au lieu de strapiClient

// Configuration du stockage de session
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "remix_strapi_session",
    secure: process.env.NODE_ENV === "production",
    secrets: ["s3cr3t"], // Utilisez une variable d'environnement en production
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    httpOnly: true,
  },
});

// Récupérer la session
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Récupérer le token JWT de la session
export async function getToken(request: Request): Promise<string | null> {
  const session = await getSession(request);
  const token = session.get("token");
  return token;
}

// Fonction pour récupérer l'utilisateur actuel
export async function getCurrentUser(request: Request): Promise<User | null> {
  const token = await getToken(request);

  if (!token) return null;

  try {
    // Requête à Strapi pour obtenir les informations de l'utilisateur
    const response = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur récupération utilisateur:", error);
    return null;
  }
}

// Fonction pour exiger l'authentification
export async function requireUser(
  request: Request,
  redirectTo: string = "/login"
): Promise<User> {
  const user = await getCurrentUser(request);

  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return user;
}

// Créer une session avec un token JWT
export async function createUserSession(token: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("token", token);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Déconnexion
export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// Déterminer si un utilisateur est connecté
export async function isAuthenticated(request: Request): Promise<boolean> {
  const user = await getCurrentUser(request);
  return user !== null;
}
