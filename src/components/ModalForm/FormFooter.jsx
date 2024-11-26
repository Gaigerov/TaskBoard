import React from 'react';
import {Button} from '../Button';
import {useGlobalStore} from '../../GlobalStoreContext'
import {useSetGlobalStore} from '../../GlobalStoreContext';
import {VALID_MODE} from '../../constant';


export const FormFooter = ({mode, onSubmit, onRemove, onClone, onClose}) => {
    const {status} = useGlobalStore();
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

    return (
        <div className="modalButtons">
            <div>{status}</div>
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
                        onClick={onSubmit}
                        name="Edit"
                    />
                    <Button
                        type="clone"
                        onClick={onClone}
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
                        onClick={onSubmit}
                        name="Remove"
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