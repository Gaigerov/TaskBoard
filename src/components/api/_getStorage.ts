interface Storage {
    id: string;
    storageName: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    time: string;
    date: string;
    status: string;
}

interface StorageResponse {
    data: Task[];
}

export const getSimpleData = async (authToken: string): Promise<Task[]> => {
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: authToken,
    });

    const responseStorageList = await fetch('https://simple-storage.vigdorov.ru/storages', {
        method: 'GET',
        headers,
    });

    if (!responseStorageList.ok) {
        throw new Error('Ошибка получения списка хранилищ: ' + responseStorageList.statusText);
    }

    const storageList: Storage[] = await responseStorageList.json();

    const storage = storageList.find(storage => storage.storageName === 'tasks');
    if (!storage) {
        throw new Error('Хранилище с именем "tasks" не найдено');
    }

    const storageId = storage.id;

    const responseStorage = await fetch(`https://simple-storage.vigdorov.ru/storages/${storageId}`, {
        method: 'GET',
        headers,
    });

    if (!responseStorage.ok) {
        throw new Error('Ошибка получения данных из хранилища: ' + responseStorage.statusText);
    }

    const {data}: StorageResponse = await responseStorage.json();

    console.log('Список хранилищ:', storageList);
    console.log('ID хранилища:', storageId);
    console.log('Данные из хранилища:', data);

    return data;
};