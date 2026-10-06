import { createContext, useMemo, useState } from 'react'
import { loginApi } from '../api/apiService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username'))

  const login = async (username, password) => {
    const data = await loginApi({ username, password })
    const loggedInUsername = data.username || data.user?.username || username

    localStorage.setItem('token', data.token)
    localStorage.setItem('username', loggedInUsername)
    setToken(data.token)
    setUsername(loggedInUsername)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
  }

  const value = useMemo(
    () => ({
      token,
      username,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, username],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
