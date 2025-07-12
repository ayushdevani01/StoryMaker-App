import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Points to the backend server
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
