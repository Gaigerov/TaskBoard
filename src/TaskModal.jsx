import React, {useEffect, useRef, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
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

    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1200);
    const modalRef = useRef(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        const handleResize = () => setIsWideScreen(window.innerWidth > 1200);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isValidId = () => tasks.some(t => t.id.toString() === id);

    const isShow = (() => {
        if (mode === VALID_MODE.CREATE) return true;
        return VALID_MODES.some(m => m === mode) && isValidId();
    })();

    const validate = () => {
        let newErrors = {title: '', description: '', date: ''};
        let isValid = true;

        // Валидация title
        if (!title) {
            newErrors.title = 'Введите название';
            isValid = false;
        } else if (title.length > 50) {
            newErrors.title = 'Максимум 50 символов';
            isValid = false;
        }

        // Валидация description
        if (!description) {
            newErrors.description = 'Введите описание';
            isValid = false;
        } else if (description.length > 200) {
            newErrors.description = 'Максимум 200 символов';
            isValid = false;
        }

        // Валидация time
        if (!/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(time)) {
            newErrors.time = 'Введите время';
            isValid = false;
        }

        // Валидация date
        if (!date) {
            newErrors.date = 'Введите дату';
            isValid = false;
        } else {
            const today = new Date();
            const inputDate = new Date(date.split('.').reverse().join('-'));
            if (!/^d{2}.d{2}.d{4}$/.test(date)) {
                newErrors.date = 'Введите корректную дату';
                isValid = false;
            } else if (inputDate < today) {
                newErrors.date = 'Введите дату, которая еще не прошла';
                isValid = false;
            }
        }

        setGlobalStore({errors: newErrors});
        return isValid;
    };

    useEffect(() => {
        if (mode === VALID_MODE.CREATE && isDirty) {
            validate();
        }
    }, [title, description, time, date]);

    if (!isShow) return null;

    return (
        <ModalForm>
            <FormHeader mode={mode} />
            <FormBody />
            <FormFooter
                mode={mode}
                onCreate={onCreate}
                onSave={onSave}
                onEdit={onEdit}
                onRemove={onRemove}
                onClose={onClose}
                onClone={onClone}
            />
        </ModalForm>
    );
};
