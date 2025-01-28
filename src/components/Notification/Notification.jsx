import React, {useEffect, useState} from 'react';
import './Notification.css';
import checkCircle from '../../image/сheckСircle.svg';
import alertCircle from '../../image/alertCircle.svg';
import helpCircle from '../../image/helpCircle.svg';
import messageCircle from '../../image/messageCircle.svg';
import xCircle from '../../image/xCircle.svg';

export const Notification = ({message, type, onClose}) => {
    const [isVisible, setIsVisible] = useState(true);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsVisible(false);
    //         onClose();
    //     }, 3000);

    //     return () => clearTimeout(timer);
    // }, [onClose]);

    const handleClick = () => {
        setIsVisible(!isVisible);
        onClose();
    };

    if (!isVisible) return null;

    const backgroundColor =
        type === 'error' ? 'rgb(255, 150, 160)' :
            type === 'warning' ? 'rgb(255, 227, 142)' :
                type === 'success' ? 'rgb(51, 228, 146)' :
                    type === 'info' ? 'rgb(171, 241, 255)' :
                        'rgb(179, 189, 199)'
        ;

    const titleNotification =
        type === 'error' ? 'Error' :
            type === 'warning' ? 'Warning' :
                type === 'success' ? 'Success' :
                    type === 'info' ? 'Info' :
                        'Notification'
        ;

    const iconNotification =
        type === 'error' ? xCircle :
            type === 'warning' ? alertCircle :
                type === 'success' ? checkCircle :
                    type === 'info' ? helpCircle :
                        messageCircle
        ;

    return (
        <div
            className="notificationContainer"
            style={{backgroundColor}}
            onClick={handleClick}
        >
            <img className='iconNotification' src={iconNotification} />
            <div className='messageContainer'>
                <span className='titleNotification'>{titleNotification}</span>
                <span className='messageNotification'>{message}</span>
            </div>
        </div>
    );
};
