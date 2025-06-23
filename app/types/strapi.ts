// Types pour Strapi 5 (structure aplatie)
export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Structure pour les images dans les relations (corrigée pour votre structure)
export interface StrapiImageRelation {
  // Votre structure retourne un tableau d'images directement
  img?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string | null;
    name?: string;
  }[];
}

// Page basique (comme vos données actuelles) - corrigée
export interface StrapiPage {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description?: string;
  img?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string | null;
    name?: string;
  }[]; // Image sous forme de tableau
  content?: string; // Contenu riche optionnel
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Composants pour le page builder (structure Strapi 5)
export interface HeroSection {
  __component: "components.hero-section";
  id: number;
  title: string;
  subtitle?: string;
  backgroundImage?: StrapiImageRelation;
  ctaText?: string;
  ctaLink?: string;
}

export interface TextBlock {
  __component: "components.text-block";
  id: number;
  title?: string;
  content: string;
  alignment: "left" | "center" | "right";
}

export interface ImageGallery {
  __component: "components.image-gallery";
  id: number;
  title?: string;
  images?: {
    data: StrapiImage[];
  };
  layout: "grid" | "carousel" | "masonry";
}

export interface CallToAction {
  __component: "components.call-to-action";
  id: number;
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: "blue" | "green" | "red" | "purple" | "gray";
}

export type PageComponent =
  | HeroSection
  | TextBlock
  | ImageGallery
  | CallToAction;

// Page avec composants dynamiques (page builder)
export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  metaDescription?: string;
  components?: PageComponent[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Version sérialisée pour Remix (avec attributes pour compatibilité legacy)
export interface SerializedPage {
  id: number;
  documentId?: string;
  attributes: {
    title: string;
    slug: string;
    metaDescription?: string;
    components: PageComponent[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Réponse API Strapi
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Type pour votre liste de pages
export type StrapiPagesResponse = StrapiResponse<StrapiPage[]>;

// Types pour les différents endpoints
export interface StrapiPageWithPopulate extends StrapiPage {
  img?: StrapiImageRelation;
  components?: PageComponent[];
}

// Helper types pour les API calls
export interface GetPagesParams {
  populate?: string[];
  filters?: Record<string, any>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

// Type pour une page complète avec tous les champs populés
export interface FullStrapiPage {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  img?: StrapiImageRelation;
  components?: PageComponent[];
  metaDescription?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaImage?: StrapiImageRelation;
    keywords?: string;
    metaRobots?: string;
    structuredData?: any;
    metaViewport?: string;
    canonicalURL?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
