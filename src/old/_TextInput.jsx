import React from 'react';
import xButton from '../../../image/xButton.svg';

export const TextInput = ({label, value, onChange, error, placeholder, clearField}) => (
    <div>
        <label>{label}</label>
        <div className="inputContainer">
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                className="modalInput"
                style={{
                    borderColor: error ? 'var(--danger)' : 'var(--light-grey)'
                }}
                onChange={onChange}
            />
            <img className="inputClearButton" src={xButton} onClick={clearField} alt="Clear" />
        </div>
        {error && (
            <span className="errorText" style={{ color: 'red' }}>
                {error}
            </span>
        )}
    </div>
);
