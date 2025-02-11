import React, {createContext, useContext, useEffect, useState} from 'react';
import {APP_LIFECYCLE_STATUS} from './constant';
import {Loader} from './components/Loader/Loader';

export const AppLifecycleContext = createContext();

export const requestToBackend = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, 3000);
});

export const AppLifecycleProvider = ({children}) => {
    const [lifecycleStatus, setLifecycleStatus] = useState(APP_LIFECYCLE_STATUS.INITIALIZATION);
    const [isLoading, setIsLoading] = useState(true); // Состояние для индикатора загрузки

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await requestToBackend();
                setLifecycleStatus(APP_LIFECYCLE_STATUS.READY);
                console.log(APP_LIFECYCLE_STATUS.READY);
            } catch (error) {
                console.error('Ошибка инициализации приложения:', error);
            } finally {
                setIsLoading(false);
            }
        };
        initializeApp();
        return () => {
            setLifecycleStatus(APP_LIFECYCLE_STATUS.DESTROYING);
            console.log(APP_LIFECYCLE_STATUS.DESTROYING);
        };
    }, []);

    return (
        <AppLifecycleContext.Provider value={{lifecycleStatus}}>
            <Loader open={isLoading} />
            {!isLoading && children}
        </AppLifecycleContext.Provider>
    );
};

export const useAppLifecycleStatus = () => {
    return useContext(AppLifecycleContext);
};
