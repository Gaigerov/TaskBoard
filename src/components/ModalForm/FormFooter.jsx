import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {Button} from '../Button/Button';
import {useGlobalStore, useSetGlobalStore} from '../../GlobalStoreContext';
import {VALID_MODE, TASK_STATUS} from '../../constant';
import {useNotification} from '../Notification/NotificationContext';

export const FormFooter = ({task, mode, onCreate, onSave, onEdit, onRemove, onClone, onClose, onFilter, validate}) => {
    const state = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();
    const navigate = useNavigate();
    const showNotification = useNotification();

    const handleNavigateToDelete = (task) => {
        navigate('/');
        navigate(`${VALID_MODE.REMOVE}?id=${task.id}`);
    }

    const resetGlobalStore = () => {
        setGlobalStore({
            title: '',
            description: '',
            time: '',
            date: '',
        });
    };

    const handleSubmit = () => {
        resetGlobalStore()
        if (validate()) {
            if (mode === VALID_MODE.CREATE) {
                onCreate({
                    title: state.title,
                    description: state.description,
                    time: state.time,
                    date: state.date,
                    status: TASK_STATUS.TO_DO
                });
                showNotification('Задача создана успешно', 'success');
            } else if (mode === VALID_MODE.EDIT) {
                onSave({...task, title, description, time, date});
                showNotification('Задача успешно отредактирована', 'success');
            }
            resetGlobalStore(mode === VALID_MODE.EDIT ? task.status : '');
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
        resetGlobalStore();
    };

    const handleRemoveTask = () => {
        onRemove(task.id);
        onClose();
        resetGlobalStore();
    };

    const handleCloneTask = () => {
        onClone(task.id);
        onClose();
    }

    const handleNavigateToEdit = (task) => {
        console.log('handleNavigateToEdit', task)
        navigate('/');
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
        showNotification('Редактирование задачи', 'info');
    }

    const handleDropFilter = () => {
        setGlobalStore({
            ...state,
            filterTo: {
                search: '',
                filterDate: undefined,
                filterStatus: undefined,
            }
        });
        showNotification('Фильтры сброшены', 'info');
    }

    const buttonConfigs = {
        [VALID_MODE.CREATE]: [
            {type: "create", onClick: handleSubmit, name: "Create"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.EDIT]: [
            {type: "save", onClick: handleSubmit, name: "Save"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.VIEW]: [
            {type: "edit", onClick: () => handleNavigateToEdit(task), name: "Edit"},
            {type: "clone", onClick: handleCloneTask, name: "Copy"},
            {type: "remove", onClick: () => handleNavigateToDelete(task), name: "Del"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.REMOVE]: [
            {type: "remove", onClick: handleRemoveTask, name: "Remove"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.FILTER]: [
            {type: "save", onClick: onFilter, name: "Filter"},
            {type: "remove", onClick: handleDropFilter, name: "Reset"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ]
    };

    return (
        <div className="modalButtons">
            {buttonConfigs[mode]?.map((buttonConfig, index) => (
                <Button
                    key={buttonConfig.name || index}
                    type={buttonConfig.type}
                    onClick={() => {
                        console.log(`${buttonConfig.name} button clicked`);
                        buttonConfig.onClick();
                    }}
                    name={buttonConfig.name}
                />
            ))}
        </div>
    );
};