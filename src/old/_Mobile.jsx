import React from 'react';
import {Tasks} from './_Tasks';

export const Mobile = ({searchedTasks, onView, onEdit, onClone, onRemove}) => {
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
