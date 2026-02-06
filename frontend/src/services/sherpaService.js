import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_SHERPA_API_KEY;
const API_URL = 'https://api.joinsherpa.com/v2';

const sherpaApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

sherpaApiClient.interceptors.request.use((config) => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    const errorMsg = 'Sherpa API key is not configured. Please add it to your .env file.';
    console.error(errorMsg);
    toast({
      title: 'Configuration Error',
      description: errorMsg,
      variant: 'destructive',
    });
    return Promise.reject(new Error(errorMsg));
  }
  config.headers['Authorization'] = `Bearer ${API_KEY}`;
  return config;
});

sherpaApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred';
    console.error(`Sherpa API Error: ${errorMessage}`);
    toast({
      title: 'API Error',
      description: `Could not fetch data from Sherpa. ${errorMessage}`,
      variant: 'destructive',
    });
    return Promise.reject(error);
  }
);

export const getCountries = async () => {
  try {
    return await sherpaApiClient.get('/countries');
  } catch (error) {
    return null;
  }
};

export const getVisaRequirements = async (nationality, destination, tripPurpose = 'TOURISM') => {
  try {
    const params = {
      nationality,
      destination,
      trip_purpose: tripPurpose,
    };
    return await sherpaApiClient.get('/entry-requirements', { params });
  } catch (error) {
    return null;
  }
};