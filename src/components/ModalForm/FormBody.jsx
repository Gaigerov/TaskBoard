import React, {useState, useEffect, Fragment} from 'react';
import {useGlobalStore, useSetGlobalStore} from '../../GlobalStoreContext';
import xButton from '../../image/xButton.svg';
import chevronDown from '../../image/ChevronDown.svg';
import {VALID_MODE} from '../../constant';
import {TASK_STATUS, TASK_STATUSES} from '../../constant';
import {Popover} from '../Popover/Popover';
import {FormFooter} from './FormFooter';
import {TextInput} from '../Inputs/TextInput/TextInput';
import {TextArea} from '../Inputs/TextArea/TextArea';
import {TimeInput} from '../Inputs/TimeInput/TimeInput';
import {DateInput} from '../Inputs/DateInput/DateInput';


export const FormBody = ({mode, task, onEdit, onCreate, onSave, onRemove, onClose, onClone, onFilter, validate}) => {
    const state = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();
    const {title, description, time, date, errors = {}, isDirty, filterTo = {}} = state;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(filterTo.filterStatus);
    const [selectedDate, setSelectedDate] = useState(mode === VALID_MODE.EDIT ? task.date : filterTo.filterDate);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const onChangeDate = (date) => {
        setSelectedDate(date);
        setGlobalStore({
            ...state,
            date: date,
        })
    }

    const handleFilter = () => {
        console.log('Selected Date:', selectedDate);
        console.log('Selected Status:', selectedStatus);
        onFilter(selectedDate, selectedStatus);
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
        setGlobalStore(prevState => ({
            ...prevState,
            [field]: event.target.value, 
        }));
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
                        <TextInput
                            label="Title"
                            value={title}
                            onChange={makeSetField(title)}
                            error={errors.title}
                            placeholder="Enter title"
                            clearField={() => clearField('title')}
                        />
                        <TextArea
                            label="Description"
                            value={description}
                            onChange={makeSetField(description)}
                            error={errors.description}
                            placeholder="Enter description"
                            clearField={() => clearField('description')}
                        />
                        <div className="taskDateAndTimeContainer">
                            <label className="modalContainer__time">Time
                                <TimeInput
                                    value={time}
                                    onChange={makeSetField(time)}
                                    error={errors.time}
                                />
                            </label>
                            <label className="modalContainer__date">Date
                                <DateInput
                                    value={selectedDate}
                                    error={errors.date}
                                    onChangeDate={onChangeDate}
                                    onChange={makeSetField(date)}
                                />
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
                        <label>Date
                            <DateInput
                                value={selectedDate}
                                error={errors.date}
                                onChangeDate={onChangeDate}
                                onChange={makeSetField(date)}
                            />
                        </label>
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
