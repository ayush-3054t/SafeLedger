import api from './api';

export { default } from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const logout = () => api.post('/auth/logout');

export const getAccounts = () => api.get('/accounts');

export const createAccount = () => api.post('/accounts');

export const getAccountBalance = (accountId) => api.get(`/accounts/balance/${accountId}`);

export const createTransaction = ({ fromAccount, toAccount, amount, idempotencyKey }) =>
  api.post('/transactions', { fromAccount, toAccount, amount, idempotencyKey });

export const getTransactions = () => api.get('/transactions');
export const getAdminTransactions = () => api.get('/transactions/all');
export const createInitialFunds = ({ toAccount, amount, idempotencyKey }) =>
  api.post('/transactions/system/initial-funds', { toAccount, amount, idempotencyKey });

export const topUpAccount = ({ accountId, amount, idempotencyKey }) =>
  api.post(`/accounts/${accountId}/top-up`, { amount, idempotencyKey });
