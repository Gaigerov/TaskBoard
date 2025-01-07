import React, {useState, useEffect, useRef} from 'react';
import chevronDown from "../../image/ChevronDown.svg";

import {useSetGlobalStore} from "../../GlobalStoreContext";

export const CustomSelect = ({options, value, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    const setGlobalStore = useSetGlobalStore();

    const handleOptionClick = (option) => {
        setGlobalStore({
            tasksPerPage: option,
        })
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
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
