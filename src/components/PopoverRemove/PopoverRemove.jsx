import React, {useState, useEffect} from 'react';
import {Button} from '../Button/Button';
import {modalActions} from '../../redux/modalStore';

export const PopoverRemove = ({children, task, onRemove}) => {
    const [isShow, setIsShow] = useState(false);
    
    const tooglePopup = () => {
        setIsShow(!isShow);
    };

    const handleRemoveTask = (task) => {
        onRemove(task);
        dispatch(modalActions.resetModalData());
        setIsShow(false);
    }

    const handleClickOutside = (event) => {
        if (event.target.closest('.popoverRemove') === null) {
            setIsShow(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <span className="Container__remove" onClick={tooglePopup}>
            {children}
            {isShow && (
                <div className="popper">
                    <h2 className="modalRemoveParagraph">Remove the task?</h2>
                    <div className='buttonContainer'>
                        <Button
                            type="remove"
                            onClick={() => handleRemoveTask(task)}
                            name="Remove"
                        />
                        <Button
                            type="cancel"
                            onClick={tooglePopup}
                            name="Cancel"
                        />
                    </div>
                </div>
            )}
        </span>
    );
};
