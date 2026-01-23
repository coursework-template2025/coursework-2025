import api from '@/shared/lib/api';

export const userApi = {
  register: async (data) => {
    const response = await api.post('/users/register/', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/users/login/', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },

  searchUsers: async (username) => {
    const response = await api.get('/users/', {
      params: { username },
    });
    return response.data;
  },
};

