import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const toggleTheme = () => setDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
