import React from 'react';

import {Task} from '../Task';
export const Tablet = ({searchedTasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {
    return (
        <Task
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onDelete={onDelete}
            currentTaskId={currentTaskId}
        />
    );
}
