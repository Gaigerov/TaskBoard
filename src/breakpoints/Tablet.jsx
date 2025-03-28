import React from 'react';

import {Tasks} from '../Tasks';
export const Tablet = ({searchedTasks, onView, onEdit, onClone, onRemove}) => {
    return (
        <Tasks
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
        />
    );
}
