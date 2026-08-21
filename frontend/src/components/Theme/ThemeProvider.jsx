import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'edumaster:theme'

function readInitialTheme() {
  if (typeof document !== 'undefined') {
    const appliedTheme = document.documentElement.dataset.theme
    if (appliedTheme === 'dark' || appliedTheme === 'light') return appliedTheme
  }

  try {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
  } catch {
    // Storage may be unavailable in private browsing; the theme still works.
  }

  // EduMaster always starts in its completed light theme. The stored choice is
  // the only thing that may opt a returning visitor into dark mode.
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme)

  const setTheme = useCallback((nextTheme) => {
    const resolvedTheme = nextTheme === 'dark' ? 'dark' : 'light'
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      resolvedTheme === 'dark' ? '#081426' : '#14213d',
    )
    try {
      localStorage.setItem(THEME_KEY, resolvedTheme)
    } catch {
      // Keep the in-memory preference if persistent storage is unavailable.
    }
    setThemeState(resolvedTheme)
  }, [])

  const value = useMemo(() => ({ theme, setTheme, isDark: theme === 'dark' }), [setTheme, theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
