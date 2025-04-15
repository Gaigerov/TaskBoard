import {FC} from 'react';
import {Breakpoints} from '../Breakpoints/Breakpoints';

interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
}

interface Props {
    searchedTasks: Task[];
    openEditModal: (task: Task) => void;
    openViewModal: (task: Task) => void;
    openRemoveModal: (task: Task) => void;
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
