export const removeTaskFromServer = async (taskId: number) => {
    await fetch(`https://simple-storage.vigdorov.ru/storages/tasks/${taskId}`, {
        method: 'DELETE',
    });
};
