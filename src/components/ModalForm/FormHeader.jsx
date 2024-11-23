import React from 'react';
import xButton from '../../image/x.svg';
import {VALID_MODE} from './constant';

export const FormHeader = ({ mode }) => {
    return (
        <div className="form-header">
            <h2>{mode === VALID_MODE.CREATE ? 'Создать задачу' : 'Редактировать задачу'}</h2>
            <button onClick={onClose}><img src={xButton} alt="Закрыть" /></button>
        </div>
    );
};
