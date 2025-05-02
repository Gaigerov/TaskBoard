import {Task} from '../../types';

export const editTaskOnServer = async (task: Task) => {
    const response = await fetch(`https://simple-storage.vigdorov.ru/storages/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    return await response.json();
};
