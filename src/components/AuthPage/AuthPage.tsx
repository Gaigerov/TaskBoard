import {useState, useEffect, ChangeEvent, FormEvent, FC} from 'react';
import {MainPage} from '../MainPage/MainPage';
import Cookies from 'js-cookie';
import {Loader} from '../Loader/Loader';
import '../../config/App.css';
import {fetchTasks} from '../../redux/tasksStore';
import {useAppDispatch} from '../../hooks';

interface State {
    isLoading: boolean;
    error: string | null;
}

export const AuthPage: FC = () => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [state, setState] = useState<State>({
        isLoading: false,
        error: null,
    });

    const closeAuthModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(prevState => ({...prevState, isLoading: true}));
        try {
            const encodedName = encodeURIComponent(name);
            const responseAuth = await fetch('http://localhost:5173/api/auth', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({login: encodedName}),
            });

            if (responseAuth.ok) {
                const authToken = await responseAuth.text();
                Cookies.set('authToken', authToken, {expires: 3}); // Срок хранения токена 3 дня
                Cookies.set('name', encodedName, {expires: 3});
                setIsAuthenticated(true);
                closeAuthModal();
            } else {
                throw new Error('Ошибка авторизации: ' + responseAuth.statusText);
            }
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            setState({isLoading: false, error: (error as Error).message});
        } finally {
            setState((prevState) => ({...prevState, isLoading: false}));
        }
    };

    // Проверка наличия authToken в cookies
    useEffect(() => {
        const authToken = Cookies.get('authToken');
        const name = Cookies.get('name');

        if (authToken && name) {
            setIsAuthenticated(true)
            closeAuthModal();
        }
    }, [closeAuthModal]);

    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                try {
                    const authToken = Cookies.get('authToken');
                    if (authToken) {dispatch(fetchTasks(authToken))}
                } catch (error) {
                    setState({isLoading: false, error: (error as Error).message});
                }
            }
        };
        fetchData();
    }, [isAuthenticated]);

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
                                placeholder="Имя"
                                className='modal-input'
                                required
                            />
                            <button type="submit" className='modal-button' disabled={state.isLoading}>Войти</button>
                        </form>
                        {state.error && <p className="modal-error">{state.error}</p>}
                    </div>
                </div>
            )}
            {state.isLoading && <Loader open={state.isLoading} />}
        </>
    );
};
