import {useEffect, useRef, FC} from 'react';
import {useSearchParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {VALID_MODE, VALID_MODES} from '../../constant';
import {ModalForm} from '../ModalForm/ModalForm';
import {FormHeader} from '../ModalForm/FormHeader';
import {FormBody} from '../ModalForm/FormBody';
import {tasksActions} from '../../redux/tasksStore';
import {modalActions} from '../../redux/modalStore';
import {Task} from '../../types';

interface TaskState {
    data: Task[],
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
}

interface Props {
    mode: string;
    onClose: () => void;
    openEditModal: (id: number) => void;
    onCreate: (task: Task) => void;
    onSave: (task: Task) => void;
    onClone: (id: number) => void;
    onRemove: (id: number) => void;
    onFilter: (date: string, status: string) => void;
}

export const TaskModal: FC<Props> = ({mode, onClose, openEditModal, onCreate, onSave, onRemove, onClone, onFilter}) => {
    const dispatch = useDispatch();
    const data = useSelector((state: {tasks: TaskState}) => state.tasks.data);
    const title = useSelector((state: {tasks: TaskState}) => state.tasks.title);
    const description = useSelector((state: {tasks: TaskState}) => state.tasks.description);
    const time = useSelector((state: {tasks: TaskState}) => state.tasks.time);
    const date = useSelector((state: {tasks: TaskState}) => state.tasks.date);
    const modalRef = useRef<HTMLDivElement>(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const task = data?.find(task => task.id === Number(id));

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(modalActions.resetModalData());
            onClose();
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            dispatch(modalActions.resetModalData());
            onClose();
        }
    };

    useEffect(() => {
        if (mode) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mode]);

    // useEffect(() => {
    //     if (task) {
    //         dispatch(tasksActions.editTask({
    //             title: task.title,
    //             description: task.description,
    //             time: task.time,
    //             date: task.date,
    //         }));
    //     } else {
    //         dispatch(modalActions.resetModalData());
    //     }
    // }, [task]);

    const isValidId = () => {
        const valid = data?.some(t => t.id.toString() === id);
        if (!valid) {
            console.log('Некорректный id', 'error');
        };
        return valid
    };

    const validateField = (value: string, fieldName: string, maxLength: number) => {
        if (!value) return `${fieldName} is required`;
        if (value.length > maxLength) return `Максимум ${maxLength} символов`;
        return '';
    };

    const validateTime = (time: string) => {
        if (!/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(time)) return 'Enter a valid time';
        return '';
    };

    const validateDate = (date: string) => {
        const today = new Date();
        const inputDate = new Date(date.split('.').reverse().join('-'));
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return 'Enter a valid date';
        if (inputDate < today) return 'Enter the date that has not passed yet';
        return '';
    };

    const validate = () => {
        const newErrors = {
            title: validateField(title, 'Enter the title', 50),
            description: validateField(description, 'Enter description', 200),
            time: validateTime(time),
            date: date ? validateDate(date) : 'Enter date'
        };
        const isValid = Object.values(newErrors).every(error => !error);
        dispatch(modalActions.setErrors(newErrors));
        return isValid;
    };

    const isShow = (() => {
        if (data?.length === 0) return true;
        return (mode === VALID_MODE.CREATE || mode === VALID_MODE.FILTER)
            || (VALID_MODES.includes(mode) && isValidId());
    })();

    if (!isShow || !task) {
        return null;
    }

    return (
        <div className="modalOverlay" ref={modalRef}>
                <ModalForm>
                    <FormHeader task={task} mode={mode} onClose={onClose} />
                    <FormBody
                        task={task}
                        mode={mode}
                        onCreate={onCreate}
                        onSave={onSave}
                        onEdit={openEditModal}
                        onRemove={onRemove}
                        onClose={onClose}
                        onClone={onClone}
                        onFilter={onFilter}
                        validate={validate}
                    />
                </ModalForm>
        </div>
    );
};
