import api from "./client";
import {
  BlogPost,
  Client,
  Page,
  Project,
  Package,
  PackageCategory,
  Section,
  Service,
  TeamMember,
  JobOpening,
  Comment,
  SiteSettings,
  ContactInfo,
  Technology,
} from "../types";

export const fetchServices = async (): Promise<Service[]> => {
  const { data } = await api.get("/services/");
  return data.results ?? data;
};

export const fetchService = async (id: string): Promise<Service> => {
  const { data } = await api.get(`/services/${id}/`);
  return data;
};

export const fetchProjects = async (params?: Record<string, string | number | boolean>): Promise<Project[]> => {
  const { data } = await api.get("/projects/", { params });
  return data.results ?? data;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const { data } = await api.get(`/projects/${id}/`);
  return data;
};

export const fetchProjectStats = async (): Promise<{
  total_projects: number;
  featured_projects: number;
  by_category: Record<string, number>;
  media_items: number;
  technologies: number;
}> => {
  const { data } = await api.get("/projects/stats/");
  return data;
};

export const fetchPackageCategories = async (): Promise<PackageCategory[]> => {
  const { data } = await api.get("/package-categories/");
  return data.results ?? data;
};

export const fetchPackages = async (params?: Record<string, string | number | boolean>): Promise<Package[]> => {
  const { data } = await api.get("/packages/", { params });
  return data.results ?? data;
};

export const fetchPackage = async (idOrSlug: string | number): Promise<Package> => {
  const { data } = await api.get(`/packages/${idOrSlug}/`);
  return data;
};

export const createPackage = async (payload: Partial<Package>) => api.post("/packages/", payload);
export const updatePackage = async (id: number, payload: Partial<Package>) => api.patch(`/packages/${id}/`, payload);
export const deletePackage = async (id: number) => api.delete(`/packages/${id}/`);

export const fetchTeam = async (): Promise<TeamMember[]> => {
  const { data } = await api.get("/team/");
  return data.results ?? data;
};

export const fetchClients = async (): Promise<Client[]> => {
  const { data } = await api.get("/clients/");
  return data.results ?? data;
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data } = await api.get("/blog/posts/");
  return data.results ?? data;
};

export const fetchBlogPost = async (slug: string): Promise<BlogPost> => {
  const { data } = await api.get(`/blog/posts/${slug}/`);
  return data;
};

export const createBlogPost = async (payload: Partial<BlogPost>) => api.post("/blog/posts/", payload);
export const deleteBlogPost = async (id: number) => api.delete(`/blog/posts/${id}/`);
export const updateBlogPost = async (id: number, payload: Partial<BlogPost>) => api.patch(`/blog/posts/${id}/`, payload);
export const createComment = async (payload: Omit<Comment, "id">) => api.post("/blog/comments/", payload);

export const submitContact = async (payload: Record<string, unknown>) => {
  return api.post("/contact/", payload);
};

export const subscribe = async (email: string) => {
  return api.post("/subscribe/", { email });
};

export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data } = await api.get("/site-settings/");
  const settings = data.results ?? data;
  return Array.isArray(settings) && settings.length ? settings[0] : null;
};

export const fetchContactInfo = async (): Promise<ContactInfo | null> => {
  const { data } = await api.get("/contact-info/");
  const items = data.results ?? data;
  return Array.isArray(items) && items.length ? items[0] : null;
};

export const login = async (username: string, password: string) => {
  const { data } = await api.post("/auth/login/", { username, password });
  if (data.access) {
    localStorage.setItem("token", data.access);
    localStorage.setItem("refresh", data.refresh);
  }
  return data;
};

export const fetchDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats/");
  return data;
};

export const requestPasswordReset = async (email: string) => {
  return api.post("/auth/reset-password-request/", { email });
};

export const confirmPasswordReset = async (payload: { uid: string; token: string; new_password: string }) => {
  return api.post("/auth/reset-password-confirm/", payload);
};

export const fetchJobOpenings = async (params?: Record<string, string | number | boolean>) => {
  const { data } = await api.get("/careers/jobs/", { params });
  return data.results ?? data;
};

