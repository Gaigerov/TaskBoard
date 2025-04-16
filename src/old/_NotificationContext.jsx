import React, {createContext, useContext, useState} from 'react';
import {Notification} from './_Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);
    const showNotification = (msg, type) => {
        const newNotification = {id: Date.now(), message: msg, type};
        setNotifications((prev) => [...prev, newNotification]);
        setTimeout(() => {
            handleClose(newNotification.id);
        }, 7000);
    };

    const handleClose = (id) => {
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
