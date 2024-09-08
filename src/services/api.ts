import axios from 'axios';
import { User } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Users Endpoints
export const getUsers = (roleName: { roleName: string }) =>
  api.get('/users', { params: roleName });
export const createUser = (user: User) => api.post('/users', user);
export const updateUser = (id: number, user: User) =>
  api.put(`/users/${id}`, user);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);

// Matchings Endpoints
export const getUnmatchedClients = (paginationOptions: {
  size: number;
  page: number;
}) => api.get('/matchings/unmatched/clients', { params: paginationOptions });
export const getPotentialMatches = (
  clientId: number,
  paginationOptions: {
    size: number;
    page: number;
  }
) =>
  api.get(`/matchings/potential/${clientId}`, {
    params: paginationOptions,
  });
export const getMatchedUsers = (paginationOptions: {
  size: number;
  page: number;
}) => api.get(`/matchings/users`, { params: paginationOptions });
export const assignHelper = (id: { clientId: number; helperId: number }) =>
  api.post(`/matchings/assign`, id);
export const unassignHelper = (id: { clientId: number; helperId: number }) =>
  api.post(`/matchings/unassign`, id);
