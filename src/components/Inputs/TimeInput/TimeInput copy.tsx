import {useRef, FC} from 'react';
import InputMask from 'react-input-mask';

interface Props {
    value: string;
    onChange: () => void;
    error: string;
}

export const TimeInput: FC<Props> = ({value, onChange, error}) => {
    const inputRef = useRef(null);
    return (
        <>
            <div className="inputContainer">
                <InputMask
                    ref={inputRef}
                    id="time"
                    type="text"
                    value={value}
                    mask="99:99"
                    placeholder="00:00"
                    className="modalInput modalInput__time"
                    style={{
                        borderColor: error ? 'var(--danger)' : 'var(--light-grey)'
                    }}
                    onChange={onChange}
                />
            </div>
            {error && (
                <span className="errorText" style={{color: 'red'}}>
                    {error}
                </span>
            )}
        </>
    )
};
