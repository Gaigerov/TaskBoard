export const getSimpleData = async () => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    // Запрос на авторизацию
    const responseAuth = await fetch('https://simple-storage.vigdorov.ru/auth', {
        method: 'POST',
        body: JSON.stringify({login: 'mikhail'}),
        headers,
    });

    if (!responseAuth.ok) {
        throw new Error('Ошибка авторизации: ' + responseAuth.statusText);
    }

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

    // // Запрос на получение списка хранилищ
    // const putDataToStorage = await fetch('https://simple-storage.vigdorov.ru/storages/${storageId}', {
    //     method: 'PUT',
    //     headers: authHeaders,
    // });

    const {data} = await responseStorage.json();

    console.log('Токен авторизации:', authToken);
    console.log('Список хранилищ:', storageList);
    console.log('ID хранилища:', storageId);
    console.log('Данные из хранилища:', data);

    return data;
};



