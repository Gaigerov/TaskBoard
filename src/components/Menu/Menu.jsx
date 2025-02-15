import React from 'react';
import listCheck from '../../image/list-check-2.svg';
import calendarToDo from '../../image/calendar-todo-line.svg';
import webBoard from '../../image/web-board.svg';

export const menuItems = [
    { src: listCheck, title: 'Tasks' },
    { src: calendarToDo, title: 'Calendar' },
    { src: webBoard, title: 'Board' },
];

const MenuButton = ({src, title, goToTaskBoard, goToCalendar}) => (
    <div className='Menu_buttonContainer' onClick={title === 'Tasks' ? goToTaskBoard : goToCalendar}>
        <img className="Menu_buttonImage" src={src} alt={title} />
        <h3 className='Menu_buttonTitle'>{title}</h3>
    </div>
);

export const Menu = ({goToTaskBoard, goToCalendar}) => {
    return (
        <div className='menuContainer'>
            {menuItems.map((item, index) => (
                <MenuButton key={index} src={item.src} title={item.title} goToTaskBoard={goToTaskBoard} goToCalendar={goToCalendar} />
            ))}
        </div>
    );
};