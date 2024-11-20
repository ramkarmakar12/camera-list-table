/*import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api-app-staging.wobot.ai/app/v1',
  headers: { Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy` },
});

export const fetchCameras = async () => API.get('/fetch/cameras');
export const updateCameraStatus = async (id, status) =>
  API.post('/update/camera/status', { id, status });

*/

import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: 'https://api-app-staging.wobot.ai/app/v1',
});

// Add Bearer token to all requests
API.interceptors.request.use(
  (config) => {
    const token = '4ApVMIn5sTxeW7GQ5VWeWiy'; // Replace with your actual token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch cameras
export const fetchCameras = async () => {
  try {
    const response = await API.get('/fetch/cameras');
    return response.data; // Return the data directly
  } catch (error) {
    console.error('Error fetching cameras:', error);
    throw error; // Handle errors
  }
};

// Update camera status
export const updateCameraStatus = async (id, status) => {
  try {
    const response = await API.put('/update/camera/status', { id, status });
    return response.data;
  } catch (error) {
    console.error('Error updating camera status:', error);
    throw error; // Handle errors
  }
};
