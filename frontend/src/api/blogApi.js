import apiClient from '@/api/axios';

export const getPublishedBlogs = async () => {
  const response = await apiClient.get('/blogs');
  return response.data;
};

export const getPublishedBlogBySlug = async (slug) => {
  const response = await apiClient.get(`/blogs/${slug}`);
  return response.data;
};

export const getAllBlogsAdmin = async () => {
  const response = await apiClient.get('/blogs/admin/all');
  return response.data;
};

export const createBlog = async (payload) => {
  const response = await apiClient.post('/blogs', payload);
  return response.data;
};

export const updateBlog = async (id, payload) => {
  const response = await apiClient.put(`/blogs/${id}`, payload);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await apiClient.delete(`/blogs/${id}`);
  return response.data;
};
