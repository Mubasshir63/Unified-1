// FIX: Import React to make types like React.Dispatch and React.SetStateAction available.
import React, { createContext } from 'react';
import type { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});