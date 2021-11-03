interface Colors {
    background: string;
    foreground: string;
    onBackground: string;
    chartBorder: string;
}

export const getColors = (): Colors => {
    if (typeof window === 'undefined') 
        return { 
            background: '',
            foreground: '',
            onBackground: '',
            chartBorder: ''
        };

    const documentElement = window.getComputedStyle(document.documentElement);
    return {
    background: documentElement.getPropertyValue('--background').trim(),
    foreground: documentElement.getPropertyValue('--foreground').trim(),
    onBackground: documentElement.getPropertyValue('--onBackground').trim(),
    chartBorder: documentElement.getPropertyValue('--chartBorder').trim()
  }
}