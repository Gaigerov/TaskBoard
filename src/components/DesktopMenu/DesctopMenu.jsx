import React from 'react';
import listCheck from '../../image/list-check-2.svg';
import calendarToDo from '../../image/calendar-todo-line.svg';
import webBoard from '../../image/web-board.svg';

export const DesktopMenu = () => {

    return (
        <div className='menuContainer'>
            <div className='Menu_buttonContainer'>
                <img className="Menu_buttonImage" src={listCheck} />
                <h3 className='Menu_buttonTitle'>Tasks</h3>
            </div>
            <div className='Menu_buttonContainer'>
                <img className="Menu_buttonImage" src={calendarToDo} />
                <h3 className='Menu_buttonTitle'>Calendar</h3>
            </div>
            <div className='Menu_buttonContainer'>
                <img className="Menu_buttonImage" src={webBoard} />
                <h3 className='Menu_buttonTitle'>Board</h3>
            </div>
        </div>
    );
};
