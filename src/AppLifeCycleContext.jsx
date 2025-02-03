import React, {createContext, useContext, useEffect, useState} from 'react';
// import {useNotification} from './components/Notification/NotificationContext';

export const AppLifeCycleContext = createContext();

export const APP_LIFECYCLE_STATUS = {
    INITIALIZATION: 'INITIALIZATION',
    READY: 'READY',
    DESTROYING: 'DESTROYING',
};

export const AppLifeCycleProvider = ({children}) => {
    // const showNotification = useNotification();
    const [lifecycleStatus, setLifecycleStatus] = useState(APP_LIFECYCLE_STATUS.INITIALIZATION);

    useEffect(() => {
        setLifecycleStatus(APP_LIFECYCLE_STATUS.READY);
        console.log(APP_LIFECYCLE_STATUS.READY);

        return () => {
            setLifecycleStatus(APP_LIFECYCLE_STATUS.DESTROYING);
            console.log(APP_LIFECYCLE_STATUS.DESTROYING);
        };
    }, []);

    return (
        <AppLifeCycleContext.Provider value={{lifecycleStatus}}>
            {children}
        </AppLifeCycleContext.Provider>
    );
};

export const useAppLifeCycle = () => {
    return useContext(AppLifeCycleContext);
};
