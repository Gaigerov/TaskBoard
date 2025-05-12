import React, {useState} from 'react';
import './Notification.scss';
import checkCircle from '../../image/сheckСircle.svg';
import alertCircle from '../../image/alertCircle.svg';
import helpCircle from '../../image/helpCircle.svg';
import messageCircle from '../../image/messageCircle.svg';
import xCircle from '../../image/xCircle.svg';

type Props = {
    message: string;
    type: string;
    onClose: () => void;
}

export const Notification: React.FC<Props> = ({message, type, onClose}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClick = () => {
        setIsVisible(!isVisible);
        onClose();
    };

    const getBackgroundColor = (type: string) => {
        return (() => {
            if (type === 'error') return 'rgb(255, 150, 160)';
            if (type === 'warning') return 'rgb(255, 227, 142)';
            if (type === 'success') return 'rgb(51, 228, 146)';
            if (type === 'info') return 'rgb(171, 241, 255)';
            return 'rgb(179, 189, 199)';
        })();
    };

    const getTitleNotification = (type: string) => {
        return (() => {
            if (type === 'error') return 'Error';
            if (type === 'warning') return 'Warning';
            if (type === 'success') return 'Success';
            if (type === 'info') return 'Info';
            return 'Notification';
        })();
    };

    const getIconNotification = (type: string) => {
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
        <div className='notification' style={{backgroundColor}} onClick={handleClick}>
            <img className="notification__icon" src={iconNotification} />
            <div className="message">
                <span className="message__title">{titleNotification}</span>
                <span className="message__notification">{message}</span>
            </div>
        </div>
    );
};
