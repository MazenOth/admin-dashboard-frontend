import axios from 'axios';
import { User } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getUsers = (roleName: { roleName: string }) =>
  api.get('/users', { params: roleName });
export const createUser = (user: User) => api.post('/users', user);
export const updateUser = (id: number, user: User) =>
  api.put(`/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);
