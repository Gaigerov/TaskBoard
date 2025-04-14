import {useState, useEffect, useRef, FC} from 'react';
import chevronDown from "../../image/ChevronDown.svg";
import {useDispatch} from 'react-redux';
import {tasksActions} from '../../redux/_tasksStore';

type Props = {
    options: string[];
    value: string;
}

export const CustomSelect: FC<Props> = ({options, value}) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement | null>(null);

    const handleOptionClick = (option: string) => {
        dispatch(tasksActions.setTasksPerPage(option));
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="customSelect" ref={selectRef}>
            <div className="customSelectTrigger" onClick={() => setIsOpen(!isOpen)}>
                {value}
                <img src={chevronDown} alt="chevronDown" />
            </div>
            {isOpen && (
                <ul className="customOptions">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
