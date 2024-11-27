import React from 'react';

import {Table} from '../components/Table';

export const Desktop = ({tasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {
    console.log(currentTaskId)
    return (
        <div className="taskContainer">
            {/* <div className="taskContent" 
            onClick={() => navigate(`${VALID_MODE.VIEW}?${params}`)}
            > */}
                <Table
                    tasks={tasks}
                    onView={onView}
                    onEdit={onEdit}
                    onClone={onClone}
                    onDelete={onDelete}
                    currentTaskId={currentTaskId}
                />
            </div>
        // </div>
    );
}
