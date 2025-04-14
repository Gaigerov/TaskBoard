export const sendDataToBackend = async (authToken, jsonData) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: authToken,
    });

    const response = await fetch('https://simple-storage.vigdorov.ru/storages', {
        method: 'PUT', 
        headers,
        body: JSON.stringify(jsonData), 
    });

    if (!response.ok) {
        throw new Error('Ошибка отправки данных: ' + response.statusText);
    }

    const responseData = await response.json();

    console.log('Ответ от сервера:', responseData);

    return responseData; 
};
