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
  MOCK_CHART_DATA,
  MOCK_PRODUCT_DETAILS, // Import detailed product mock
  MOCK_PRODUCT_VARIANTS, // Import product variants mock
  MOCK_ORDER_DETAILS // Import detailed order mock
} from '@/services/mock-data';

// Use environment variable or default to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 

const api = axios.create({
  baseURL: `${API_URL}/api`,
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

        // Handle specific detailed GET requests
        if (url.match(/\/products\/(p1|p2|p3|p4|p5)$/)) { // Match any product ID in MOCK_PRODUCTS
            const productId = url.split('/').pop();
            const product = MOCK_PRODUCTS.find(p => p.id === productId);
            if (product) {
                return Promise.resolve({ data: { data: product } });
            }
        }
        if (url.match(/\/product-variants\/(p1|p2|p3|p4|p5)$/)) { // Match /product-variants/:productId for products in MOCK_PRODUCTS
            const productId = url.split('/').pop();
            const variants = MOCK_PRODUCT_VARIANTS.filter(v => v.productId === productId);
            if (variants.length > 0) {
                return Promise.resolve({ data: { data: variants } });
            }
        }
        if (url.match(/\/orders\/(o1|o2|o3)$/)) { // Match any order ID in MOCK_ORDERS
            const orderId = url.split('/').pop();
            const order = MOCK_ORDERS.find(o => o.id === orderId);
            if (order) {
                return Promise.resolve({ data: { data: order } });
            }
        }
        // ... add similar logic for other detailed GET endpoints if needed

        // Existing list mocks
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
            // Simulate pagination for list endpoints if needed
            return Promise.resolve({
                data: {
                    data: mockData,
                    meta: meta // You might want to calculate totalPages/total based on mockData.length
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
