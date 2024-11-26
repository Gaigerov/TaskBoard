import React from 'react';
import { VALID_MODE } from '../../constant';

export const ModalForm = ({ mode, children }) => {
    return <div className={mode === VALID_MODE.REMOVE ? "modalRemoveContent" : "modalContent"}>
        {children}
        </div>;
};
