import React, {useState, useEffect, Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import xButton from '../../image/xButton.svg';
import chevronDown from '../../image/ChevronDown.svg';
import {VALID_MODE} from '../../constant';
import {TASK_STATUS, TASK_STATUSES} from '../../constant';
import {Popover} from '../Popover/_Popover';
import {FormFooter} from './FormFooter';
import {TextInput} from '../Inputs/TextInput/TextInput';
import {TextArea} from '../Inputs/TextArea/TextArea';
import {TimeInput} from '../Inputs/TimeInput/TimeInput';
import {DateInput} from '../Inputs/DateInput/DateInput';
import {tasksActions} from '../../redux/tasksStore';

export const FormBody = ({mode, task, onEdit, onCreate, onSave, onRemove, onClose, onClone, onFilter, validate}) => {
    const dispatch = useDispatch();
    const title = useSelector((state) => state.tasks.title);
    const description = useSelector((state) => state.tasks.description);
    const time = useSelector((state) => state.tasks.time);
    const date = useSelector((state) => state.tasks.date);
    const errors = useSelector((state) => state.modal.errors);
    const isDirty = useSelector((state) => state.tasks.isDirty);
    const filterTo = useSelector((state) => state.tasks.filterTo);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(filterTo.filterStatus);
    const [selectedDate, setSelectedDate] = useState(mode === VALID_MODE.EDIT ? task.date : filterTo.filterDate);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const onChangeDate = (date) => {
        setSelectedDate(date);
        dispatch(tasksActions.setDate(date));
    }

    const handleFilter = () => {
        onFilter(selectedDate, selectedStatus);
    }

    const handleStatusClick = status => {
        setSelectedStatus(status);
        setIsOpen(false);
    };

    const clearStatusFilter = () => {
        setSelectedStatus(TASK_STATUS.EMPTY);
    };

    const clearTitle = () => {
        dispatch(tasksActions.setTitle(''));
        dispatch(modalActions.setErrors(''));
    };

    const clearDescription = () => {
        dispatch(tasksActions.setDescription(''));
        dispatch(modalActions.setErrors(''));
    };

    useEffect(() => {
        if (mode === VALID_MODE.CREATE && isDirty === true) {
            validate();
        }
    }, [title, description, time, selectedDate]);

    useEffect(() => {
        if (mode === VALID_MODE.EDIT && task) {
            dispatch(tasksActions.setTitle(task.title));
            dispatch(tasksActions.setDescription(task.description));
            dispatch(tasksActions.setTime(task.time));
            dispatch(tasksActions.setDate(task.date));
        }
    }, [mode, task, dispatch]);
 
    return (
        <Fragment>
            <div className="modalTaskContent">
                {(mode === VALID_MODE.CREATE || mode === VALID_MODE.EDIT) && (
                    <div>
                        <TextInput
                            label="Title"
                            value={title}
                            onChange={(event) => dispatch(tasksActions.setTitle(event.target.value))}
                            error={errors.title}
                            placeholder="Enter title"
                            clearField={clearTitle}
                        />
                        <TextArea
                            label="Description"
                            value={description}
                            onChange={(event) => dispatch(tasksActions.setDescription(event.target.value))}
                            error={errors.description}
                            placeholder="Enter description"
                            clearField={clearDescription}
                        />
                        <div className="taskDateAndTimeContainer">
                            <label className="modalContainer__time">Time
                                <TimeInput
                                    value={time}
                                    onChange={(event) => dispatch(tasksActions.setTime(event.target.value))}
                                    error={errors.time}
                                />
                            </label>
                            <label className="modalContainer__date">Date
                                <DateInput
                                    value={date}
                                    error={errors.date}
                                    onChangeDate={onChangeDate}
                                    onChange={(event) => dispatch(tasksActions.setDate(event.currentTarget.value))}
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
                                value={date}
                                error={errors.date}
                                onChangeDate={onChangeDate}
                                onChange={(event) => dispatch(tasksActions.setDate(event.target.value))}
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
                clearStatusFilter={() => clearStatusFilter()}
            />
        </Fragment>
    );
};
