import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://job-finder-api-2537e100618e.herokuapp.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/users/signin', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/users/signup', userData);
    return { status: 'SUCCESS', data: response.data };
  } catch (error) {
    console.error('Registration error:', error);
    return { status: 'FAILED', message: error.response?.data?.message || 'Registration failed' };
  }
};

export const getJobs = async () => {
  try {
    const response = await api.get('/api/jobs');
    return response.data; 
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};


export const applyForJob = async (jobId) => {
  try {
    const response = await api.post('/api/applications', { jobId });
    return response.data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

export const getUserApplications = async () => {
  const response = await api.get('/api/applications/user');
  return response.data;
};

export const getAppliedJobs = async () => {
  try {
    const response = await api.get('/api/applications/applied');
    return response.data;
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    throw error;
  }
};

export const getApplicationStatus = async () => {
  try {
    const response = await api.get('/api/applications/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching application status:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  const response = await api.get('/api/user-profiles');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/user-profiles', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await api.put(`/api/applications/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export const getCompanyProfile = async () => {
  try {
    const response = await api.get('/api/company-profiles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCandidates = async (jobId) => {
  try {
    const response = await api.get(`/api/jobs/${jobId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const updateCompanyProfile = async (profileData) => {
  try {
    const response = await api.put('/api/company-profiles', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/api/users/${userId}/role`, { role });
  return response.data;
};



export const searchJobs = async (params) => {
  try {
    const response = await api.get('/api/jobs/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export const postJob = async (jobData) => {
  try {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error posting job:', error.response?.data || error.message);
    throw error;
  }
};

export const getPostedJobs = async () => {
  try {
    const response = await api.get('/api/jobs', { params: { posted: 'true' } });
    return response.data;
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await api.put(`/api/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};


export const getJobById = async (id) => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};


export const getJobDetails = async (jobId) => {
  try {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

export const getUserCVs = async () => {
  try {
    const response = await api.get('/api/cvs');
    return response.data;
  } catch (error) {
    console.error('Error fetching user CVs:', error);
    throw error;
  }
};

export const uploadCV = async (fileUri, fileName) => {
  try {
    const formData = new FormData();
    formData.append('cv', {
      uri: fileUri,
      type: 'application/pdf',
      name: fileName,
    });

    console.log('Preparing to upload file:', fileName);
    console.log('File URI:', fileUri);

    const response = await api.post('/api/cvs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading CV:', error);
    if (error.response) {
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
      console.log('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.log('Error request:', error.request);
    } else {
      console.log('Error message:', error.message);
    }
    throw error;
  }
};

export const deleteCV = async (cvId) => {
  try {
    const response = await api.delete(`/api/cvs/${cvId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
};



export default api;