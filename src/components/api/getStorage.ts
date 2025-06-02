import {createAsyncThunk} from '@reduxjs/toolkit';
import {Task} from '../../types'

let storageId = '';

export const getSimpleData = async (authToken: string): Promise<{tasks: Task[]}> => {
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: authToken,
    });

    const responseStorageList = await fetch('http://localhost:5174/api/storages', {
        method: 'GET',
        headers,
    });

    if (!responseStorageList.ok) {
        throw new Error('Ошибка получения списка хранилищ: ' + responseStorageList.statusText);
    }

    const storageList: {data: {}, storageName: string, id: string}[] = await responseStorageList.json();

    const storage = storageList.find(storage => storage.storageName === 'tasks');
    if (!storage) {
        throw new Error('Хранилище с именем "tasks" не найдено');
    }

    storageId = storage.id;

    const responseStorage = await fetch(`http://localhost:5174/api/storages/${storageId}`, {
        method: 'GET',
        headers,
    });

    if (!responseStorage.ok) {
        throw new Error('Ошибка получения данных из хранилища: ' + responseStorage.statusText);
    }

    const {data} = await responseStorage.json();

    console.log('Список хранилищ:', storageList);
    console.log('ID хранилища:', storageId);
    console.log('Данные из хранилища:', data);

    return data;
};

export const saveTaskToStorage = async (payload: {
    data: {tasks: Task[]},
}, authToken: string) => {
    const response = await fetch(`http://localhost:5174/api/storages/${storageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

export const createTask = createAsyncThunk('tasks/createTask', async (payload: {
tasks: Task[], authToken: string,
}) => {
    const response = await fetch(`http://localhost:5174/api/storages/${storageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': payload.authToken,
        },
        body: JSON.stringify({data: {tasks: payload.tasks}}),
    });
    return await response.json()
})

export const updateTask = createAsyncThunk('tasks/updateTask',
    async (updatedTask: Task) => {
        const response = await fetch(`http://localhost:5174/api/storages/${updatedTask.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedTask),
        })
        return await response.json();
    })

export const api = {
    saveData: async (data: any) => {
        const response = await fetch(`http://localhost:5174/api/storages/${storageId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
};
