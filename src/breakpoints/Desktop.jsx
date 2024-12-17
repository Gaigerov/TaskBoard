import React from 'react';
import {Table} from '../components/Table';

export const Desktop = ({searchedTasks, onView, onEdit, onClone, onRemove, currentTaskId}) => {

    return (
        <div className="taskContainer">
            <div className="taskContent">
                <Table
                    searchedTasks={searchedTasks}
                    onView={onView}
                    onEdit={onEdit}
                    onClone={onClone}
                    onRemove={onRemove}
                    currentTaskId={currentTaskId}
                />
            </div>
        </div>
    );
}
