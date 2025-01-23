import React, {useEffect, useRef} from 'react';
import {useSearchParams} from "react-router-dom";
import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';
import {TASK_STATUS, VALID_MODE, VALID_MODES} from './constant';
import {ModalForm} from './components/ModalForm/ModalForm';
import {FormHeader} from './components/ModalForm/FormHeader';
import {FormBody} from './components/ModalForm/FormBody';

export const TaskModal = ({mode, onClose, onEdit, onCreate, onSave, onRemove, onClone, onFilter, notification}) => {
    const {title, description, time, date, status, isDirty, tasks} = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();

    const modalRef = useRef(null);
    const [searchParams, setParams] = useSearchParams();
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
            })
        }
    }, [task]);

    const isValidId = () => tasks.some(t => t.id.toString() === id || console.log('Некорректный id'));

    const validateField = (value, fieldName, maxLength) => {
        if (!value) return `${fieldName}`;
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
    }, [title, description, time, date]);

    const handleSubmit = () => {
        if (mode === VALID_MODE.CREATE && validate()) {
            notification();
            onCreate({title, description, time, date, status: TASK_STATUS.TO_DO});
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
                status: '',
            })
        }

        else if (mode === VALID_MODE.EDIT && validate()) {
            onSave({...task, title, description, time, date});
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
                status: task.status,
            })
        }
    }
    const isShow = (() => {
        if (tasks == []) return true;
        if ((mode === VALID_MODE.CREATE) || (mode === VALID_MODE.FILTER)) return true;
        return VALID_MODES.some(m => m === mode) && isValidId();
    })();

    if (!isShow) {
        console.log('Некорректный режим')
        return null;
    }

    return (
        <div className="modalOverlay" ref={modalRef}>
            <ModalForm>
                <FormHeader task={task} mode={mode} onClose={onClose} />
                <FormBody
                    task={task}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onEdit={onEdit}
                    onRemove={onRemove}
                    onClose={onClose}
                    onClone={onClone}
                    onFilter={onFilter}
                />
            </ModalForm>
        </div>
    );
};
