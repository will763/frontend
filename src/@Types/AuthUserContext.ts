import { IUserLogged } from "./user";

export interface IUserContext {
  signInMicrosoft: () => void;
  signed: boolean;
  userLogged: IUserLogged;
  signOut: () => Promise<void>;
}