import React from 'react';

import {Task} from '../Task';

export const Tablet = ({tasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {
console.log(currentTaskId)
    return (
        tasks.map((task) => (
            <Task
                key={task.id}
                task={task}
                onView={onView}
                onEdit={onEdit}
                onClone={onClone}
                onDelete={onDelete}
                currentTaskId={currentTaskId}
            />
        ))
    );
}
