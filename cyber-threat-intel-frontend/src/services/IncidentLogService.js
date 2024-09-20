import api from '../api/api';

const IncidentLogService = {
  getAll: () => api.get('/api/incidentlogs'),
  getById: (id) => api.get(`/api/incidentlogs/${id}`),
  create: (data) => api.post('/api/incidentlogs', data),
  update: (id, data) => api.put(`/api/incidentlogs/${id}`, data),
  delete: (id) => api.delete(`/api/incidentlogs/${id}`),
};

export default IncidentLogService;
