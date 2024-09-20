import api from '../api/api';

const RegistrationService = {
  register: (data) => api.post('/api/auth/register', data),
};

export default RegistrationService;
