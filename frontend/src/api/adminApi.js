import apiClient from "@/api/axios";

export const getCountries = async () => {
  const response = await apiClient.get("/countries");
  return response.data;
};

export const createCountryRecord = async (payload) => {
  const response = await apiClient.post("/countries", payload);
  return response.data;
};

export const updateCountryRecord = async (id, payload) => {
  const response = await apiClient.put(`/countries/${id}`, payload);
  return response.data;
};

export const deleteCountryRecord = async (id) => {
  const response = await apiClient.delete(`/countries/${id}`);
  return response.data;
};

export const getAllChecklists = async () => {
  const response = await apiClient.get("/checklist/all");
  return response.data;
};

export const getChecklistByCountry = async (countryId) => {
  const response = await apiClient.get(`/checklist/country/${countryId}`);
  return response.data;
};

export const saveChecklist = async (payload) => {
  const response = await apiClient.post("/checklist", payload);
  return response.data;
};

export const deleteChecklist = async (id) => {
  const response = await apiClient.delete(`/checklist/${id}`);
  return response.data;
};

export const getFaqs = async (params = {}) => {
  const response = await apiClient.get("/faqs", { params });
  return response.data;
};

export const replaceFaqCollection = async (payload) => {
  const response = await apiClient.post("/faqs/replace", payload);
  return response.data;
};

// Admin data endpoints
export const getApplications = async () => {
  const response = await apiClient.get("/admin/applications");
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await apiClient.get(`/applications/${id}`);
  return response.data;
};

export const sendApplicationMessage = async (id, payload) => {
  const response = await apiClient.post(
    `/applications/${id}/messages`,
    payload
  );
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await apiClient.put(`/admin/applications/${id}/status`, {
    status,
  });
  return response.data;
};

export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard-stats");
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getUsers = async (role = null) => {
  const params = role ? { role } : {};
  const response = await apiClient.get("/admin/users", { params });
  return response.data;
};

export const getTeamMembers = async () => {
  return getUsers("team");
};

export const getNormalUsers = async () => {
  return getUsers("user");
};

export const createAdminUser = async (payload) => {
  const response = await apiClient.post("/admin/users", payload);
  return response.data;
};

export const getAllBlogsAdmin = async () => {
  const response = await apiClient.get("/blogs/admin/all");
  return response.data;
};

export const createBlogPost = async (payload) => {
  const response = await apiClient.post("/blogs", payload);
  return response.data;
};

export const updateBlogPost = async (id, payload) => {
  const response = await apiClient.put(`/blogs/${id}`, payload);
  return response.data;
};

export const deleteBlogPost = async (id) => {
  const response = await apiClient.delete(`/blogs/${id}`);
  return response.data;
};
