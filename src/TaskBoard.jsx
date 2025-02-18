import React from 'react';
import './config/App.css';
import {Breakpoints} from './Breakpoints';

export const TaskBoard = ({searchedTasks, openEditModal, openViewModal, openRemoveModal, cloneTask, deleteMode, currentTaskId}) => {

    return (
        <>
            <div className="tasksContainer">
                <div className="tasksContainer__scroller">
                    <Breakpoints
                        searchedTasks={searchedTasks}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onClone={cloneTask}
                        onRemove={openRemoveModal}
                        currentTaskId={currentTaskId}
                        deleteMode={deleteMode}
                    />
                </div>
            </div>
        </>
    );
};
