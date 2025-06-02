import {Task} from '../../types';

export const saveTaskToStorage = async (payload: {
    data: { tasks: Task[] },
    storageId: string,
}, authToken: string) => {
    const response = await fetch(`http://localhost:5173/api/storages/${payload.storageId}`, {
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