import { useEffect, useState } from "react";
import { IUserLogged } from "../../@Types/user";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {

  const [userLogged, setUserLogged] = useState<IUserLogged>(null!)

  function signInMicrosoft() {
    axios.get('http://localhost:3000/api/v1/auth/account', {
      withCredentials: true
    }).then(({ data }) => {
      setUserLogged({
        displayName: data.name,
        email: data.email
      });
    });
  }

  async function signOut() {
    window.location.href = 'http://localhost:3000/api/v1/auth/logout'

  }

  // useEffect(() => {

  //   const loadStoreAuth = () => {

  //     if (sessionUser && sessionToken) {
  //       const { displayName, email } = JSON.parse(sessionUser)
  //       setUserLogged({
  //         ...userLogged,
  //         displayName: displayName,
  //         email: email
  //       })
  //     }
  //   }

  //   loadStoreAuth()

  // }, [])


  return (
    <AuthContext.Provider value={{ signInMicrosoft, userLogged, signOut, signed: false }}>
      {children}
    </AuthContext.Provider>
  )
}