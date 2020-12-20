import Axios from 'axios';

export const API = Axios.create({
  baseURL: 'http://localhost:3001/',
  timeout: 1100,
});
