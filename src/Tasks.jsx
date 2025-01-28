import React, {useEffect, useRef, useState} from 'react';

import {List} from 'react-virtualized';
import {Task} from './Task';

export const Tasks = ({searchedTasks, onEdit, onView, onRemove, onClone, currentTaskId}) => {

    const listRef = useRef();
    const [listWidth, setListWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (listRef.current) {
                setListWidth(listRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', updateWidth);
        updateWidth();

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    const rowRenderer = ({key, index, style}) => {
        const task = searchedTasks[index];
        return (
            <div key={key} style={{...style, width: '100%'}}>
                <Task
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

    return (
        <div ref={listRef} style={{width: '100%'}}>
            <List
                width={listWidth}
                height={800}
                rowCount={searchedTasks.length}
                rowHeight={130}
                rowRenderer={rowRenderer}
                style={{overflowY: 'auto'}}
            />
        </div>
    );
};
