import {FC} from 'react';
import {Breakpoints} from '../Breakpoints/Breakpoints';
import {Task} from '../../types';

interface Props {
    searchedTasks: Task[];
    openEditModal: (id: number) => void;
    openViewModal: (id: number) => void;
    openRemoveModal: (id: number) => void;
    cloneTask: (id: number) => void;
    deleteMode: (id: number) => void;
}

export const TaskBoard: FC<Props> = ({searchedTasks, openEditModal, openViewModal, openRemoveModal, cloneTask, deleteMode}) => {

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
