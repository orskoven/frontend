import api from '../api/api';

const ThreatActorService = {
  getAll: () => api.get('/api/threatactors'),
  getById: (id) => api.get(`/api/threatactors/${id}`),
  create: (data) => api.post('/api/threatactors', data),
  update: (id, data) => api.put(`/api/threatactors/${id}`, data),
  delete: (id) => api.delete(`/api/threatactors/${id}`),
};

export default ThreatActorService;
