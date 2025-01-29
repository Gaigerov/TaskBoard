import { useState, useEffect } from 'react';
import { throttle } from 'lodash';

function getBreakpoint(width) {
    if (width < 770) {
        return 'mobile';
    }
    if (width < 1200) {
        return 'tablet';
    }
    return 'desktop';
}

export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            setBreakpoint(getBreakpoint(width));
        }
        const handleResizeThrottle = throttle(handleResize, 300);

        window.addEventListener('resize', handleResizeThrottle); 

        return () => window.removeEventListener('resize', handleResizeThrottle);
    }, []);

    return breakpoint;
}
