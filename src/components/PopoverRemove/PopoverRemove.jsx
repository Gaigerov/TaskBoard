import React, {useEffect} from 'react';
import {Button} from '../Button/Button';
import {useSetGlobalStore} from '../../GlobalStoreContext';
import {useSearchParams} from "react-router-dom";
import { useGlobalStore } from '../../GlobalStoreContext';

export const PopoverRemove = ({onClose, onRemove}) => {
    const {tasks} = useGlobalStore();
    const [searchParams, setParams] = useSearchParams();
    const id = searchParams.get('id');

    // const currentTask = tasks.find(task => task.id === Number(id));

    const setGlobalStore = useSetGlobalStore();
    // const handleRemoveTask = () => {
    //     onRemove(task.id)
    //     onClose();
    //     setGlobalStore({
    //         title: '',
    //         description: '',
    //         time: '',
    //         date: '',
    //     })
    // }

    const handleClickOutside = (event) => {
        if (event.target.closest('.popoverRemove') === null) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="popoverRemove" onClick={(e) => e.stopPropagation()}>
            <div className="modalModeText">
                <p className="modalRemoveParagraph">Are you sure you want to delete the task "
                    {/* <span className="modalBoldText">{currentTask.title}</span>"? */}
                </p>
            </div>
            <Button
                type="remove"
                onClick={handleRemoveTask}
                name="Remove"
            />
            <Button
                type="cancel"
                onClick={onClose}
                name="Cancel"
            />

        </div>
    );
};
