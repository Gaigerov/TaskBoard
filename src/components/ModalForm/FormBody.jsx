import React from 'react';
import {useGlobalStore} from './GlobalStoreContext';

export const FormBody = () => {
    const { title, description, time, date, errors } = useGlobalStore();
    return (
        <div className="form-body">
            <input type="text" value={title} placeholder="Название" />
            {errors.title && <span>{errors.title}</span>}
            <input type="text" value={description} placeholder="Описание" />
            {errors.description && <span>{errors.description}</span>}
            <input type="text" value={time} placeholder="Время" />
            {errors.time && <span>{errors.time}</span>}
            <input type="text" value={date} placeholder="Дата " />
            {errors.date && <span>{errors.date}</span>}
        </div>
    );
};
