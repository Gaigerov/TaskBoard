import {FC} from 'react';
import {Tasks} from '../_Tasks';

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
    onRemove: (task: Task) => void;
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
