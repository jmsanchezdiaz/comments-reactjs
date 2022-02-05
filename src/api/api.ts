import type { IComment, IUser } from '../types';
import { currentUser, comments } from './data.json';

export const api = {
  comments: async (): Promise<IComment[]> => {
    return new Promise<IComment[]>((resolve, reject) =>
      setTimeout(() => resolve(comments), 500),
    );
  },
  user: async (): Promise<IUser> => {
    return new Promise<IUser>((resolve) =>
      setTimeout(() => resolve(currentUser), 500),
    );
  },
};
