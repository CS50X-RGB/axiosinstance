import axios from 'axios';
import Cookies from 'js-cookie';
import { promptBackendUrl } from '.';
import { adminToken, clientToken, currentUser, currentAdmin, isSuperAdmin } from './localStorage';

let baseUrlExport1: any;

async function main() {
  baseUrlExport1 = await promptBackendUrl();
}

main();

const instance = axios.create({
  baseURL: baseUrlExport1,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "123",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(currentUser) === currentAdmin ? Cookies.get(adminToken) : Cookies.get(clientToken);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      const location = Cookies.get(currentUser) === currentAdmin ? '/admin' : '/';
      Cookies.remove(currentUser);
      Cookies.remove(adminToken);
      Cookies.remove(currentAdmin);
      Cookies.remove(isSuperAdmin);
      window.location.href = location;
    }
    return Promise.reject(error);
  }
);

export default instance;
