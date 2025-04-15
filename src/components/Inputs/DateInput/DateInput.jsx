import React, {useState, useRef} from 'react';
import InputMask from 'react-input-mask';
import chevronDown from '../../../image/ChevronDown.svg';
import {Datepicker} from '../../Datepicker/_Datepicker';

export const DateInput = ({value, onChange, error, onChangeDate}) => {
    const inputRef = useRef(null);
    const [isDatepicker, setIsDatepicker] = useState(false);
    const toggleDatepicker = () => {
        setIsDatepicker(!isDatepicker);
    };
    return (
        <>
            <div className="inputContainer">
                <InputMask
                    ref={inputRef}
                    id="date"
                    type="text"
                    value={value}
                    mask="99.99.9999"
                    placeholder="DD.MM.YYYY"
                    className="modalInput"
                    onChange={onChange}
                    style={{
                        borderColor: error ? 'var(--danger)' : 'var(--light-grey)'
                    }}
                />
                <div className="datepickerContainer">
                    <img
                        className="downButtonInDate"
                        src={chevronDown}
                        onClick={toggleDatepicker}
                        alt="Toggle datepicker"
                    />
                </div>
                {isDatepicker && <Datepicker onChangeDate={onChangeDate} />}
            </div>
            {error && (
                    <span className="errorText" style={{color: 'red'}}>
                        {error}
                    </span>
                )}
        </>
    )
};
