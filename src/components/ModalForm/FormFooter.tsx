import {FC} from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {useSelector} from 'react-redux';
import {useNotification} from '../Notification/NotificationContext';
import {Button} from '../Button/Button';
import {VALID_MODE, TASK_STATUS} from '../../constant';
import {modalActions} from '../../redux/modalStore';
import {tasksActions} from '../../redux/tasksStore';
import {Task} from '../../types';
import {useAppDispatch} from '../../hooks';

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
    task: Task | undefined;
    onEdit: (id: number) => void;
    onCreate: (task: Task) => void;
    onSave: (task: Task) => void;
    onRemove: (taskId: number) => void;
    onClose: () => void;
    onClone: (taskId: number) => void;
    onFilter: (selectedDate?: string | undefined, selectedStatus?: string | undefined) => void;
    validate: () => boolean;
    clearStatusFilter: () => void;
}

export const FormFooter: FC<Props> = ({task, mode, onCreate, onSave, onEdit, onFilter, onRemove, onClone, onClose, validate, clearStatusFilter}) => {
    const dispatch = useAppDispatch();
    const title = useSelector((state: {tasks: TaskState}) => state.tasks.title);
    const description = useSelector((state: {tasks: TaskState}) => state.tasks.description);
    const time = useSelector((state: {tasks: TaskState}) => state.tasks.time);
    const date = useSelector((state: {tasks: TaskState}) => state.tasks.date);
    const navigate = useNavigate();
    const showNotification = useNotification();

    const handleNavigateToDelete = (task: Task | undefined) => {
        if (task) {
            navigate(`/${VALID_MODE.REMOVE}?id=${task.id}`);
        } else {
            console.error('Error to delete: task is empty')
        }
    }

    const resetGlobalStore = () => {
        dispatch(modalActions.resetModalData());
    };

    const handleSubmit = () => {
        if (validate()) {
            if (mode === VALID_MODE.CREATE) {
                onCreate({id: Date.now(), title, description, time, date, status: TASK_STATUS.TO_DO});
            } else if (mode === VALID_MODE.EDIT && task) {
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
        if (task) {
            onRemove(task.id);
            resetGlobalStore();
            onClose();
        } else {
            console.error('Remove error: task is empty')
        }
    };

    const handleCloneTask = () => {
        if (task) {
            onClone(task.id);
            onClose();
        } else {
            console.error('Clone error: task is empty')
        }
    }

    const handleNavigateToEdit = (task: Task | undefined) => {
        if (task) {
            navigate(`/${VALID_MODE.EDIT}?id=${task.id}`);
            onEdit(task.id);
            showNotification('Редактирование задачи', 'info');
        } else {
            console.error('Error to edit: task is empty')
        }
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