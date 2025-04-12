import React, {useEffect, useRef} from 'react';
import {useSearchParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';

import {VALID_MODE, VALID_MODES} from './constant';

import {ModalForm} from './components/ModalForm/ModalForm';
import {FormHeader} from './components/ModalForm/FormHeader';
import {FormBody} from './components/ModalForm/FormBody';
import {tasksActions} from './redux/tasksStore';
import {modalActions} from './redux/_modalStore';

export const TaskModal = ({mode, onClose, openEditModal, onCreate, onSave, onRemove, onClone, onFilter}) => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const title = useSelector((state) => state.tasks.title);
    const description = useSelector((state) => state.tasks.description);
    const time = useSelector((state) => state.tasks.time);
    const date = useSelector((state) => state.tasks.date);
    const modalRef = useRef(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const task = tasks?.find(task => task.id === Number(id));

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            dispatch(modalActions.resetModalData());
            onClose();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            dispatch(modalActions.resetModalData());
            onClose();
        }
    };

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
            dispatch(tasksActions.editTask({
                title: task.title,
                description: task.description,
                time: task.time,
                date: task.date,
            }));
        } else {
            dispatch(modalActions.resetModalData());
        }
    }, [task]);

    const isValidId = () => {
        const valid = tasks?.some(t => t.id.toString() === id);
        if (!valid) {
            console.log('Некорректный id', 'error');
        };
        return valid
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
        dispatch(modalActions.setErrors(newErrors));
        return isValid;
    };

    const isShow = (() => {
        if (tasks.length === 0) return true;
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
                    onEdit={openEditModal}
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
