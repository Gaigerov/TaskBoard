import React, {useEffect, useState} from 'react';
import xButton from '../../image/x.svg';
import {VALID_MODE} from '../../constant';
// import { Mobile } from '../../breakpoints/Mobile';
// import { Tablet } from '../../breakpoints/Tablet';
// import { Desktop } from '../../breakpoints/Desktop';

export const FormHeader = ({mode, onClose}) => {
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1200);

    useEffect(() => {
        const handleResize = () => setIsWideScreen(window.innerWidth > 1200);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className='modalRectangle'>
                <div className='rectangle'></div>
            </div>
            <div className="modalHeader">
                <h2 className="modalHeaderName">{mode === VALID_MODE.CREATE ? 'Create Task' : 'Edit Task'}</h2>
                {!isWideScreen && (
                    <div className="modalModeText">
                        <p className="modalRemoveParagraph">Are you sure you want to delete the task "<span className="modalBoldText">
                            {/* {task.title} */}
                        </span>"?</p>
                    </div>
                )}
                <button onClick={onClose}><img className="modalCloseButton" src={xButton} alt="Закрыть" /></button>
            </div>
        </>
    );
};
