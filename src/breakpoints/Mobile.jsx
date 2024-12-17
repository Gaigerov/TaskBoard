import React from 'react';

import {Task} from '../Task';
export const Mobile = ({searchedTasks, onView, onEdit, onClone, onRemove, currentTaskId}) => {
    return (
        <Task
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            currentTaskId={currentTaskId}
        />
    );
}
