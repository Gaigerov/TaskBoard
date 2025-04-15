import React, {useState} from 'react';
import './Notification.css';
import checkCircle from '../../image/сheckСircle.svg';
import alertCircle from '../../image/alertCircle.svg';
import helpCircle from '../../image/helpCircle.svg';
import messageCircle from '../../image/messageCircle.svg';
import xCircle from '../../image/xCircle.svg';

export const Notification = ({message, type, onClose}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClick = () => {
        setIsVisible(!isVisible);
        onClose();
    };

    const getBackgroundColor = (type) => {
        return (() => {
            if (type === 'error') return 'rgb(255, 150, 160)';
            if (type === 'warning') return 'rgb(255, 227, 142)';
            if (type === 'success') return 'rgb(51, 228, 146)';
            if (type === 'info') return 'rgb(171, 241, 255)';
            return 'rgb(179, 189, 199)';
        })();
    };

    const getTitleNotification = (type) => {
        return (() => {
            if (type === 'error') return 'Error';
            if (type === 'warning') return 'Warning';
            if (type === 'success') return 'Success';
            if (type === 'info') return 'Info';
            return 'Notification';
        })();
    };

    const getIconNotification = (type) => {
        return (() => {
            if (type === 'error') return xCircle;
            if (type === 'warning') return alertCircle;
            if (type === 'success') return checkCircle;
            if (type === 'info') return helpCircle;
            return messageCircle;
        })();
    };

    const backgroundColor = getBackgroundColor(type);
    const titleNotification = getTitleNotification(type);
    const iconNotification = getIconNotification(type);

    if (!isVisible) return null;

    return (
        <div className='notificationContainer' style={{backgroundColor}} onClick={handleClick}>
            <img className="iconNotification" src={iconNotification} />
            <div className="messageContainer">
                <span className="titleNotification">{titleNotification}</span>
                <span className="messageNotification">{message}</span>
            </div>
        </div>
    );
};
