import api from '@/shared/lib/api';

export const messageApi = {
  getMessages: async (conversationId, params = {}) => {
    const { limit = 50, offset = 0 } = params;
    const response = await api.get(`/messages/${conversationId}`, {
      params: { limit, offset },
    });
    return response.data;
  },
};

