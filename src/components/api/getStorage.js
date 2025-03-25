export const getSimpleData = async (token, name) => {
    const headers = new Headers({
        'content-type': 'application/json',
        Authorization: token,
    });

    const responseStorageList = await fetch('https://simple-storage.vigdorov.ru/storages', {
        method: 'GET',
        headers,
    });

    if (!responseStorageList.ok) {
        throw new Error('Ошибка получения списка хранилищ: ' + responseStorageList.statusText);
    }

    const storageList = await responseStorageList.json();

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

    const { data } = await responseStorage.json();

    console.log('Список хранилищ:', storageList);
    console.log('ID хранилища:', storageId);
    console.log('Данные из хранилища:', data);

    return data;
};

//         // Запрос на обновление данных в конкретном хранилище
//         const putDataToStorage = await fetch(`https://simple-storage.vigdorov.ru/storages/${storageId}`, {
//             method: 'PUT',
//             headers: authHeaders,
//             body: JSON.stringify(dataToSend),
//         });

//         if (!putDataToStorage.ok) {
//             throw new Error('Ошибка обновления данных в хранилище: ' + putDataToStorage.statusText);
//         }

//         const { data } = await responseStorage.json();

//         console.log('Токен авторизации:', authToken);
//         console.log('Список хранилищ:', storageList);
//         console.log('ID хранилища:', storageId);
//         console.log('Данные из хранилища:', data);

//         return data;
//     } else {
//         throw new Error('Ошибка авторизации: ' + responseAuth.statusText);
//     }
// };
