import React from 'react';

import {Task} from '../Task';
export const Tablet = ({onView, onEdit, onClone, onDelete, currentTaskId}) => {
    return (
            <Task
                onView={onView}
                onEdit={onEdit}
                onClone={onClone}
                onDelete={onDelete}
                currentTaskId={currentTaskId}
            />
    );
}
