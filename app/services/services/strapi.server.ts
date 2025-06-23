import type { Page, StrapiResponse } from "~/types/strapi";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

class StrapiService {
  private baseURL = `${STRAPI_URL}/api`;

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorMessage = `Strapi request failed: ${response.status} ${response.statusText}`;
      console.error(errorMessage, { url, endpoint });
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      // Encoder le slug pour éviter les problèmes avec les caractères spéciaux
      const encodedSlug = encodeURIComponent(slug);
      const response = await this.request<StrapiResponse<Page[]>>(
        `/pages?filters[slug][$eq]=${encodedSlug}&populate=deep`
      );

      const page = response.data[0] || null;

      if (page) {
        console.log(
          `Page trouvée pour le slug "${slug}":`,
          page.attributes.title
        );
      } else {
        console.log(`Aucune page trouvée pour le slug "${slug}"`);
      }

      return page;
    } catch (error) {
      console.error(`Error fetching page with slug "${slug}":`, error);
      return null;
    }
  }

  async getAllPages(): Promise<Page[]> {
    try {
      const response = await this.request<StrapiResponse<Page[]>>(
        "/pages?populate=deep"
      );

      console.log(`${response.data.length} pages récupérées depuis Strapi`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      return [];
    }
  }

  async getPageBySlugWithPagination(
    slug: string,
    page: number = 1,
    pageSize: number = 25
  ): Promise<{ pages: Page[]; meta: any }> {
    try {
      const encodedSlug = encodeURIComponent(slug);
      const response = await this.request<StrapiResponse<Page[]>>(
        `/pages?filters[slug][$eq]=${encodedSlug}&populate=deep&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );

      return {
        pages: response.data,
        meta: response.meta,
      };
    } catch (error) {
      console.error("Error fetching paginated pages:", error);
      return { pages: [], meta: {} };
    }
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      console.warn("URL d'image vide fournie à getImageUrl");
      return "";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // S'assurer qu'on n'ajoute pas de double slash
    const cleanUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${STRAPI_URL}${cleanUrl}`;
  }

  // Méthode utilitaire pour vérifier la santé de l'API Strapi
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${STRAPI_URL}/api`);
      return response.ok;
    } catch (error) {
      console.error("Strapi health check failed:", error);
      return false;
    }
  }

  // Méthode pour récupérer une page avec un fallback
  async getPageWithFallback(
    slug: string,
    fallbackSlug?: string
  ): Promise<Page | null> {
    let page = await this.getPageBySlug(slug);

    if (!page && fallbackSlug) {
      console.log(
        `Page "${slug}" non trouvée, tentative avec le fallback "${fallbackSlug}"`
      );
      page = await this.getPageBySlug(fallbackSlug);
    }

    return page;
  }

  // Méthode pour invalider le cache (si vous implémentez du caching plus tard)
  invalidateCache(slug?: string): void {
    if (slug) {
      console.log(`Cache invalidé pour la page: ${slug}`);
    } else {
      console.log("Cache global invalidé");
    }
    // Implémentation du cache à ajouter selon vos besoins
  }
}

export const strapiService = new StrapiService();

// Export des types pour faciliter l'utilisation
export type { Page } from "~/types/strapi";
