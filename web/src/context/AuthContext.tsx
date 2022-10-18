import { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, redirect } from "react-router-dom";
import { api } from "../services/api";

type AuthProviderProps = {
  children: ReactNode;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | undefined;
  signOut: () => void;
  handleSignIn: (values: HandleSignInProps) => Promise<void>;
  handleSignUp: (values: HandleSignUpProps) => Promise<void>;
}

type User = {
  id: string,
  name: string,
  username: string,
  email: string,
}

interface HandleSignInProps {
  email: string,
  password: string,
}

interface HandleSignUpProps {
  name: string,
  username: string,
  email: string,
  password: string,
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [cookies, setCookie, removeCookie] = useCookies(['natrave.token']);
  
  const [user, setUser] = useState<User | undefined>(undefined)
  const isAuthenticated = !!user;

  async function handleSignUp(values: HandleSignUpProps) {
    const response = await api.post('/signup', {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
    })

    setUser(response.data.user)

    setCookie('natrave.token', response.data.accessToken, {
      path: '/',
    })
  }

  async function handleSignIn(values: HandleSignInProps) {
    const response = await api.get('/login', {
      auth: {
        username: values.email,
        password: values.password
      }
    })

    setUser(response.data.user)

    setCookie('natrave.token', response.data.accessToken, {
      path: '/',
    })
  }
  
  function signOut() {
    removeCookie('natrave.token') 
    setUser(undefined)
  }

  async function getUser() {
    await api.get('/user', {
      headers: {
        Authorization: `Bearer ${cookies['natrave.token']}`
      }
     }).then(response => {
        setUser(response.data.user)
      })
      .catch((err) => {
        signOut()
      })
  }

  useEffect(() => {
    if(cookies) {
     getUser()
    }
  }, [])


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signOut, handleSignIn, handleSignUp }}>
      {children}
    </AuthContext.Provider>
  )
}