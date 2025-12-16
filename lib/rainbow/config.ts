import { darkTheme, type Theme } from '@rainbow-me/rainbowkit'

export const customTheme: Theme = darkTheme({
  accentColor: '#6366f1',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
})

customTheme.colors.modalBackground = '#12121a'
customTheme.colors.modalBorder = '#27272a'
customTheme.colors.profileForeground = '#12121a'
customTheme.colors.actionButtonBorder = '#27272a'
customTheme.colors.connectButtonBackground = '#12121a'
customTheme.colors.connectButtonInnerBackground = '#1e1e2e'
