import React, {useState, useEffect} from 'react';

export const Popover = ({content, children}) => {
    const [isVisible, setIsVisible] = useState(false);

    const togglePopover = () => {
        setIsVisible(!isVisible);
    };

    const handleClickOutside = (event) => {
        if (event.target.closest('.popover-container') === null) {
            setIsVisible(false);
        }
    };


    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="popover" onClick={(e) => e.stopPropagation()}>
            <div onClick={togglePopover} className='toDoButton'>
                {children}
            </div>
            {isVisible && (
                <div className="popoverStyle">
                    <select className='statusSelector'>
                        <option value="To Do" className='statusSelector__toDo'>To Do</option>
                        <option value="In progress" className='statusSelector__inProgress'>In progress</option>
                        <option value="Done" className='statusSelector__done'>Done</option>
                    </select>
                </div>
            )}
        </div>
    );
};
