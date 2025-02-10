import React, {createContext, useContext, useEffect, useState} from 'react';
import {APP_LIFECYCLE_STATUS} from './constant';

export const AppLifecycleContext = createContext();

export const requestToBackend = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve;
    }, 5000);
});

export const AppLifecycleProvider = ({children}) => {
    const [lifecycleStatus, setLifecycleStatus] = useState(APP_LIFECYCLE_STATUS.INITIALIZATION);

    useEffect(() => {
        //INITIALIZATION
        requestToBackend()
            .then((result) => {
                console.log({result});
            })
            .then(() => {
                setLifecycleStatus(APP_LIFECYCLE_STATUS.READY);
                console.log(APP_LIFECYCLE_STATUS.READY);
            });
        return () => {
            //DESTROYING
            setLifecycleStatus(APP_LIFECYCLE_STATUS.DESTROYING);
            console.log(APP_LIFECYCLE_STATUS.DESTROYING);
        };
    }, []);

    return (
        <AppLifecycleContext.Provider value={{lifecycleStatus}}>
            {children}
        </AppLifecycleContext.Provider>
    );
};

export const useAppLifecycleStatus = () => {
    return useContext(AppLifecycleContext);
};
