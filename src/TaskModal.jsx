import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';
import {VALID_MODE, VALID_MODES} from './constant';
import {ModalForm} from './components/ModalForm/ModalForm';
import {FormHeader} from './components/ModalForm/FormHeader';
import {FormBody} from './components/ModalForm/FormBody';
import {FormFooter} from './components/ModalForm/FormFooter';

export const TaskModal = ({mode, onClose, onEdit, task, onCreate, onSave, onRemove, onClone}) => {
    const {title, description, time, date, errors, isDirty, tasks} = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();

    const modalRef = useRef(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
            })
        };
    }

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
        }
        if (mode === VALID_MODE.VIEW) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mode]);

    useEffect(() => {
        if (mode === VALID_MODE.EDIT) {
            onSave;
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onEdit]);

    useEffect(() => {
        if (task) {
            setGlobalStore({
                title: task.title,
                description: task.description,
                time: task.time,
                date: task.date,
            })
        }
    }, [task]);

    const isValidId = () => tasks.some(t => t.id.toString() === id);

    const isShow = (() => {
        if (mode === VALID_MODE.CREATE || mode === VALID_MODE.FILTER) return true;
        return VALID_MODES.some(m => m === mode) && isValidId();
    })();

    const validateField = (value, fieldName, maxLength) => {
        if (!value) return `Введите ${fieldName}`;
        if (value.length > maxLength) return `Максимум ${maxLength} символов`;
        return '';
    };

    const validateTime = (time) => {
        return /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(time) ? '' : 'Введите время';
    };

    const validateDate = (date) => {
        const today = new Date();
        const inputDate = new Date(date.split('.').reverse().join('-'));
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return 'Введите корректную дату';
        if (inputDate < today) return 'Введите дату, которая еще не прошла';
        return '';
    };

    const validate = () => {
        const newErrors = {
            title: validateField(title, 'Введите название', 50),
            description: validateField(description, 'Введите описание', 200),
            time: validateTime(time),
            date: date ? validateDate(date) : 'Введите дату'
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


    if (!isShow) {
        console.log('Некорректный режим')
        return null;
    }

    const handleSubmit = () => {
        if (mode === VALID_MODE.CREATE && validate()) {
            onCreate({title, description, time, date});
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
            })

        } else if (mode === VALID_MODE.EDIT && validate()) {
            onSave({...task, title, description, time, date});
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
            })
        }
    }

    return (
        <div className="modalOverlay">
            <ModalForm>
                <FormHeader task={task} mode={mode} onClose={onClose} />
                <FormBody mode={mode} />
                <FormFooter
                    task={task}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onRemove={onRemove}
                    onClose={onClose}
                    onClone={onClone}
                />
            </ModalForm>
        </div>
    );
};
