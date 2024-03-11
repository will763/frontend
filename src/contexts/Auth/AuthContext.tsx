import { createContext } from 'react';
import { IUserContext } from '../../@Types/AuthUserContext';

export const AuthContext = createContext<IUserContext>(null!)