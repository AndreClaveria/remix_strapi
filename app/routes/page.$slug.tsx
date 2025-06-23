// app/routes/page.$slug.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Types pour les données de navigation
type NavigationPage = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  publishedAt: string;
};

type PageData = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  publishedAt: string;
  img?: Array<{
    url: string;
    alternativeText?: string;
    name?: string;
  }>;
};

type LoaderData = {
  page: PageData;
  navigation: {
    previous: NavigationPage | null;
    next: NavigationPage | null;
  };
};

// Loader pour récupérer les données depuis Strapi
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  try {
    // Récupérer l&apos;article actuel
    const response = await fetch(
      `http://localhost:1337/api/pages?filters[slug][$eq]=${slug}&populate[img][fields][0]=url&populate[img][fields][1]=alternativeText&populate[img][fields][2]=name`
    );

    if (!response.ok) {
      throw new Response("Not Found", { status: 404 });
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Response("Page not found", { status: 404 });
    }

    const currentPage: PageData = data.data[0];

    // Récupérer tous les articles pour la navigation
    const allPagesResponse = await fetch(
      "http://localhost:1337/api/pages?sort[0]=publishedAt:desc&fields[0]=title&fields[1]=slug&fields[2]=publishedAt&fields[3]=documentId"
    );

    const navigationData: {
      previous: NavigationPage | null;
      next: NavigationPage | null;
    } = {
      previous: null,
      next: null,
    };

    if (allPagesResponse.ok) {
      const allPagesData = await allPagesResponse.json();
      const allPages: NavigationPage[] = allPagesData.data || [];

      // Trouver l&apos;index de l&apos;article actuel
      const currentIndex = allPages.findIndex(
        (page: NavigationPage) => page.slug === slug
      );

      if (currentIndex !== -1) {
        // Article précédent (plus récent)
        if (currentIndex > 0) {
          navigationData.previous = allPages[currentIndex - 1];
        }

        // Article suivant (plus ancien)
        if (currentIndex < allPages.length - 1) {
          navigationData.next = allPages[currentIndex + 1];
        }
      }
    }

    return json<LoaderData>({
      page: currentPage,
      navigation: navigationData,
    });
  } catch (error) {
    console.error("Erreur lors du fetch:", error);
    throw new Response("Error loading page", { status: 500 });
  }
}

