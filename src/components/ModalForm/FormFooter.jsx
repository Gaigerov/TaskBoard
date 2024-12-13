import React from 'react';
import {Button} from '../Button/Button';
import {useSetGlobalStore} from '../../GlobalStoreContext';
import {VALID_MODE} from '../../constant';


export const FormFooter = ({filteredTasks, task, mode, onSubmit, onFilter, onEdit, onRemove, onClone, onClose}) => {
    const setGlobalStore = useSetGlobalStore();

    const handleClose = (event) => {
        event.preventDefault();
        onClose();
        setGlobalStore({
            title: '',
            description: '',
            time: '',
            date: '',
        });
    };

    const handleRemoveTask = () => {
        onRemove(task.id)
        onClose();
        setGlobalStore({
            title: '',
            description: '',
            time: '',
            date: '',
        })
    }

    const handleCloneTask = () => {
        onClone(task.id);
        onClose();
    }

    const handleFilterTasks = () => {
        onFilter(filteredTasks);
        onClose();
    }

    return (
        <div className="modalButtons">
            {mode === VALID_MODE.CREATE && (
                <>
                    <Button
                        type="create"
                        onClick={onSubmit}
                        name="Create"
                    />
                    <Button
                        type="cancel"
                        onClick={handleClose}
                        name="Cancel"
                    />
                </>
            )}
            {mode === VALID_MODE.EDIT && (
                <>
                    <Button
                        type="save"
                        onClick={onSubmit}
                        name="Save"
                    />
                    <Button
                        type="cancel"
                        onClick={handleClose}
                        name="Cancel"
                    />
                </>
            )}
            {mode === VALID_MODE.VIEW && (
                <>
                    <Button
                        type="edit"
                        onClick={onEdit}
                        name="Edit"
                    />
                    <Button
                        type="clone"
                        onClick={handleCloneTask}
                        name="Copy"
                    />
                    <Button
                        type="cancel"
                        onClick={handleClose}
                        name="Cancel"
                    />
                </>
            )}
            {mode === VALID_MODE.REMOVE && (
                <>
                    <Button
                        type="remove"
                        onClick={handleRemoveTask}
                        name="Remove"
                    />
                    <Button
                        type="cancel"
                        onClick={handleClose}
                        name="Cancel"
                    />
                </>
            )}
            {mode === VALID_MODE.FILTER && (
                <>
                    <Button
                        type="save"
                        onClick={onSubmit}
                        name="Filter"
                    />
                    <Button
                        type="remove"
                        onClick={handleFilterTasks}
                        name="Reset"
                    />
                    <Button
                        type="cancel"
                        onClick={handleClose}
                        name="Cancel"
                    />
                </>
            )}
        </div>
    );
};