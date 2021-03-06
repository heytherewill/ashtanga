import { useEffect, useState } from 'react';

export interface Colors {
    background: string;
    primary: string;
    secondary: string;
    tertiary: string;
    onBackground: string;
    chartBorder: string;
    moondays: string;
}

const getColors = (): Colors => {
    if (typeof window === 'undefined')
        return {
            background: '',
            primary: '',
            secondary: '',
            tertiary: '',
            onBackground: '',
            chartBorder: '',
            moondays: '',
        };

    const documentElement = window.getComputedStyle(document.documentElement);
    return {
        background: documentElement.getPropertyValue('--background').trim(),
        primary: documentElement.getPropertyValue('--primary').trim(),
        secondary: documentElement.getPropertyValue('--secondary').trim(),
        tertiary: documentElement.getPropertyValue('--tertiary').trim(),
        onBackground: documentElement.getPropertyValue('--onBackground').trim(),
        chartBorder: documentElement.getPropertyValue('--chartBorder').trim(),
        moondays: documentElement.getPropertyValue('--moondays').trim(),
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
