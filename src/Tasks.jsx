import React from 'react';
import {List} from 'react-virtualized';
import {Task} from './Task';

export const Tasks = ({searchedTasks, onEdit, onView, onRemove, onClone, currentTaskId}) => {

    const rowRenderer = ({key, index, style}) => {
        const task = searchedTasks[index]; // Получаем задачу по индексу

        return (
            <div key={key} style={style} width="auto">
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
        <List
            width={700} 
            height={800} // Установите нужную высоту списка
            rowCount={searchedTasks.length} // Количество строк
            rowHeight={130} // Высота каждой строки
            rowRenderer={rowRenderer} // Функция отрисовки строки
            style={{ overflowY: 'auto' }} // Прокрутка по вертикали
        />
    );
};
