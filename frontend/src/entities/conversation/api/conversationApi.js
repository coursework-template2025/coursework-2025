import api from '@/shared/lib/api';

export const conversationApi = {
  getList: async () => {
    const response = await api.get('/conversations/');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/conversations/', data);
    return response.data;
  },

  getParticipants: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/participants`);
    return response.data;
  },

  addParticipant: async (conversationId, data) => {
    const response = await api.post(`/conversations/${conversationId}/participants`, data);
    return response.data;
  },
};

