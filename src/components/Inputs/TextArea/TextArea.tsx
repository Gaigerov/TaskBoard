import {FC, ChangeEvent} from 'react';
import xButton from '../../../image/xButton.svg';

interface Props {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    error: string;
    placeholder: string;
    clearField: () => void;
}

export const TextArea: FC<Props> = ({label, value, onChange, error, placeholder, clearField}) => {

    return (
        <div>
            <label>{label}</label>
            <div className="inputContainer">
                <textarea
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
                <span className="errorText" style={{color: 'red'}}>
                    {error}
                </span>
            )}
        </div>
    )
};
