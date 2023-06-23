// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

if (typeof window === 'object') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target as Element

      if (mutation.attributeName === 'class') {
        const newValue = target.getAttribute(mutation.attributeName)
        if (newValue.includes('dark')) {
          target.setAttribute('style', 'color-scheme: dark')
        } else {
          target.removeAttribute('style')
        }
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
    childList: false,
  });
}



export default DefaultTheme
