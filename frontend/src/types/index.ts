export type Service = {
  id: number;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  icon?: string;
  image?: string;
  features?: string[];
  features_en?: string[];
};

export type Project = {
  id: number;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  summary?: string;
  summary_en?: string;
  goals?: string;
  goals_en?: string;
  challenges?: string;
  challenges_en?: string;
  solution?: string;
  solution_en?: string;
  results?: string;
  results_en?: string;
  scope?: string;
  scope_en?: string;
  duration?: string;
  duration_en?: string;
  team_size?: string;
  team_size_en?: string;
  budget?: string;
  budget_en?: string;
  category: string;
  client?: string;
  client_en?: string;
  technologies?: { id: number; name: string }[];
  technology_ids?: number[];
  cover_image?: string;
  live_url?: string;
  gallery?: string[];
  github_url?: string;
  status?: string;
  is_featured?: boolean;
  scheduled_publish_at?: string;
  title_font_family?: string;
  body_font_family?: string;
  title_font_size?: number;
  body_font_size?: number;
  primary_color?: string;
  accent_color?: string;
};

export type Technology = {
  id: number;
  name: string;
  slug: string;
};

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  bio?: string;
  image?: string;
};

export type Client = {
  id: number;
  name: string;
  testimonial?: string;
  quote?: string;
  rating?: number;
  logo?: string;
  website?: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image?: string;
  published_at?: string;
  created_at?: string;
  tags?: string[];
  comments?: Comment[];
};

export type Page = {
  id: number;
  name: string;
  slug: string;
  title: string;
  status: string;
  meta_description?: string;
  hero_image?: string;
};

export type Section = {
  id: number;
  title: string;
  content: string;
  order: number;
  section_type?: string;
  page: number;
};

export type JobOpening = {
  id: number;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  is_active: boolean;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  apply_url?: string;
};

export type Comment = {
  id: number;
  post: number;
  name: string;
  email: string;
  content: string;
  created_at?: string;
};

export type PackageCategory = {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
};

export type Package = {
  id: number;
  slug: string;
  title_ar: string;
  title_en: string;
  short_description_ar?: string;
  short_description_en?: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  price_note?: string;
  price_note_en?: string;
  currency: string;
  product_type?: string;
  featured?: boolean;
  is_active?: boolean;
  category?: PackageCategory | null;
  category_id?: number | null;
  created_at?: string;
};

export type SiteSettings = {
  id: number;
  site_name: string;
  tagline?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_background?: string;
  seo_title?: string;
  meta_description?: string;
  og_image?: string;
};

export type ContactInfo = {
  id: number;
  location?: string;
  phone?: string;
  email?: string;
  map_embed?: string;
  working_hours?: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  service_type?: string;
  status?: string;
  is_handled?: boolean;
  created_at?: string;
};
