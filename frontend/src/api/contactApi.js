import apiClient from "@/api/axios";

export const sendContactMessage = async (payload) => {
  const response = await apiClient.post("/contact", payload);
  return response.data;
};