import React, {useState, useEffect} from 'react';
import './AuthPage.css';
import {MainPage} from './MainPage';
import {getSimpleData} from './components/api/getStorage';
import Cookies from 'js-cookie';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, isLoading: true });
        try {
            const encodedName = encodeURIComponent(name);
    
            const responseAuth = await fetch('https://simple-storage.vigdorov.ru/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: encodedName }),
            });
    
            if (responseAuth.ok) {
                const authToken = await responseAuth.text(); // Получаем токен
                Cookies.set('authToken', authToken, { expires: 3 });
                setIsAuthenticated(true);
                closeAuthModal();
    
                // Получаем данные из хранилища
                await getSimpleData(authToken, name); // Передаем токен и имя
            } else {
                throw new Error('Ошибка авторизации: ' + responseAuth.statusText);
            }
        } catch (error) {
            console.error('Ошибка при авторизации или получении данных:', error);
            setState({ tasks: [], isLoading: false, error: error.message });
        } finally {
            setState((prevState) => ({ ...prevState, isLoading: false }));
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
