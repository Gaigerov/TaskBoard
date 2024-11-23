import React from 'react';
import {Button} from '../Button';
import {useGlobalStore} from './GlobalStoreContext';

export const FormFooter = ({ mode, onSave, onRemove, onClone, onEdit, onClose, onCreate }) => {
    const {status} = useGlobalStore();
    return (
        <div className="form-footer">
            <div>{status}</div>
            <Button onClick={onSave}>Save</Button>
            <Button onClick={onClone}>Clone</Button>
            <Button onClick={onClose}>Cancel</Button>
        </div>
    );
};