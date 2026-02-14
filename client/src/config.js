// Configuración del API
const API_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = {
  async get(endpoint) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async post(endpoint, data) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Error en la solicitud');
    }
    return response.json();
  }
};

export default API_URL;
