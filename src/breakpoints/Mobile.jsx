import React from 'react';
// import {List, Autosizer} from 'react-virtualized';

import {Task} from '../Task';
export const Mobile = ({searchedTasks, onView, onEdit, onClone, onRemove, currentTaskId, notification}) => {
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
