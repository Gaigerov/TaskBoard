import React, {useState, useEffect, useRef} from "react";
import {useGlobalStore} from "../../GlobalStoreContext";
import {useSetGlobalStore} from "../../GlobalStoreContext";
import xButton from "../../image/x.svg";
import chevronDown from "../../image/ChevronDown.svg";
import {VALID_MODE} from "../../constant";
import InputMask from 'react-input-mask';
import { TASK_STATUS, TASK_STATUSES } from '../../constant';


export const FormBody = ({mode}) => {
    const {title, description, time, date, errors, isDirty} = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();
    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(TASK_STATUS.TO_DO);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        setIsOpen(false);
    };

    const clearField = (field) => {
        setGlobalStore({[field]: ""});
    };
    const makeSetField = (field) => (event) => {
        setGlobalStore({
            [field]: event.target.value,
        });
    };
    useEffect(() => {
        if (mode === VALID_MODE.CREATE && isDirty === true) {
            validate();
        }
    }, [title, description, time, date]);

    return (
        <div>
            {(mode === VALID_MODE.CREATE ||
                mode === VALID_MODE.EDIT)
                && (
                    <>
                        <label>Title</label>
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={title ?? ""}
                                placeholder="Enter title"
                                className="modalInput"
                                style={{
                                    borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                }}
                                onChange={makeSetField("title")}
                            />
                            <img
                                className="inputClearButton"
                                src={xButton}
                                onClick={() => clearField("title")}
                            />
                        </div>
                        {errors.description && (
                            <span style={{color: "red"}}>{errors.title}</span>
                        )}
                        <label>Description</label>
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={description ?? ""}
                                placeholder="Enter description"
                                className="modalInput"
                                style={{
                                    borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                }}
                                onChange={makeSetField("description")}
                            />
                            <img
                                className="inputClearButton"
                                src={xButton}
                                onClick={() => clearField("description")}
                            />
                        </div>
                        {errors.description && (
                            <span style={{color: "red"}}>{errors.description}</span>
                        )}
                        <div className='taskDateAndTimeContainer'>
                            <label htmlFor="time" className="modalContainer__time">Time
                            <div className="inputContainer">
                                <InputMask
                                    ref={inputRef}
                                    id='time'
                                    type="text"
                                    value={time}
                                    mask="99:99"
                                    placeholder="00:00"
                                    className="modalInput modalInput__time"
                                    style={{
                                        borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                    }}
                                    onChange={(event) => setGlobalStore({time: event.target.value, })}
                                />
                            </div>
                            {errors.time && <span style={{color: "red"}}>{errors.time}</span>}
                            </label>
                            <label htmlFor="date" className="modalContainer__date">Date
                            <div className="inputContainer">
                                <InputMask
                                    ref={inputRef}
                                    id='date'
                                    type="text"
                                    value={date}
                                    mask="99.99.9999"
                                    placeholder="DD.MM.YYYY"
                                    className="modalInput"
                                    style={{
                                        borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                    }}
                                    onChange={(event) => setGlobalStore({date: event.target.value, })}
                                />
                            </div>
                            {errors.date && <span style={{color: "red"}}>{errors.date}</span>}
                            </label>
                        </div>
                    </>
                )}
            {(mode === VALID_MODE.VIEW || mode === VALID_MODE.FILTER) && (
                <>
                    <label>Status</label>
                    <div className="customSelect">
                        <div className="selectedStatus">{selectedStatus}</div>
                        <img className="downButton" src={chevronDown} onClick={toggleDropdown}></img>
                        {isOpen && (
                            <div className="statusesFilter">
                                {TASK_STATUSES.map((status) => (
                                    <div
                                        key={status}
                                        className="customStatus"
                                        onClick={() => handleStatusClick(status)}
                                    >
                                        {status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <label htmlFor="date">Date</label>
                    <div className="inputContainer">
                        <InputMask
                            ref={inputRef}
                            id='date'
                            type="text"
                            value={date}
                            mask="99.99.9999"
                            placeholder="DD.MM.YYYY"
                            className="date modalInput"
                            style={{
                                borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                            }}
                            onChange={(event) => setGlobalStore({date: event.target.value, })}
                        />
                    </div>
                    {errors.date && <span style={{color: "red"}}>{errors.date}</span>}
                </>
            )}
        </div>
    );
};
