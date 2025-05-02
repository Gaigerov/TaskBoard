import {Task} from '../../types';

export const addTaskToServer = async (task: Task) => {
    const response = await fetch('https://simple-storage.vigdorov.ru/storages/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    return await response.json();
};
