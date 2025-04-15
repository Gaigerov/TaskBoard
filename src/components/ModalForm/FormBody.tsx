import {useState, useEffect, Fragment, FC, ChangeEvent} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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
import {tasksActions} from '../../redux/tasksStore';
import {modalActions} from '../../redux/modalStore';

interface FilterTo {
    search: string;
    filterDate?: string;
    filterStatus?: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
}

interface TaskState {
    title: string;
    description: string;
    time: string;
    date: string;
    isDirty: boolean;
    filterTo: {
        search: string,
        filterDate: string,
        filterStatus: string,
    },
}

interface ModalState {
    errors: {
        title: string,
        description: string,
        time: string,
        date: string,
    };
}

interface Props {
    mode: string;
    task: Task;
    onEdit: (task: Task) => void;
    onCreate: (task: Task) => void;
    onSave: (task: Task) => void;
    onRemove: (id: number) => void;
    onClose: () => void;
    onClone: (id: number) => void;
    onFilter: (date: string, status: string) => void;
    validate: () => boolean;
}

export const FormBody: FC<Props> = ({mode, task, onEdit, onCreate, onSave, onRemove, onClose, onClone, onFilter, validate}) => {
    const dispatch = useDispatch();
    const title = useSelector((state: {tasks: TaskState}) => state.tasks.title);
    const description = useSelector((state: {tasks: TaskState}) => state.tasks.description);
    const time = useSelector((state: {tasks: TaskState}) => state.tasks.time);
    const date = useSelector((state: {tasks: TaskState}) => state.tasks.date);
    const errors = useSelector((state: {modal: ModalState}) => state.modal.errors);
    const isDirty = useSelector((state: {tasks: TaskState}) => state.tasks.isDirty);
    const filterTo = useSelector((state: {tasks: TaskState}) => state.tasks.filterTo);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>(filterTo.filterStatus);
    const [selectedDate, setSelectedDate] = useState<string>(mode === VALID_MODE.EDIT ? task.date : filterTo.filterDate);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const onChangeDate = (date: string) => {
        setSelectedDate(date);
        dispatch(tasksActions.setDate(date));
    }

    const handleFilter = () => {
        onFilter(selectedDate, selectedStatus);
    }

    const handleStatusClick = (status: string) => {
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

        const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(tasksActions.setTitle(event.target.value));
        };
    
        const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
            dispatch(tasksActions.setDescription(event.target.value));
        };
    
        const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(tasksActions.setTime(event.target.value));
        };
    
        const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(tasksActions.setDate(event.target.value));
            onChangeDate(event.target.value);
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
                            onChange={handleTitleChange}
                            error={errors.title}
                            placeholder="Enter title"
                            clearField={clearTitle}
                        />
                        <TextArea
                            label="Description"
                            value={description}
                            onChange={handleDescriptionChange}
                            error={errors.description}
                            placeholder="Enter description"
                            clearField={clearDescription}
                        />
                        <div className="taskDateAndTimeContainer">
                            <label className="modalContainer__time">Time
                                <TimeInput
                                    value={time}
                                    onChange={handleTimeChange}
                                    error={errors.time}
                                />
                            </label>
                            <label className="modalContainer__date">Date
                                <DateInput
                                    value={date}
                                    error={errors.date}
                                    onChangeDate={onChangeDate}
                                    onChange={handleDateChange}
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
                                onChange={handleDateChange}
                            />
                        </label>
                    </>
                )}
                {mode === VALID_MODE.VIEW && (
                    <div>
                        <Popover tableTask={task} />
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
