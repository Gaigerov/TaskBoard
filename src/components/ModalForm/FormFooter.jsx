import React from 'react';
import {
    useNavigate,
} from "react-router-dom";
import {Button} from '../Button/Button';
import {useGlobalStore} from '../../GlobalStoreContext';
import {useSetGlobalStore} from '../../GlobalStoreContext';
import {VALID_MODE} from '../../constant';


export const FormFooter = ({task, mode, onSubmit, onEdit, onRemove, onClone, onClose, onFilter}) => {
    const state = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();
    const {filterTo} = state;
    const navigate = useNavigate();

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

    const handleNavigateToEdit = (task) => {
        navigate('/');
        navigate(`${VALID_MODE.EDIT}?id=${task.id}`);
        onEdit(task);
    }

    const handleDropFilter = () => {
        setGlobalStore({
            ...filterTo,
            search: '',
            filterDate: undefined,
            filterStatus: undefined,
        })
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
                        onClick={() => handleNavigateToEdit(task)}
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
                        onClick={onFilter}
                        name="Filter"
                    />
                    <Button
                        type="remove"
                        onClick={handleDropFilter}
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