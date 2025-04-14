import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Notification} from './Notification';

interface NotificationType {
    id: number;
    message: string;
    type: string;
}

type NotificationContextType = (msg: string, type: string) => void;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type Props = {
    children: ReactNode; 
}

export const NotificationProvider: React.FC<Props> = ({children}) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const showNotification = (msg: string, type: string) => {
        const newNotification = {id: Date.now(), message: msg, type};
        setNotifications((prev) => [...prev, newNotification]);
        setTimeout(() => {
            handleClose(newNotification.id);
        }, 7000);
    };

    const handleClose = (id: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            <div className="notificationList">
                {notifications.length > 0 && (
                    notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            message={notification.message}
                            type={notification.type}
                            onClose={() => handleClose(notification.id)}
                        />
                    ))
                )}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};
