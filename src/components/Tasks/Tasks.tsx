import {useEffect, useRef, useState, FC} from 'react';
import {List, ListRowProps} from 'react-virtualized';
import {Task} from '../Task/Task';
import {useBreakpoint} from '../../breakpoints/useBreakpoint';

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
    onEdit: (task: Task) => void;
    onView: (task: Task) => void;
    onClone: (id: number) => void;
    onRemove: (task: Task) => void;
}

export const Tasks: FC<Props> = ({searchedTasks, onEdit, onView, onRemove, onClone}) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [listWidth, setListWidth] = useState<number>(0);
    const [listHeight, setListHeight] = useState<number>(0);
    const breakpoint = useBreakpoint();

    const rowHeight = 130;

    useEffect(() => {
        const updateDimensions = () => {
            if (listRef.current) {
                setListWidth(listRef.current.offsetWidth);
                setListHeight(listRef.current.offsetHeight); // Устанавливаем высоту родительского контейнера
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions(); // Устанавливаем начальные размеры

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);


    const rowRenderer = ({ key, index, style }: ListRowProps) => {
        const task = searchedTasks[index];
        return (
            <div key={key} style={{...style, height: '100%'}}>
                <div style={{padding: breakpoint === 'mobile' ? '0 8px 50px' : '0 32px 50px', height: '100%'}}>
                    <Task
                        task={task}
                        onEdit={onEdit}
                        onView={onView}
                        onRemove={onRemove}
                        onClone={onClone}
                    />
                </div>
            </div>
        );
    }

    const calculatedHeight = listHeight > 0 ? listHeight : 700;
    return (
        <div ref={listRef} style={{height: '100%', overflow: 'hidden', padding: '0 0 50px 0'}}>
            <List
                width={listWidth}
                height={calculatedHeight}
                rowCount={searchedTasks.length}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                style={{overflowY: 'auto', overflowX: 'hidden'}}
            />
        </div>
    );
};
