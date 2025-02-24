import React from 'react';

import {Desktop} from './breakpoints/Desktop';
import {Tablet} from './breakpoints/Tablet';
import {Mobile} from './breakpoints/Mobile';
import {useBreakpoint} from './breakpoints/useBreakpoint';

export const Breakpoints = ({searchedTasks, onView, onEdit, onClone, onRemove, deleteMode}) => {
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
            />}
            {breakpoint === 'tablet' && 
            <Tablet
            searchedTasks={searchedTasks} 
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            />}
            {breakpoint === 'desktop' && 
            <Desktop 
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            deleteMode= {deleteMode}
            />}
        </>
    );
};
