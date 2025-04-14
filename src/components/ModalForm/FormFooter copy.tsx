import {FC} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {useNotification} from '../Notification/NotificationContext';
import {Button} from '../Button/Button';
import {VALID_MODE, TASK_STATUS} from '../../constant';
import {modalActions} from '../../redux/_modalStore';
import {tasksActions} from '../../redux/_tasksStore';

interface Task {
    id: string;
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

interface Props {
    mode: string;
    task: Task;
    onEdit: (task: Task) => void;
    onCreate: (task: Task) => void;
    onSave: (task: Task) => void;
    onRemove: (taskId: string) => void;
    onClose: () => void;
    onClone: (taskId: string) => void;
    onFilter: () => void;
    validate: () => boolean;
    clearStatusFilter: () => void;
    onClick: () => void;
}

export const FormFooter: FC<Props> = ({task, mode, onCreate, onSave, onEdit, onFilter, onRemove, onClone, onClose, validate, clearStatusFilter}) => {
    const dispatch = useDispatch();
    const title = useSelector((state: {tasks: TaskState}) => state.tasks.title);
    const description = useSelector((state: {tasks: TaskState}) => state.tasks.description);
    const time = useSelector((state: {tasks: TaskState}) => state.tasks.time);
    const date = useSelector((state: {tasks: TaskState}) => state.tasks.date);
    const navigate = useNavigate();
    const showNotification = useNotification();

    const handleNavigateToDelete = (task: Task) => {
        navigate('/');
        navigate(`${VALID_MODE.REMOVE}?id=${task.id}`);
    }

    const resetGlobalStore = () => {
        dispatch(modalActions.resetModalData());
    };

    const handleSubmit = () => {
        if (validate()) {
            if (mode === VALID_MODE.CREATE) {
                onCreate({id: Date.now().toString(), title, description, time, date, status: TASK_STATUS.TO_DO});
            } else if (mode === VALID_MODE.EDIT) {
                onSave({...task, title, description, time, date});
            }
            resetGlobalStore();
            onClose();
        }
    };

    const handleClose = () => {
        resetGlobalStore();
        onClose();
    };

    const handleRemoveTask = () => {
        onRemove(task.id);
        resetGlobalStore();
        onClose();
    };

    const handleCloneTask = () => {
        onClone(task.id);
        onClose();
    }

    const handleNavigateToEdit = (task: Task) => {
        navigate('/');
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
        showNotification('Редактирование задачи', 'info');
    }

    const handleDropFilter = () => {
        clearStatusFilter();
        dispatch(tasksActions.setFilterTo({
            search: '',
            filterDate: undefined,
            filterStatus: TASK_STATUS.EMPTY,
        }));    
        showNotification('Фильтры сброшены', 'info');
    }

    const buttonConfigs = {
        [VALID_MODE.CREATE]: [
            {type: "create", onClick: handleSubmit, name: "Create"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.EDIT]: [
            {type: "save", onClick: handleSubmit, name: "Save"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.VIEW]: [
            {type: "edit", onClick: () => handleNavigateToEdit(task), name: "Edit"},
            {type: "clone", onClick: handleCloneTask, name: "Copy"},
            {type: "remove", onClick: () => handleNavigateToDelete(task), name: "Del"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.REMOVE]: [
            {type: "remove", onClick: handleRemoveTask, name: "Remove"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ],
        [VALID_MODE.FILTER]: [
            {type: "save", onClick: onFilter, name: "Filter"},
            {type: "remove", onClick: handleDropFilter, name: "Reset"},
            {type: "cancel", onClick: handleClose, name: "Cancel"}
        ]
    };

    return (
        <div className="modalButtons">
            {buttonConfigs[mode]?.map((buttonConfig, index) => (
                <Button
                    key={buttonConfig.name || index}
                    type={buttonConfig.type}
                    onClick={() => {
                        buttonConfig.onClick();
                    }}
                    name={buttonConfig.name}
                />
            ))}
        </div>
    );
};