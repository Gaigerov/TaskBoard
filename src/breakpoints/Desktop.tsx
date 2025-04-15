import {FC} from 'react';
import {Table} from '../components/Table/Table';

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
    onView: (task: Task) => void;
    onEdit: (task: Task) => void;
    onClone: (id: number) => void;
    deleteMode: (id: number) => void;
}

export const Desktop: FC<Props> = ({searchedTasks, onView, onEdit, onClone, deleteMode}) => {

    return (
        <div className="taskContainer">
            <div className="taskContent">
                <Table
                    searchedTasks={searchedTasks}
                    onView={onView}
                    onEdit={onEdit}
                    onClone={onClone}
                    deleteMode={deleteMode}
                />
            </div>
        </div>
    );
}
