type ColorMapping = { light: string; dark: string }
type ColorTokens = Record<string, ColorMapping>

export const colors = {
  background: { light: '#f0e6e6', dark: '#0a0a0a' },
  foreground: { light: '#171717', dark: '#ededed' },
  scrollbarThumb: { light: 'rgba(0,0,0,0.3)', dark: 'rgba(255,255,255,0.3)' },
  scrollbarThumbHover: {
    light: 'rgba(0,0,0,0.5)',
    dark: 'rgba(255,255,255,0.5)',
  },
  navColor: { light: '#ffffff', dark: '#ededed' },
  navBg: { light: '#292929', dark: '#212121' },
  navBgHover: { light: '#1d1d1d', dark: '#2a2a2a' },
  navIcon: { light: '#f1f1f1', dark: '#ededed' },
  navIconFocused: { light: '#000000', dark: '#ffffff' },
  navLinkDefault: { light: '#f1f1f1', dark: '#171717' },
  navLinkHover: { light: '#ffffff', dark: '#ededed' },
  navLinkText: { light: '#f1f1f1', dark: '#ededed' },
  navAccent: { light: '#3b82f6', dark: '#60a5fa' },
  navLinkActiveAbout: { light: '#2a4cc7', dark: '#143292' },
  navLinkActiveSpotify: { light: '#25be30', dark: '#257b12' },
  navLinkActiveLinkedin: { light: '#0077b5', dark: '#0ea5e9' },
  navLinkActiveAmazon: { light: '#fb8c00', dark: '#fb8c00' },
  logoTileFill: { light: '#171717', dark: '#ededed' },
  logoTileBg: { light: '#f1f1f1', dark: '#171717' },
} satisfies ColorTokens

export type ColorKey = keyof typeof colors
export type ThemeMode = 'light' | 'dark'

export const getColor = (key: ColorKey, mode: ThemeMode): string => colors[key][mode]
