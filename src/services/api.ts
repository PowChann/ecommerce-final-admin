import axios from 'axios';
import { 
  MOCK_USERS, 
  MOCK_PRODUCTS, 
  MOCK_ORDERS, 
  MOCK_CATEGORIES, 
  MOCK_BRANDS, 
  MOCK_TAGS, 
  MOCK_DISCOUNTS, 
  MOCK_STATS, 
  MOCK_CHART_DATA 
} from '@/services/mock-data';

// Use environment variable or default to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookie-based sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle global errors like 401 and Network Errors (Mock Mode)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle Network Errors by returning Mock Data
    if (!error.response && (error.code === 'ERR_CONNECTION_REFUSED' || error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
        console.warn('Backend unreachable. Serving MOCK DATA for:', error.config.url);
        
        const url = error.config.url;
        let mockData = null;
        let meta = { totalPages: 1, total: 10, page: 1, limit: 10 }; // Default meta

        if (url.includes('/users')) mockData = MOCK_USERS;
        else if (url.includes('/products')) mockData = MOCK_PRODUCTS;
        else if (url.includes('/orders')) mockData = MOCK_ORDERS;
        else if (url.includes('/categories')) mockData = MOCK_CATEGORIES;
        else if (url.includes('/brands')) mockData = MOCK_BRANDS;
        else if (url.includes('/tags')) mockData = MOCK_TAGS;
        else if (url.includes('/discounts')) mockData = MOCK_DISCOUNTS;
        else if (url.includes('/stats')) return Promise.resolve({ data: MOCK_STATS }); // Stats often returns object directly
        else if (url.includes('/chart')) return Promise.resolve({ data: MOCK_CHART_DATA });

        if (mockData) {
            return Promise.resolve({
                data: {
                    data: mockData,
                    meta: meta
                }
            });
        }
    }

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/signin')) {
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
