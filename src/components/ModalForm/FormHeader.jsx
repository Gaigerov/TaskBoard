import React, {useEffect, useState} from 'react';
import xButton from '../../image/x.svg';
import {VALID_MODE} from '../../constant';

export const FormHeader = ({task, mode, onClose}) => {

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
            {mode === VALID_MODE.CREATE && (
                <div className="modalHeader">
                    <h2 className="modalHeaderName">Create Task</h2>
                    <div onClick={onClose}><img className="modalCloseButton" src={xButton} alt="Закрыть" /></div>
                </div>
            )}
            {mode === VALID_MODE.EDIT && (
                <div className="modalHeader">
                    <h2 className="modalHeaderName">Edit Task</h2>
                    <div onClick={onClose}><img className="modalCloseButton" src={xButton} alt="Закрыть" /></div>
                </div>
            )}
            {mode === VALID_MODE.VIEW && (
                <div className="modalHeader">
                    <h2 className="modalHeaderName">
                        {/* {task.title} */}
                    </h2>
                    <div onClick={onClose}><img className="modalCloseButton" src={xButton} alt="Закрыть" /></div>
                </div>
            )}
            {mode === VALID_MODE.REMOVE && (
                <div className="modalModeText">
                    <h2 className="modalHeaderName">Remove Task</h2>
                    <p className="modalRemoveParagraph">Are you sure you want to delete the task "
                        <span className="modalBoldText">
                            {/* {task.title} */}
                        </span>
                        "?</p>
                </div>
            )}
            {mode === VALID_MODE.FILTER && (
                <div className="modalHeader">
                    <h2 className="modalHeaderName">
                        Filter Task
                    </h2>
                    <div onClick={onClose}><img className="modalCloseButton" src={xButton} alt="Закрыть" /></div>
                </div>
            )}
        </>
    );
};
