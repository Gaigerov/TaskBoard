import React from 'react';

import {Tasks} from '../Tasks';
export const Mobile = ({searchedTasks, onView, onEdit, onClone, onRemove, currentTaskId}) => {
    return (
        <Tasks
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            currentTaskId={currentTaskId}
        />
    );
}
