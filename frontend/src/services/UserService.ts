/**
 * User service for managing user operations
 */
import { httpClient } from './HttpClient';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export class UserService {
  async getProfile(): Promise<User> {
    return httpClient.get('/user/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return httpClient.put('/user/profile', data);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await httpClient.post('/user/change-password', { oldPassword, newPassword });
  }

  async logout(): Promise<void> {
    await httpClient.post('/user/logout');
  }
}

export const userService = new UserService();
