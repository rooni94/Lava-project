export type Service = {
  id: number;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  features?: string[];
};

export type Project = {
  id: number;
  title: string;
  description: string;
  summary?: string;
  goals?: string;
  challenges?: string;
  solution?: string;
  results?: string;
  scope?: string;
  duration?: string;
  team_size?: string;
  budget?: string;
  category: string;
  client?: string;
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
