import {FC, ReactNode} from 'react';

interface Props {
    children: ReactNode;
}

export const ModalForm: FC<Props> = ({children}) => {
    return <div className="modalContent">
        {children}
        </div>;
};