export default function Page() {
  const { page, navigation } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Fixed Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour à l&apos;accueil
            </a>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date(page.publishedAt).toLocaleDateString("fr-FR")}
              </div>
              <div className="flex space-x-2">
                <button className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5"></div>

        {/* Hero Image Background */}
        {page.img && page.img.length > 0 && (
          <div className="absolute inset-0 opacity-10">
            <img
              src={`http://localhost:1337${page.img[0].url}`}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white"></div>
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-indigo-600 transition-colors">
              Accueil
            </a>
            <svg
              className="w-4 h-4"
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
            <a href="/page" className="hover:text-indigo-600 transition-colors">
              Pages
            </a>
            <svg
              className="w-4 h-4"
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
            <span className="text-gray-800 font-medium">{page.title}</span>
          </nav>

          {/* Publication Info */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 text-indigo-700 rounded-full text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
            Publié le{" "}
            {new Date(page.publishedAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {page.title}
            </span>
          </h1>

          {/* Description */}
          {page.description && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8 font-light">
              {page.description}
            </p>
          )}

          {/* Slug Badge */}
          {page.slug && (
            <div className="inline-flex items-center px-4 py-2 bg-gray-100/80 backdrop-blur-sm text-gray-600 rounded-full text-sm border border-gray-200/50">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              /{page.slug}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Featured Image */}
          {page.img && page.img.length > 0 && (
            <div className="relative overflow-hidden">
              <img
                src={`http://localhost:1337${page.img[0].url}`}
                alt={page.img[0].alternativeText || page.title}
                className="w-full h-96 object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

              {/* Image Caption */}
              {page.img[0].alternativeText && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-sm text-gray-700">
                    {page.img[0].alternativeText}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Article Content */}
          <div className="p-8 md:p-12 lg:p-16">
            {/* Article Meta */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <p className="font-semibold text-gray-900">Article</p>
                  <p className="text-sm text-gray-500">ID: {page.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Temps de lecture:</span>
                <span className="text-sm font-medium text-gray-700">
                  ~ 5 min
                </span>
              </div>
            </div>

            {/* Main Content */}
            {page.content && (
              <div className="prose prose-lg prose-indigo max-w-none mb-12">
                <div
                  dangerouslySetInnerHTML={{ __html: page.content }}
                  className="
                    prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-8
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-code:bg-indigo-50 prose-code:text-indigo-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:text-gray-700 prose-li:mb-2
                  "
                />
              </div>
            )}

            {/* Tags Section */}
            <div className="mb-8 pb-6 border-b border-gray-200/50">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Catégories
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200/50">
                  Article
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200/50">
                  Strapi
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50">
                  Remix
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 rounded-full text-sm font-medium border border-pink-200/50">
                  {page.slug}
                </span>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Partager cet article
                  </h3>
                  <p className="text-sm text-gray-600">
                    Faites découvrir ce contenu à votre communauté
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="group w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>

                  <button className="group w-12 h-12 bg-blue-800 text-white rounded-xl flex items-center justify-center hover:bg-blue-900 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </button>

                  <button className="group w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </button>

                  <button className="group w-12 h-12 bg-gray-600 text-white rounded-xl flex items-center justify-center hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation entre articles */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Article précédent */}
            {navigation.previous ? (
              <a
                href={`/page/${navigation.previous.slug}`}
                className="group flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900 min-w-0 max-w-xs"
              >
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <div className="text-left min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Précédent
                  </div>
                  <div className="font-medium truncate">
                    {navigation.previous.title}
                  </div>
                </div>
              </a>
            ) : (
              <div className="flex items-center px-6 py-3 bg-gray-100/50 border border-gray-200/30 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wide">
                    Précédent
                  </div>
                  <div className="font-medium">Aucun article</div>
                </div>
              </div>
            )}

            {/* Bouton retour à l&apos;accueil */}
            <a
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"
                />
              </svg>
              Tous les articles
            </a>

            {/* Article suivant */}
            {navigation.next ? (
              <a
                href={`/page/${navigation.next.slug}`}
                className="group flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900 min-w-0 max-w-xs"
              >
                <div className="text-right min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Suivant
                  </div>
                  <div className="font-medium truncate">
                    {navigation.next.title}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 ml-2 flex-shrink-0 group-hover:translate-x-1 transition-transform"
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
            ) : (
              <div className="flex items-center px-6 py-3 bg-gray-100/50 border border-gray-200/30 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide">Suivant</div>
                  <div className="font-medium">Aucun article</div>
                </div>
                <svg
                  className="w-5 h-5 ml-2"
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
              </div>
            )}
          </div>

          {/* Indicateur de position */}
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Naviguez entre les articles avec les boutons ou utilisez les
                flèches de votre clavier
              </span>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
      </main>

      {/* Script pour navigation au clavier */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener(&apos;keydown&apos;, function(e) {
              if (e.key === &apos;ArrowLeft&apos; && ${JSON.stringify(
                !!navigation.previous
              )}) {
                window.location.href = &apos;/page/${
                  navigation.previous?.slug || ""
                }&apos;;
              } else if (e.key === &apos;ArrowRight&apos; && ${JSON.stringify(
                !!navigation.next
              )}) {
                window.location.href = &apos;/page/${
                  navigation.next?.slug || ""
                }&apos;;
              } else if (e.key === &apos;Escape&apos;) {
                window.location.href = &apos;/&apos;;
              }
            });
          `,
        }}
      />
    </div>
  );
}
