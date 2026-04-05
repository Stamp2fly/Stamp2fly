import apiClient from '@/api/axios';

export const createApplication = async (payload) => {
	const response = await apiClient.post('/applications', payload);
	return response.data;
};

export const updateApplication = async (id, payload) => {
	const response = await apiClient.put(`/applications/${id}`, payload);
	return response.data;
};

export const uploadApplicationDocuments = async (id, formData) => {
	const response = await apiClient.post(`/applications/${id}/upload`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

export const submitApplication = async (id) => {
	const response = await apiClient.put(`/applications/${id}/submit`);
	return response.data;
};

export const getUserApplications = async ({ userId, phone, email }) => {
	const response = await apiClient.get('/applications', {
		params: { userId, phone, email },
	});
	return response.data;
};

export const getApplicationById = async (id) => {
	const response = await apiClient.get(`/applications/${id}`);
	return response.data;
};

export const sendApplicationMessage = async (id, payload) => {
	const response = await apiClient.post(`/applications/${id}/messages`, payload);
	return response.data;
};
