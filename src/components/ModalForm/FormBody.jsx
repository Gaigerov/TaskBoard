import React, {useState, useEffect, useRef, Fragment} from 'react';
import {useGlobalStore} from '../../GlobalStoreContext';
import {useSetGlobalStore} from '../../GlobalStoreContext';
import xButton from '../../image/xButton.svg';
import chevronDown from '../../image/ChevronDown.svg';
import {VALID_MODE} from '../../constant';
import InputMask from 'react-input-mask';
import {TASK_STATUS, TASK_STATUSES} from '../../constant';
import {Popover} from '../Popover/Popover';
import {Datepicker} from '../Datepicker/Datepicker';
import {FormFooter} from './FormFooter';

export const FormBody = ({mode, task, onEdit, onCreate, onSave, onRemove, onClose, onClone, onFilter, validate}) => {
    const state = useGlobalStore();
    const {title, description, time, errors = {}, isDirty, filterTo = {} } = state;
    const setGlobalStore = useSetGlobalStore();
    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isDatepicker, setIsDatepicker] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(filterTo.filterStatus);
    const [selectedDate, setSelectedDate] = useState(mode === VALID_MODE.EDIT ? task.date : filterTo.filterDate);

    const handleFilter = () => {
        console.log('Selected Date:', selectedDate);
        console.log('Selected Status:', selectedStatus);
    
        onFilter(selectedDate, selectedStatus);
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleDatepicker = () => {
        setIsDatepicker(!isDatepicker);
    };

    const onChangeDate = (date) => {
        setSelectedDate(date);
        setGlobalStore({
            ...state,
            date: date,
        })
    }

    const handleStatusClick = status => {
        setSelectedStatus(status);
        setIsOpen(false);
    };

    const clearField = field => {
        setGlobalStore(prevState => ({
            ...prevState,
            [field]: ''
        }));
    };

    const clearStatusFilter = () => {
        setSelectedStatus(TASK_STATUS.EMPTY);
    };

    const makeSetField = field => event => {
        setGlobalStore({
            [field]: event.target.value
        });
    };
    useEffect(() => {
        if (mode === VALID_MODE.CREATE && isDirty === true) {
            validate();
        }
    }, [title, description, time, selectedDate]);

    return (
        <Fragment>
            <div className="modalTaskContent">
                {(mode === VALID_MODE.CREATE || mode === VALID_MODE.EDIT) && (
                    <div>
                        <label>Title</label>
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={title ?? ''}
                                placeholder="Enter title"
                                className="modalInput"
                                style={{
                                    borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)'
                                }}
                                onChange={makeSetField('title')}
                            />
                            <img className="inputClearButton" src={xButton} onClick={() => clearField('title')} />
                        </div>
                        {errors.description && (
                            <span className="errorText" style={{color: 'red'}}>
                                {errors.title}
                            </span>
                        )}
                        <label>Description</label>
                        <div className="inputContainer">
                            <textarea
                                type="text"
                                value={description ?? ''}
                                placeholder="Enter description"
                                className="modalInput"
                                style={{
                                    borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)'
                                }}
                                onChange={makeSetField('description')}
                            />
                            <img className="inputClearButton" src={xButton} onClick={() => clearField('description')} />
                        </div>
                        {errors.description && (
                            <span className="errorText" style={{color: 'red'}}>
                                {errors.description}
                            </span>
                        )}
                        <div className="taskDateAndTimeContainer">
                            <label htmlFor="time" className="modalContainer__time">
                                Time
                                <div className="inputContainer">
                                    <InputMask
                                        ref={inputRef}
                                        id="time"
                                        type="text"
                                        value={time}
                                        mask="99:99"
                                        placeholder="00:00"
                                        className="modalInput modalInput__time"
                                        style={{
                                            borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)'
                                        }}
                                        onChange={event => setGlobalStore({time: event.target.value})}
                                    />
                                </div>
                                {errors.time && (
                                    <span className="errorText" style={{color: 'red'}}>
                                        {errors.time}
                                    </span>
                                )}
                            </label>
                            <label htmlFor="date" className="modalContainer__date">
                                Date
                                <div className="inputContainer">
                                    <InputMask
                                        ref={inputRef}
                                        id="date"
                                        type="text"
                                        value={selectedDate}
                                        mask="99.99.9999"
                                        placeholder="DD.MM.YYYY"
                                        className="modalInput"
                                        style={{
                                            borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)'
                                        }}
                                        onChange={event => setGlobalStore({date: event.target.value})}
                                    />
                                    <div className="datepickerContainer">
                                        <img
                                            className="downButtonInDate"
                                            src={chevronDown}
                                            onClick={toggleDatepicker}
                                        ></img>
                                    </div>
                                    {isDatepicker && <Datepicker onChangeDate={onChangeDate} />}
                                </div>
                                {errors.date && (
                                    <span className="errorText" style={{color: 'red'}}>
                                        {errors.date}
                                    </span>
                                )}
                            </label>
                        </div>
                    </div>
                )}
                {mode === VALID_MODE.FILTER && (
                    <>
                        <label>Status</label>
                        <div className="customFilterSelector">
                            <div className="selectedStatus">{selectedStatus}</div>
                            <img className="inputClearStatus" src={xButton} onClick={() => clearStatusFilter()} />
                            <img className="downButton" src={chevronDown} onClick={toggleDropdown}></img>
                            {isOpen && (
                                <div className="statusesFilter">
                                    {TASK_STATUSES.filter(status => status !== TASK_STATUS.EMPTY).map(status => (
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
                                id="date"
                                type="text"
                                value={selectedDate}
                                mask="99.99.9999"
                                placeholder="DD.MM.YYYY"
                                className="date modalInput"
                                style={{
                                    borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)'
                                }}
                                onChange={event => setSelectedDate(event.currentTarget.value)}
                            />
                            <div className="datepickerContainer">
                                <img className="downButtonInDate" src={chevronDown} onClick={toggleDatepicker}></img>
                            </div>
                            {isDatepicker && <Datepicker onChangeDate={onChangeDate} />}
                        </div>
                        {errors.date && (
                            <span className="errorText" style={{color: 'red'}}>
                                {errors.date}
                            </span>
                        )}
                    </>
                )}
                {mode === VALID_MODE.VIEW && (
                    <div>
                        <Popover />
                        <p className="taskDescriptionViewMode">{task.description}</p>
                        <div className="frameOfTaskDateViewMode">
                            <p className="taskTimeViewMode">{task.time}</p>
                            <p className="taskDateViewMode">{task.date}</p>
                        </div>
                    </div>
                )}
            </div>
            <FormFooter
                task={task}
                mode={mode}
                onCreate={onCreate}
                onSave={onSave}
                onEdit={onEdit}
                onRemove={onRemove}
                onClose={onClose}
                onClone={onClone}
                onFilter={handleFilter}
                validate={validate}
            />
        </Fragment>
    );
};
