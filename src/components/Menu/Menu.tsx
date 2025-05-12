import {useState, FC} from 'react';
import listCheck from '../../image/list-check-2.svg';
import calendarToDo from '../../image/calendar-todo-line.svg';
import webBoard from '../../image/web-board.svg';

export const menuItems = [
    {src: listCheck, title: 'Tasks'},
    {src: calendarToDo, title: 'Calendar'},
    {src: webBoard, title: 'Board'},
];

interface ButtonProps {
    src: string;
    title: string;
    isActive: boolean;
    onClick: () => void;
}

interface MenuProps {
    goToCalendar: () => void;
    goToTaskBoard: () => void;
}

const MenuButton: FC<ButtonProps> = ({src, title, isActive, onClick}) => (
    <div className={`menu__buttonContainer ${isActive ? 'active' : ''}`} onClick={onClick}>
        <img className="menu__buttonImage" src={src} alt={title} />
        <h3 className='menu__buttonTitle'>{title}</h3>
    </div>
);

export const Menu: FC <MenuProps> = ({goToTaskBoard, goToCalendar}) => {
    const [activeItem, setActiveItem] = useState('Tasks');

    const handleButtonClick = (title: string) => {
        setActiveItem(title);
        if (title === 'Tasks') {
            goToTaskBoard();
        } 
        else {
            goToCalendar();
        }
    };

    return (
        <div className='menu'>
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
