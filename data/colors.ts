import { useEffect, useState } from 'react';

export interface Colors {
    background: string;
    foreground: string;
    foregroundLighter: string;
    foregroundDarker: string;
    onBackground: string;
    chartBorder: string;
}

const getColors = (): Colors => {
    if (typeof window === 'undefined')
        return {
            background: '',
            foreground: '',
            onBackground: '',
            chartBorder: '',
            foregroundLighter: '',
            foregroundDarker: '',
        };

    const documentElement = window.getComputedStyle(document.documentElement);
    return {
        background: documentElement.getPropertyValue('--background').trim(),
        foreground: documentElement.getPropertyValue('--foreground').trim(),
        onBackground: documentElement.getPropertyValue('--onBackground').trim(),
        chartBorder: documentElement.getPropertyValue('--chartBorder').trim(),
        foregroundLighter: documentElement.getPropertyValue('--foregroundLighter').trim(),
        foregroundDarker: documentElement.getPropertyValue('--foregroundDarker').trim(),
    };
};

/**
 * System theme media query
 */
const prefersDarkTheme = typeof window !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;

export const useColors = (): Colors => {
    const [colors, setColors] = useState<Colors>(getColors);

    useEffect(() => {
        const themeChangeHandler = (e: MediaQueryListEvent) => {
            setColors(getColors());
        };
        prefersDarkTheme?.addEventListener('change', themeChangeHandler);
        return () => {
            prefersDarkTheme?.removeEventListener('change', themeChangeHandler);
        };
    }, []);

    return colors;
};
