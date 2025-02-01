import React, {useEffect, useRef} from 'react';
import {useSearchParams} from "react-router-dom";
import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';
import {useNotification} from './components/Notification/NotificationContext';
import {VALID_MODE, VALID_MODES} from './constant';
import {ModalForm} from './components/ModalForm/ModalForm';
import {FormHeader} from './components/ModalForm/FormHeader';
import {FormBody} from './components/ModalForm/FormBody';

export const TaskModal = ({mode, onClose, onEdit, onCreate, onSave, onRemove, onClone, onFilter}) => {
    const {title, description, time, date, isDirty, tasks} = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();
    const showNotification = useNotification();
    const modalRef = useRef(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const task = tasks.find(task => task.id === Number(id));

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
            });
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
            })
        }
    }

    useEffect(() => {
        if (mode) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mode]);

    useEffect(() => {
        if (task) {
            setGlobalStore({
                title: task.title,
                description: task.description,
                time: task.time,
                date: task.date,
                status: task.status,
            });
        } else {
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
                status: '',
            });
        }
    }, [task]);

    // const notifyIncorrectMode = () => {
    //     if (VALID_MODES.includes(mode)) {
    //         return;
    //     }
    //     showNotification('Некорректный режим', 'error');
    // };

    const isValidId = () => {
        const valid = tasks.some(t => t.id.toString() === id);
        if (!valid) console.log('Некорректный id');
        return valid;
    };

const validateField = (value, fieldName, maxLength) => {
    if (!value) return `${fieldName} is required`;
    if (value.length > maxLength) return `Максимум ${maxLength} символов`;
    return '';
};

    const validateTime = (time) => {
        if (!/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(time)) return 'Enter a valid time';
        return '';
    };

    const validateDate = (date) => {
        const today = new Date();
        const inputDate = new Date(date.split('.').reverse().join('-'));
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return 'Enter a valid date';
        if (inputDate < today) return 'Enter the date that has not passed yet';
        return '';
    };

    const validate = () => {
        const newErrors = {
            title: validateField(title, 'Enter the title', 50),
            description: validateField(description, 'Enter description', 200),
            time: validateTime(time),
            date: date ? validateDate(date) : 'Enter date'
        };
        const isValid = Object.values(newErrors).every(error => !error);
        setGlobalStore({errors: newErrors});
        return isValid;
    };

    useEffect(() => {
        if (mode === VALID_MODE.CREATE && isDirty) {
            validate();
        }
    }, [title, description, time, date, isDirty, mode]);
   
    const isShow = (() => {
        if (tasks.length === 0) return true; // Проверка на пустой массив
        return (mode === VALID_MODE.CREATE || mode === VALID_MODE.FILTER) || 
               (VALID_MODES.includes(mode) && isValidId());
    })();
    
    if (!isShow) {
        return null;
    }
    
    return (
        <div className="modalOverlay" ref={modalRef}>
            <ModalForm>
                <FormHeader task={task} mode={mode} onClose={onClose} />
                <FormBody
                    task={task}
                    mode={mode}
                    onCreate={onCreate}
                    onSave={onSave}
                    onEdit={onEdit}
                    onRemove={onRemove}
                    onClose={onClose}
                    onClone={onClone}
                    onFilter={onFilter}
                    validate={validate}
                />
            </ModalForm>
        </div>
    );
};
