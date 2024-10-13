import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => {
            setMatches(media.matches);
        };
        media.addListener(listener);
        return () => media.removeListener(listener);
    }, [matches, query]);

    return matches;
}

export const useIsSM = () => useMediaQuery('(min-width: 480px)');
export const useIsMD = () => useMediaQuery('(min-width: 768px)');
export const useIsLG = () => useMediaQuery('(min-width: 1024px)');
export const useIsXL = () => useMediaQuery('(min-width: 1280px)');
