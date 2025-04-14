// Создаем асинхронный thunk для загрузки задач
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async () => {
        const data = await getSimpleData(authToken); 
        return data; 
    }
);

export const sendDataToBackend = async (authToken, jsonData) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: authToken,
    });
    const response = await fetch('https://simple-storage.vigdorov.ru/storages', {
        method: 'PUT', 
        headers,
        body: jsonData, 
    });
    if (!response.ok) {
        throw new Error('Ошибка отправки данных: ' + response.statusText);
    }
    const responseData = await response.json();
    console.log('Ответ от сервера:', responseData);
    return responseData; 
};

// Создаем асинхронный thunk для отправки задач на бэкенд
export const updateTasksOnServer = createAsyncThunk(
    'tasks/updateTasksOnServer',
    async (tasks, { getState }) => {
        const state = getState();
        const authToken = Cookies.get('authToken');
        const jsonData = JSON.stringify(tasks);
        const response = await sendDataToBackend(authToken, jsonData);
        return response; 
    }
);