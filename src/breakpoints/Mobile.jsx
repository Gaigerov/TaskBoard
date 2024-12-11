import React from 'react';

import {Task} from '../Task';
export const Mobile = ({searchedTasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {
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
