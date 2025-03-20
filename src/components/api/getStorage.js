export const getSimpleData = async (name) => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    // Запрос на авторизацию
    const responseAuth = await fetch('https://simple-storage.vigdorov.ru/auth', {
        method: 'POST',
        body: JSON.stringify({ login: name }), // Используем имя из параметра
        headers,
    });

    // Проверяем, успешен ли запрос на авторизацию
    if (responseAuth.ok) {
        const authToken = await responseAuth.text();

        const authHeaders = new Headers({
            'content-type': 'application/json',
            Authorization: authToken,
        });

        // Запрос на получение списка хранилищ
        const responseStorageList = await fetch('https://simple-storage.vigdorov.ru/storages', {
            method: 'GET',
            headers: authHeaders,
        });

        if (!responseStorageList.ok) {
            throw new Error('Ошибка получения списка хранилищ: ' + responseStorageList.statusText);
        }

        const storageList = await responseStorageList.json();

        // Проверка наличия хранилища с именем 'tasks'
        const storage = storageList.find(storage => storage.storageName === 'tasks');
        if (!storage) {
            throw new Error('Хранилище с именем "tasks" не найдено');
        }

        const storageId = storage.id;

        // Запрос на получение данных из конкретного хранилища
        const responseStorage = await fetch(`https://simple-storage.vigdorov.ru/storages/${storageId}`, {
            method: 'GET',
            headers: authHeaders,
        });

        if (!responseStorage.ok) {
            throw new Error('Ошибка получения данных из хранилища: ' + responseStorage.statusText);
        }

        // Подготовка данных для отправки
        const dataToSend = {
            data: [],
            user: name, // Используем имя из параметра
            storageName: "tasks",
            id: "67d1c2a3f1eb80a50d5c33bb"
        };

        // Запрос на обновление данных в конкретном хранилище
        const putDataToStorage = await fetch(`https://simple-storage.vigdorov.ru/storages/${storageId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify(dataToSend),
        });

        if (!putDataToStorage.ok) {
            throw new Error('Ошибка обновления данных в хранилище: ' + putDataToStorage.statusText);
        }

        const { data } = await responseStorage.json();

        console.log('Токен авторизации:', authToken);
        console.log('Список хранилищ:', storageList);
        console.log('ID хранилища:', storageId);
        console.log('Данные из хранилища:', data);

        return data;
    } else {
        throw new Error('Ошибка авторизации: ' + responseAuth.statusText);
    }
};
