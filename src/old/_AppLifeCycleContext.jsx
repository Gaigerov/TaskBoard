import React, {createContext, useContext, useEffect, useState} from 'react';
import {APP_LIFECYCLE_STATUS} from '../constant';

export const AppLifecycleContext = createContext();

export const AppLifecycleProvider = ({children}) => {
    const [lifecycleStatus, setLifecycleStatus] = useState(APP_LIFECYCLE_STATUS.INITIALIZATION);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            setIsLoading(true);
            try {
                setLifecycleStatus(APP_LIFECYCLE_STATUS.READY); // Устанавливаем статус готовности
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                setLifecycleStatus(APP_LIFECYCLE_STATUS.ERROR); // Устанавливаем статус ошибки
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    return (
        <AppLifecycleContext.Provider value={{lifecycleStatus}}>
            {!isLoading && children}
        </AppLifecycleContext.Provider>
    );
};

export const useAppLifecycleStatus = () => {
    return useContext(AppLifecycleContext);
};
