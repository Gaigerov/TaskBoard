import {FC} from 'react';
import {Tasks} from '../components/Tasks/Tasks';
import {Task} from '../types';

interface Props {
    searchedTasks: Task[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onClone: (id: number) => void;
    onRemove: (id: number) => void;
}

export const Tablet: FC<Props> = ({searchedTasks, onView, onEdit, onClone, onRemove}) => {
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
