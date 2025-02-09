import React, {useEffect, useRef, useState} from 'react';
import {List} from 'react-virtualized';
import {Task} from './Task';

export const Tasks = ({searchedTasks, onEdit, onView, onRemove, onClone, currentTaskId}) => {

    const listRef = useRef();
    const [listWidth, setListWidth] = useState(0);
    const rowHeight = 130;

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

    const listHeight = Math.min(searchedTasks.length * rowHeight, 800);

    return (
        <div ref={listRef} >
            <List
                width={listWidth}
                height={listHeight}
                paddingRight='50px'
                rowCount={searchedTasks.length}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                style={{overflowY: 'auto', overflowX: 'hidden'}}
            />
        </div>
    );
};
