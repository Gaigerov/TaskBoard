import React, {useEffect, useState} from 'react';
import {getSimpleData} from './getStorage';
import {Task} from '../../Task';
import {Loader} from '../Loader/Loader';


// Основной компонент ApiRoot
export const ApiRoot = ({ searchedTasks }) => {
    const [state, setState] = useState({
        tasks: [],
        isLoading: true,
        error: null,
    });
    
    const [isModalOpen, setModalOpen] = useState(true); // Модальное окно открыто по умолчанию

    const fetchData = async () => {
        try {
            const data = await getSimpleData();
            setState({ tasks: data.tasks || [], isLoading: false, error: null });
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            setState({ tasks: [], isLoading: false, error: 'Не удалось загрузить задачи.' });
        }
    };

    const handleNameSubmit = (name) => {
        console.log('Имя пользователя:', name);
        setModalOpen(false); // Закрываем модальное окно после отправки имени
        fetchData(); // Загружаем данные после ввода имени
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchData();
        }
    }, [isModalOpen]);

    if (state.isLoading) {
        return <Loader />;
    }

    if (state.error) {
        return <div>{state.error}</div>;
    }

    return (
        <div>
            <authModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleNameSubmit} />
            {state.tasks.map(task => (
                <Task
                    key={task.id}
                    searchedTasks={searchedTasks}
                    task={task}
                />
            ))}
        </div>
    );
};
