// import React, {createContext, useContext, useState, useEffect} from 'react';
// import {TASK_STATUS} from './constant';
// import {useNotification} from './components/Notification/NotificationContext';

// export const GlobalStoreContext = createContext();

// const jsonParse = (data) => {
//     try {
//         return JSON.parse(data);
//     } catch (error) {
//         useNotification('Ошибка при парсинге JSON:', 'error');
//         return undefined;
//     }
// };

// export const GlobalStoreController = ({children}) => {
//     const [tasks] = useState(() => {
//         const storedTasks = localStorage.getItem('tasks');
//         let initialTasks = jsonParse(storedTasks) || [];

//         if (!Array.isArray(initialTasks)) {
//             console.log('Отсутствует массив данных');
//             localStorage.removeItem('tasks');
//             return [];
//         }

//         return initialTasks.filter((task) => {
//             const isValid = task.title && task.description && task.time && task.date;
//             if (!isValid) {
//                 console.log('Не все данные у задачи', task);
//             }
//             return isValid;
//         });
//     });

//     const [state, setState] = useState({
//         tasks,
//         title: '',
//         description: '',
//         time: '',
//         date: '',
//         isDirty: false,
//         filterTo: {
//             search: '',
//             filterDate: null,
//             filterStatus: TASK_STATUS.EMPTY,
//         },
//         tasksPerPage: 10,
//         errors: {
//             title: '',
//             description: '',
//             time: '',
//             date: '',
//         },
//         activePage: 'taskBoard',
//     });

//     useEffect(() => {
//         localStorage.setItem('tasks', JSON.stringify(state.tasks));
//     }, [state.tasks]);

//     return (
//         <GlobalStoreContext.Provider value={{ state, setState }}>
//             {children}
//         </GlobalStoreContext.Provider>
//     );
// };

// export const useGlobalStore = () => {
//     return useContext(GlobalStoreContext).state;
// };

// export const useSetGlobalStoreTasks = () => {
//     const {setState} = useContext(GlobalStoreContext);
//     return (newTasks) => setState((prevState) => ({
//         ...prevState,
//         tasks: newTasks,
//     }));
// };

// export const useSetGlobalStore = () => {
//     const {setState} = useContext(GlobalStoreContext);
//     return (newState) => setState((prevState) => ({
//         ...prevState,
//         ...newState,
//     }));
// };
