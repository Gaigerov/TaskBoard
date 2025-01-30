import React, {useState} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {Button} from '../Button/Button';
import {useGlobalStore} from '../../GlobalStoreContext';
import {useSetGlobalStore} from '../../GlobalStoreContext';
import {VALID_MODE, TASK_STATUS} from '../../constant';
import {Notification} from '../Notification/Notification';

export const FormFooter = ({task, mode, onCreate, onSave, onEdit, onRemove, onClone, onClose, onFilter, validate}) => {
    const state = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();
    const navigate = useNavigate();
    const {title, description, time, date} = state;
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState('default message');
    const [notificationType, setNotificationType] = useState('success');

    const handleShowNotification = () => {
        setShowNotification(true);
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const handleNotification = (msg, type) => {
        setMessage(msg);
        setNotificationType(type);
    };

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
        if (validate()) {
            if (mode === VALID_MODE.CREATE) {
                onCreate({ title, description, time, date, status: TASK_STATUS.TO_DO });
                handleShowNotification();
                handleNotification('Задача создана успешно', 'success');
            } else if (mode === VALID_MODE.EDIT) {
                onSave({ ...task, title, description, time, date });
                handleShowNotification();
                handleNotification('Задача успешно отредактирована', 'success');
            }
            setGlobalStore(mode === VALID_MODE.EDIT ? task.status : '');
            onClose();
        }
    };

    const handleClose = (event) => {
        event.preventDefault();
        onClose();
        resetGlobalStore();
    };
    
    const handleRemoveTask = () => {
        handleNotification('Задача удалена успешно', 'success');
        handleShowNotification();
        onRemove(task.id);
        onClose();
        resetGlobalStore();
    };


    const handleCloneTask = () => {
        handleNotification('Задача скопирована успешно', 'success');
        handleShowNotification();
        onClone(task.id);
        onClose();
    }

    const handleNavigateToEdit = (task) => {
        navigate('/');
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
        handleNotification('Редактирование задачи', 'info');
        handleShowNotification();
    }

    const handleDropFilter = () => {
        setGlobalStore({
            ...state,
            filterTo: {
                search: '',
                filterDate: undefined,
                filterStatus: undefined,
            }
        })
        handleNotification('Фильтры сброшены', 'info');
        handleShowNotification();
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
                    key={index}
                    type={buttonConfig.type}
                    onClick={buttonConfig.onClick}
                    name={buttonConfig.name}
                />
            ))}
            {showNotification && (
                <Notification
                    type={notificationType}
                    message={message}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};