import {FC} from 'react';
import {Desktop} from '../../breakpoints/Desktop';
import {Tablet} from '../../breakpoints/Tablet';
import {Mobile} from '../../breakpoints/Mobile';
import {useBreakpoint} from '../../breakpoints/useBreakpoint';
import {Task} from '../../types';

interface Props {
    searchedTasks: Task[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onClone: (id: number) => void;
    onRemove: (id: number) => void;
    deleteMode: (id: number) => void;
}

export const Breakpoints: FC<Props> = ({searchedTasks, onView, onEdit, onClone, onRemove, deleteMode}) => {
    const breakpoint = useBreakpoint();

    return (
        <>
            {breakpoint === 'mobile' && 
            <Mobile
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            />}
            {breakpoint === 'tablet' && 
            <Tablet
            searchedTasks={searchedTasks} 
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            onRemove={onRemove}
            />}
            {breakpoint === 'desktop' && 
            <Desktop 
            searchedTasks={searchedTasks}
            onView={onView}
            onEdit={onEdit}
            onClone={onClone}
            deleteMode= {deleteMode}
            />}
        </>
    );
};
