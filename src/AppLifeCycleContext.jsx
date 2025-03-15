import React, {createContext, useContext, useEffect, useState} from 'react';
import {APP_LIFECYCLE_STATUS} from './constant';
import {Loader} from './components/Loader/Loader';
import {getSimpleData} from './components/api/getStorage';

export const AppLifecycleContext = createContext();

// export const requestToBackend = () => new Promise((resolve) => {
//     setTimeout(() => {
//         resolve();
//     }, 3000);
// });

export const requestToBackend = async () => {
    try {
        const data = await getSimpleData();
        return data;
    } catch (error) {
        throw error;
    }
};

export const AppLifecycleProvider = ({children}) => {
    const [lifecycleStatus, setLifecycleStatus] = useState(APP_LIFECYCLE_STATUS.INITIALIZATION);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            setIsLoading(true);

            try {
                const data = await requestToBackend();
                console.log('Полученные данные:', data);
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

    // useEffect(() => {
    //     const initializeApp = async () => {
    //         try {
    //             await requestToBackend();
    //             setLifecycleStatus(APP_LIFECYCLE_STATUS.READY);
    //             console.log(APP_LIFECYCLE_STATUS.READY);
    //         } catch (error) {
    //             console.error('Ошибка инициализации приложения:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     initializeApp();
    //     return () => {
    //         setLifecycleStatus(APP_LIFECYCLE_STATUS.DESTROYING);
    //         console.log(APP_LIFECYCLE_STATUS.DESTROYING);
    //     };
    // }, []);

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
