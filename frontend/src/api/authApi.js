import apiClient from '@/api/axios';

export const sendOtp = async ({ phone, fullName, authProvider = 'phone', mode = 'login' }) => {
	const payload = {
		phone,
		authProvider,
		mode,
	};

	if (fullName?.trim()) {
		payload.fullName = fullName.trim();
	}

	const response = await apiClient.post('/auth/send-otp', payload);
	return response.data;
};

export const verifyOtp = async ({ phone, otp }) => {
	const response = await apiClient.post('/auth/verify-otp', {
		phone,
		otp,
	});

	return response.data;
};
