import React, { useState, useEffect } from 'react';

import {Desktop} from './breakpoints/Desktop';
import {Tablet} from './breakpoints/Tablet';
import {Mobile} from './breakpoints/Mobile';
import { throttle } from 'lodash';

function getBreakpoint(width) {
    if (width < 770) {
        return 'mobile'
    }
    if (width < 1200) {
        return 'tablet'
    }

    return 'desktop'
}

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setBreakpoint(getBreakpoint(width));
    }
    const handleResizeThrottle = throttle(handleResize, 300);

    window.addEventListener('resize', handleResizeThrottle); // Использование lodash для предотвращения слишком частых вызовов

    return () => window.removeEventListener('resize', handleResizeThrottle);
  }, []);

  return breakpoint;
}

export const Breakpoints = ({searchedTasks, onView, onEdit, onClone, onRemove, currentTaskId, deleteMode}) => {
    const breakpoint = useBreakpoint();

    return (
        <>
            {breakpoint === 'mobile' && 
            <Mobile
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            currentTaskId={currentTaskId}
            />}
            {breakpoint === 'tablet' && 
            <Tablet
            searchedTasks={searchedTasks} 
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            currentTaskId={currentTaskId}
            />}
            {breakpoint === 'desktop' && 
            <Desktop 
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            currentTaskId={currentTaskId}
            deleteMode= {deleteMode}
            />}
        </>
    );
};
