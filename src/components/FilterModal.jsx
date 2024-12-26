import React, {useState, useRef} from 'react';

import { ModalForm } from './ModalForm/ModalForm';
import { FormHeader } from './ModalForm/FormHeader';
import {FormBody} from './ModalForm/FormBody';
import {FormFooter} from './ModalForm/FormFooter';

export const FilterModal = ({mode, onClose, onFilter}) => {
    const modalRef = useRef(null);
    const [inputDateFilter, setInputDateFilter] = useState('');
    const [inputStatusFilter, setInputStatusFilter] = useState('');

    const handleReset = () => {
        setInputDateFilter('');
        setInputStatusFilter('');
    }

    return (
        <div className="modalOverlay" ref={modalRef}>
                <ModalForm>
                <FormHeader mode={mode} onClose={onClose} />
                <FormBody mode={mode} />
                <FormFooter

                    mode={mode}
                    onReset={handleReset}
                    onClose={onClose}
                    onFilter={onFilter}
                />
            </ModalForm>
        </div>
    );
};
