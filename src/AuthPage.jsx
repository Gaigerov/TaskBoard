import React, { useState } from 'react';
import './AuthPage.css';
import { MainPage } from './MainPage';
import { getSimpleData } from './components/api/getStorage';

export const AuthPage = () => {
    const [name, setName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [state, setState] = useState({
        tasks: [],
        isLoading: false,
        error: null,
    });

    const closeAuthModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        setName(e.currentTarget.value);
    };

    const fetchData = async (name) => {
        try {
            const data = await getSimpleData(name);
            return data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw new Error('Не удалось получить данные для указанного хранилища.'); // Бросаем ошибку для обработки в handleSubmit
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({...state, isLoading: true });
        try {
            const encodedName = encodeURIComponent(name);
            
            const responseAuth = await fetch('https://simple-storage.vigdorov.ru/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: encodedName }), // Используем закодированное имя
            });
    
            if (responseAuth.ok) {
                await fetchData(encodedName); // Передаем закодированное имя для получения данных
                setIsAuthenticated(true);
                closeAuthModal(); // Закрываем модальное окно только при успешной авторизации
            } else {
                throw new Error('Ошибка авторизации: ' + responseAuth.statusText);
            }
        } catch (error) {
            console.error('Ошибка при авторизации или получении данных:', error);
            setState({ tasks: [], isLoading: false, error: error.message }); // Используем сообщение ошибки
        } finally {
            setState((prevState) => ({ ...prevState, isLoading: false })); // Обновляем состояние загрузки
        }
    };

    if (isAuthenticated) {
        return <MainPage />;
    }

    return (
        <>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className='modal-title'>Введите ваше имя</h2>
                        <form className='modal-form' onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={name}
                                onChange={handleInputChange}
                                placeholder="Ваше имя"
                                className='modal-input'
                                required
                            />
                            <button type="submit" className='modal-button' disabled={state.isLoading}>Войти</button>
                        </form>
                        {state.error && <p className="modal-error">{state.error}</p>}
                    </div>
                </div>
            )}
        </>
    );
};
