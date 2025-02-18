import React, { useState } from 'react';
import listCheck from '../../image/list-check-2.svg';
import calendarToDo from '../../image/calendar-todo-line.svg';
import webBoard from '../../image/web-board.svg';

export const menuItems = [
    { src: listCheck, title: 'Tasks' },
    { src: calendarToDo, title: 'Calendar' },
    { src: webBoard, title: 'Board' },
];

const MenuButton = ({ src, title, isActive, onClick }) => (
    <div className={`Menu_buttonContainer ${isActive ? 'active' : ''}`} onClick={onClick}>
        <img className="Menu_buttonImage" src={src} alt={title} />
        <h3 className='Menu_buttonTitle'>{title}</h3>
    </div>
);

export const Menu = ({ goToTaskBoard, goToCalendar }) => {
    const [activeItem, setActiveItem] = useState('Tasks');

    const handleButtonClick = (title) => {
        setActiveItem(title);
        if (title === 'Tasks') {
            goToTaskBoard();
        } else {
            goToCalendar();
        }
    };

    return (
        <div className='menuContainer'>
            {menuItems.map((item, index) => (
                <MenuButton 
                    key={index} 
                    src={item.src} 
                    title={item.title} 
                    isActive={activeItem === item.title}
                    onClick={() => handleButtonClick(item.title)}
                />
            ))}
        </div>
    );
};
