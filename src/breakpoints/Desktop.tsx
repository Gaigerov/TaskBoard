import {FC} from 'react';
import {Table} from '../components/Table/Table';
import {Task} from '../types';

interface Props {
    searchedTasks: Task[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
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
