import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN')
  config.headers.Authorization = `Bearer ${token}`
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
    config.headers['Accept'] = 'application/json';
    if (config.method === 'put'){
      config.method = 'post';
      config.data.append('_method', 'put');
    }
  }
  return config;
}, function (error) {

});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    if (response.status == 401) {
      localStorage.removeItem('ACCESS_TOKEN')
    }
    nsole.log('error-->> ', error)
    throw error;
  });

export default axiosClient
