import Axios from 'axios';

export const API = Axios.create({
  baseURL: 'http://localhost:3001/',
  timeout: 1100,
});

export const APIPaths = {
  connectionState: '/',
  startSession: '/start',
  contacts: (page: number, query: string) => `/contacts/${page}/${query}`,
  useHere: '/use-here',
  qrCode: '/qr-code',
  sendMessage: '/send-message',
};
