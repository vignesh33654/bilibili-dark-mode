import { Storage } from '@plasmohq/storage'
import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['https://app.birdeye.com/*'],
  run_at: 'document_start'
}

const cssText = 
:root {
  --primary-invert-amount: 0.9;
}

/* Apply dark mode to all elements */
html.dark-birdeye {
  filter: invert(var(--primary-invert-amount)) hue-rotate(180deg);
}

/* Invert images and videos back to their original colors */
html.dark-birdeye img,
html.dark-birdeye video {
  filter: invert(1) hue-rotate(180deg);
}

/* Add more specific styles for Birdeye elements here */
html.dark-birdeye .some-specific-class {
  /* Add custom styles */
}
`

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

// Check if the current page should be skipped (if Birdeye has built-in dark pages)
const isSkippedPage = () => {
  const pagesAlreadyInDark = ['/some-dark-page/'] // Add any paths that are already dark
  const currentPath = window.location.pathname
  return pagesAlreadyInDark.includes(currentPath)
}

// Switch dark toggle (dark/light)
export const switchToggle = (darkBirdeyeToggle: boolean) => {
  const htmlElement = document.documentElement
  if (darkBirdeyeToggle && !isSkippedPage()) {
    htmlElement.classList.add('dark-birdeye')
  } else {
    htmlElement.classList.remove('dark-birdeye')
  }

  console.log('Dark Toggle switched to ' + darkBirdeyeToggle)
}

// Switch dark mode (dark/light/system)
export const switchMode = (darkBirdeyeMode: string) => {
  console.log('Dark Mode is ' + darkBirdeyeMode)

  if (darkBirdeyeMode === 'dark') {
    switchToggle(true)
  } else if (darkBirdeyeMode === 'light') {
    switchToggle(false)
  } else {
    const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    switchToggle(isDarkMode())
  }
}

// Load or reload dark mode
const loadDarkMode = () => {
  const storage = new Storage()
  storage.get<string>('darkBirdeyeMode').then((darkBirdeyeMode) => {
    if (typeof darkBirdeyeMode === 'undefined') {
      storage.get<boolean>('darkBirdeyeToggle').then((darkBirdeyeToggle) => {
        if (typeof darkBirdeyeToggle === 'undefined') {
          switchMode('dark')
        } else {
          switchMode(darkBirdeyeToggle ? 'dark' : 'light')
        }
      })
    } else {
      switchMode(darkBirdeyeMode)
    }
  })
}

// Initialize dark mode
loadDarkMode()

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (request) {
  switchMode(request.darkBirdeyeMode)
})

// Listen for system dark mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  loadDarkMode()
})
