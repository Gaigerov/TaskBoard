import React from 'react';
import './config/App.css';
import {Breakpoints} from './components/Breakpoints/Breakpoints';

export const TaskBoard = ({searchedTasks, openEditModal, openViewModal, openRemoveModal, cloneTask, deleteMode}) => {

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
                        deleteMode={deleteMode}
                    />
                </div>
            </div>
        </>
    );
};
