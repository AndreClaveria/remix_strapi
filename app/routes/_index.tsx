import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getProfile, getToken } from "~/services/api/profile";
import ContactForm from "../components/forms";
import { strapiService } from "~/services/services/strapi.server";

import type { SerializedPage } from "~/types/strapi";

type Profile = {
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
};

// Import your updated types
import type { StrapiPage, StrapiPagesResponse } from "~/types/strapi";

// Fonction pour récupérer les pages depuis Strapi avec populate
async function getPages(): Promise<StrapiPage[]> {
  try {
    // Utiliser la syntaxe qui fonctionne pour votre setup
    const response = await fetch(
      "http://localhost:1337/api/pages?populate[img][fields][0]=url&populate[img][fields][1]=alternativeText&populate[img][fields][2]=name"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StrapiPagesResponse = await response.json();
    console.log("Pages data received:", JSON.stringify(data, null, 2)); // Debug pour voir la structure
    return data.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des pages:", error);
    return [];
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // Si une page "accueil" existe dans Strapi, utiliser ses meta tags
  if (data?.homePage) {
    return [
      { title: "Kachow" },
      {
        name: "description",
        content: "Page d&apos;accueil - Kachow",
      },
    ];
  }

  // Sinon, utiliser les meta tags par défaut
  return [
    { title: "Kachow" },
    { name: "description", content: "I&apos;m speed" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log(request);

    console.log("Loading data...");

    // Charger toutes les pages depuis Strapi
    const pages = await getPages();

    // Essayer de trouver une page "accueil" pour le page builder
    let homePage = null;
    try {
      homePage = await strapiService.getPageBySlug("accueil");
    } catch (error) {
      console.log("Pas de page accueil trouvée, fallback sur design classique");
    }

    return json({
      pages,
      homePage: homePage as SerializedPage | null,
      hasPageBuilder: !!homePage,
    });
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    return json({
      pages: [],
      homePage: null,
      hasPageBuilder: false,
    });
  }
}

// Composant Header moderne
function Header({ profile }: { profile: Profile | null }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Kachow
              </h1>
            </div>
          </div>

          {/* Navigation et profil */}
          <div className="flex items-center space-x-4">
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 px-4 py-2 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl transition-all duration-200 border border-gray-200/50"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">
                      {profile.username}
                    </p>
                    <p className="text-xs text-gray-500">{profile.email}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Menu déroulant */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">
                        {profile.username}
                      </p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                      <div className="flex items-center mt-1">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            profile.confirmed ? "bg-green-400" : "bg-yellow-400"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-500">
                          {profile.confirmed
                            ? "Compte vérifié"
                            : "En attente de vérification"}
                        </span>
                      </div>
                    </div>
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mon profil
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Paramètres
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Se connecter
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  S&apos;inscrire
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Index() {
  const { pages, homePage, hasPageBuilder } = useLoaderData<typeof loader>();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Récupère le token une fois qu&apos;il est dispo
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    fetchToken();
  }, []);

  // Récupère le profil dès que le token est dispo
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      const profileData = await getProfile(token);
      setProfile(profileData);
    };
    fetchProfile();
  }, [token]);

  // Si une page "accueil" Strapi existe, l&apos;afficher avec les composants dynamiques
  if (hasPageBuilder && homePage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Header profile={profile} />

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6">
              Kachow
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Découvrez notre plateforme moderne et intuitive pour tous vos
              besoins.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
          </div>
        </section>

        {/* Section pages intégrée */}
        <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
              Nos dernières pages
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Explorez nos contenus les plus récents et découvrez tout ce que
              nous avons à offrir.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pages.map((page: StrapiPage) => (
                <article
                  key={page.id}
                  className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20"
                >
                  {/* Image de la page si elle existe */}
                  {page.img && page.img.length > 0 && (
                    <div className="relative overflow-hidden">
                      <img
                        src={`http://localhost:1337${page.img[0].url}`}
                        alt={page.img[0].alternativeText || page.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                      {page.title}
                    </h3>
                    {page.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {page.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(page.publishedAt).toLocaleDateString("fr-FR")}
                      </span>
                      <a
                        href={`/page/${page.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                      >
                        Lire plus
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire de contact intégré */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Contactez-nous
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Une question, un projet ou simplement envie d&apos;échanger ?
                N&apos;hésitez pas à nous contacter.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </div>
    );
  }

  // Fallback: design original avec les pages au lieu des articles
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header profile={profile} />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6">
            Kachow
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            I&apos;m speed - Découvrez notre plateforme moderne et intuitive.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nos dernières pages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez nos contenus les plus récents et découvrez tout ce que nous
            avons à offrir.
          </p>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-2">Aucune page trouvée.</p>
            <p className="text-sm text-gray-500">
              Créez des pages dans Strapi pour les voir apparaître ici.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pages.map((page: StrapiPage) => (
              <div
                key={page.id}
                className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20"
              >
                {/* Image de la page */}
                {page.img && page.img.length > 0 && (
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:1337${page.img[0].url}`}
                      alt={page.img[0].alternativeText || page.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {page.title}
                  </h3>
                  {page.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {page.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      Publié le{" "}
                      {new Date(page.publishedAt).toLocaleDateString("fr-FR")}
                    </span>
                    <a
                      href={`/page/${page.slug}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Voir la page
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Contactez-nous
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une question, un projet ou simplement envie d&apos;échanger ?
              N&apos;hésitez pas à nous contacter.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
