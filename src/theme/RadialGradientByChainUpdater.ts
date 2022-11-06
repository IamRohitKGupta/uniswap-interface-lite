import { useEffect } from 'react'
import { useDarkModeManager } from '../state/user/hooks'


const initialStyles = {
  width: '200vw',
  height: '200vh',
  transform: 'translate(-50vw, -100vh)',
}
const backgroundResetStyles = {
  width: '100vw',
  height: '100vh',
  transform: 'unset',
}

type TargetBackgroundStyles = typeof initialStyles | typeof backgroundResetStyles

const backgroundRadialGradientElement = document.getElementById('background-radial-gradient')
const setBackground = (newValues: TargetBackgroundStyles) =>
  Object.entries(newValues).forEach(([key, value]) => {
    if (backgroundRadialGradientElement) {
      backgroundRadialGradientElement.style[key as keyof typeof backgroundResetStyles] = value
    }
  })
export default function RadialGradientByChainUpdater(): null {
  const [darkMode] = useDarkModeManager()
  // manage background color
  useEffect(() => {
    if (!backgroundRadialGradientElement) {
      return
    }

    setBackground(initialStyles)
        const defaultLightGradient =
        'linear-gradient(-45deg, #ffa184, #ff8bb7, #80ddff, #86ffe3)'
        const defaultDarkGradient = 'linear-gradient(-45deg, #ee77527a, #e73c7e7a, #23a6d57a, #23d5ab7a)'
        backgroundRadialGradientElement.style.background = darkMode ? defaultDarkGradient : defaultLightGradient

  }, [darkMode])
  return null
}
