const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('careecho_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('careecho_token', token);
    } else {
      localStorage.removeItem('careecho_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('careecho_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.errors = data.errors || null;
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  // --- Auth & Public Endpoints ---
  async getStates() {
    return this.request('/states');
  }

  async getFacilitiesByState(stateId) {
    return this.request(`/facilities/by-state/${stateId}`);
  }

  async register(payload) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async login(phoneNumber, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, password }),
    });
    if (res.data?.accessToken) {
      this.setToken(res.data.accessToken);
    }
    return res;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  // --- Dashboard & Flow Endpoints ---
  async getDashboard() {
    return this.request('/dashboard');
  }

  async getProfile() {
    return this.request('/users/me');
  }

  async submitExpectation(expectationText) {
    return this.request('/expectations', {
      method: 'POST',
      body: JSON.stringify({ expectationText }),
    });
  }

  async getFeedbackEligibility() {
    return this.request('/feedback/eligibility');
  }

  async getExpectationForFeedback() {
    return this.request('/feedback/expectation');
  }

  async submitFeedback(payload) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- Administrative Endpoints ---
  async getAdminReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reports${query ? `?${query}` : ''}`);
  }

  async getAdminUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/users/admin${query ? `?${query}` : ''}`);
  }

  async getAdminStates() {
    return this.request('/states/all');
  }

  async createAdminState(data) {
    return this.request('/states/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleAdminState(id) {
    return this.request(`/states/admin/${id}/status`, { method: 'PATCH' });
  }

  async getAdminFacilities() {
    return this.request('/facilities');
  }

  async createAdminFacility(data) {
    return this.request('/facilities/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleAdminFacility(id) {
    return this.request(`/facilities/admin/${id}/status`, { method: 'PATCH' });
  }

  async getAdminExpectations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/expectations/admin${query ? `?${query}` : ''}`);
  }

  async getAdminFeedback(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/feedback/admin${query ? `?${query}` : ''}`);
  }

  async getAdminAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/audit${query ? `?${query}` : ''}`);
  }
}

export const api = new ApiClient();
