interface Colors {
  background: string;
  foreground: string;
}

export const getColors = (): Colors => {
  if (typeof window === 'undefined') return { background: '', foreground: '' };
  return {
    background: window.getComputedStyle(document.documentElement).getPropertyValue('--background').trim(),
    foreground: window.getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(),
  }
}