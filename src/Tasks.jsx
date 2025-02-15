import React, {useEffect, useRef, useState} from 'react';
import {List} from 'react-virtualized';
import {Task} from './Task';

export const Tasks = ({searchedTasks, onEdit, onView, onRemove, onClone, currentTaskId}) => {

    const listRef = useRef();
    const [listWidth, setListWidth] = useState(0);
    const [listHeight, setListHeight] = useState(0);

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

    
    const rowRenderer = ({key, index, style}) => {
        const task = searchedTasks[index];
        return (
            <div key={key} style={{...style, height: '100%'}}>
                <Task
                    searchedTasks={searchedTasks}
                    task={task}
                    onEdit={onEdit}
                    onView={onView}
                    onRemove={onRemove}
                    onClone={onClone}
                    currentTaskId={currentTaskId}
                />
            </div>
        );
    }

const calculatedHeight = listHeight > 0 ? listHeight : 800;
    return (
        <div ref={listRef} style={{ height: '100%', overflow: 'hidden' }}>
            <List
                width={listWidth}
                height={calculatedHeight}
                rowCount={searchedTasks.length}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                style={{ overflowY: 'auto', overflowX: 'hidden' }}
            />
        </div>
    );
};
