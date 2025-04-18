import {useState, useEffect, FC, ReactNode} from 'react';
import {Button} from '../Button/Button';
import {modalActions} from '../../redux/modalStore';
import {useDispatch} from 'react-redux';

interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
}

interface Props {
    children: ReactNode;
    task: Task;
    onRemove: (id:number) => void;
}

export const PopoverRemove: FC<Props> = ({children, task, onRemove}) => {
    const [isShow, setIsShow] = useState(false);
    const dispatch = useDispatch();
    const tooglePopup = () => {
        setIsShow(!isShow);
    };

    const handleRemoveTask = (id: number) => {
        onRemove(task.id);
        dispatch(modalActions.resetModalData());
        setIsShow(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (event && !(event.target as HTMLElement).closest('.popoverRemove') === null) {
            setIsShow(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <span className="Container__remove" onClick={tooglePopup}>
            {children}
            {isShow && (
                <div className="popper">
                    <h2 className="modalRemoveParagraph">Remove the task?</h2>
                    <div className='buttonContainer'>
                        <Button
                            type="remove"
                            onClick={() => handleRemoveTask(task.id)}
                            name="Remove"
                        />
                        <Button
                            type="cancel"
                            onClick={tooglePopup}
                            name="Cancel"
                        />
                    </div>
                </div>
            )}
        </span>
    );
};