export const createJobOpening = async (payload: Partial<JobOpening>) => api.post("/careers/jobs/", payload);
export const updateJobOpening = async (id: number, payload: Partial<JobOpening>) => api.patch(`/careers/jobs/${id}/`, payload);
export const deleteJobOpening = async (id: number) => api.delete(`/careers/jobs/${id}/`);

export const applyToJob = async (payload: FormData) => {
  return api.post("/careers/applications/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createService = async (payload: Partial<Service>) => api.post("/services/", payload);
export const updateService = async (id: number, payload: Partial<Service>) => api.patch(`/services/${id}/`, payload);
export const deleteService = async (id: number) => api.delete(`/services/${id}/`);

export const createProject = async (payload: Partial<Project>) => api.post("/projects/", payload);
export const updateProject = async (id: number, payload: Partial<Project>) => api.patch(`/projects/${id}/`, payload);
export const deleteProject = async (id: number) => api.delete(`/projects/${id}/`);
export const fetchTechnologies = async (): Promise<Technology[]> => {
  const { data } = await api.get("/technologies/");
  return data.results ?? data;
};
export const createTechnology = async (payload: Partial<Technology>) => api.post("/technologies/", payload);

export const createTeam = async (payload: Partial<TeamMember>) => api.post("/team/", payload);
export const updateTeam = async (id: number, payload: Partial<TeamMember>) => api.patch(`/team/${id}/`, payload);
export const deleteTeam = async (id: number) => api.delete(`/team/${id}/`);
export const bulkTeamDelete = (ids: number[]) => api.post("/team/bulk-delete/", { ids });

export const createClient = async (payload: Partial<Client>) => api.post("/clients/", payload);
export const updateClient = async (id: number, payload: Partial<Client>) => api.patch(`/clients/${id}/`, payload);
export const deleteClient = async (id: number) => api.delete(`/clients/${id}/`);
export const bulkClientDelete = (ids: number[]) => api.post("/clients/bulk-delete/", { ids });
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload/", formData, { headers: { "Content-Type": "multipart/form-data" } });
};
export const updateMedia = async (id: number, payload: { title?: string; category?: string }) =>
  api.patch(`/media/${id}/`, payload);

export const fetchMessages = async (params?: Record<string, string | number | boolean>) => {
  const { data } = await api.get("/messages/", { params });
  return data.results ?? data;
};

export const updateMessage = async (id: number, payload: Record<string, unknown>) => api.patch(`/messages/${id}/`, payload);
export const deleteMessage = async (id: number) => api.delete(`/messages/${id}/`);

export const fetchPages = async (): Promise<Page[]> => {
  const { data } = await api.get("/pages/");
  return data.results ?? data;
};

export const createPage = async (payload: Partial<Page>) => api.post("/pages/", payload);
export const updatePage = async (id: number, payload: Partial<Page>) => api.patch(`/pages/${id}/`, payload);
export const deletePage = async (id: number) => api.delete(`/pages/${id}/`);
export const createSection = async (payload: Record<string, unknown>) => api.post("/sections/", payload);
export const fetchSections = async (pageId?: number): Promise<Section[]> => {
  const url = pageId ? `/sections/?page=${pageId}` : "/sections/";
  const { data } = await api.get(url);
  return data.results ?? data;
};
export const updateSection = async (id: number, payload: Partial<Section>) => api.patch(`/sections/${id}/`, payload);
export const deleteSection = async (id: number) => api.delete(`/sections/${id}/`);
export const reorderSections = async (orders: { id: number; order: number }[]) => api.post("/sections/reorder/", { orders });

// Bulk APIs
export const bulkService = (action: "activate" | "deactivate" | "delete", ids: number[]) =>
  api.post(`/services/bulk-${action}/`, { ids });
export const bulkProject = (action: "publish" | "feature" | "delete", ids: number[]) =>
  api.post(`/projects/bulk-${action}/`, { ids });
export const bulkBlog = (action: "publish" | "delete", ids: number[]) => api.post(`/blog/posts/bulk-${action}/`, { ids });
export const bulkJobs = (action: "publish" | "delete" | "close", ids: number[]) =>
  api.post(`/careers/jobs/bulk-${action}/`, { ids });
export const bulkMediaDelete = (ids: number[]) => api.post("/media/bulk-delete/", { ids });
