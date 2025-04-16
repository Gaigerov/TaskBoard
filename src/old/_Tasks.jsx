import React, {useEffect, useRef, useState} from 'react';
import {List} from 'react-virtualized';
import {Task} from '../Task';
import {useBreakpoint} from '../breakpoints/useBreakpoint';

export const Tasks = ({searchedTasks, onEdit, onView, onRemove, onClone}) => {
    const listRef = useRef();
    const [listWidth, setListWidth] = useState(0);
    const [listHeight, setListHeight] = useState(0);
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


    const rowRenderer = ({key, index, style}) => {
        const task = searchedTasks[index];
        return (
            <div key={key} style={{...style, height: '100%'}}>
                <div style={{padding: breakpoint === 'mobile' ? '0 8px 50px' : '0 32px 50px', height: '100%'}}>
                    <Task
                        searchedTasks={searchedTasks}
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
