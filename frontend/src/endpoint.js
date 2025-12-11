import Api from "./Api";   
const BASE = import.meta.env.VITE_API_URL;

export const uploadMarketplaceTemplate = async (formData) => {
  const response = await Api.post(
    `${BASE}/api/marketplaces`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

// Get all marketplace templates
export const getAllMarketplaces = async () => {
  const response = await Api.get(`${BASE}/api/marketplaces`);
  return response.data;
};


export const uploadSellerFile = async (formData) => {
  const response = await Api.post(
    `${BASE}/api/seller/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;  // { columns: [], sampleRows: [] }
};


// Save mapping
export const saveMapping = async (data) => {
  const response = await Api.post(
    `${BASE}/api/mappings`,
    data
  );
  return response.data;
};

// Get all saved mappings
export const getAllMappings = async () => {
  const response = await Api.get(`${BASE}/api/mappings`);
  return response.data;
};


export const login = async (data) => {
  const res = await Api.post(`${BASE}/api/auth/login`, data);
  return res.data;
};