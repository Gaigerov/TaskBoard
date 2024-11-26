import React, {useEffect} from 'react';
import {useGlobalStore} from '../../GlobalStoreContext';
import {useSetGlobalStore} from '../../GlobalStoreContext';
import xButton from '../../image/x.svg';
import { VALID_MODE } from '../../constant';

export const FormBody = ({mode}) => {
    const { title, description, time, date, errors, isDirty } = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();

    const clearField = (field) => {
        field = {field: ''};
        setGlobalStore(field)
    }

    useEffect(() => {
        if (mode === VALID_MODE.CREATE && isDirty === true) {
            validate();
        }
    }, [title, description, time, date]);

    return (
        <div>
            <div className="inputContainer">
            <input 
            type="text" 
            value={title} 
            placeholder="Enter title" 
            className='modalInput'
            style={{
                borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
            }}
            />
            <img className="inputClearButton" src={xButton} onClick={clearField(title)} />
            </div>
            {errors.title && <span style={{color: 'red'}}>{errors.title}</span>}
            
            <div className="inputContainer">
            <input 
            type="text" 
            value={description} 
            placeholder="Enter description" 
            className='modalInput'
            style={{
                borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
            }}
            />
            <img className="inputClearButton" src={xButton} onClick={clearField(description)} />
            </div>
            {errors.description && <span style={{color: 'red'}}>{errors.description}</span>}

            <div className="inputContainer">
            <input 
            type="text" 
            value={time} 
            placeholder="00:00" 
            className='modalInput'
            style={{
                borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
            }}
            />
            </div>
            {errors.time && <span style={{color: 'red'}}>{errors.time}</span>}

            <div className="inputContainer">
            <input 
            type="text" 
            value={date} 
            placeholder="DD.MM.YYYY" 
            className='modalInput'
            style={{
                borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
            }}
            />
            </div>
            {errors.date && <span style={{color: 'red'}}>{errors.date}</span>}

        </div>
    );
};
