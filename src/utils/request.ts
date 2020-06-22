import axios from 'axios';

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  baseURL: '',
  timeout: 30000
});

service.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

service.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data;
  } else {
    Promise.reject(response);
  }
}, error => {
  return Promise.reject(error);
});

export default service;
