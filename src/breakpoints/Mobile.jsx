import React from 'react';

import {Task} from '../Task';

export const Mobile = ({tasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {

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
