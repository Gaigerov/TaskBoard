import {FC} from 'react';

type Props = {
    name: string;
    onClick: () => void;
    type: string;
}

export const Button: FC<Props> = ({name, onClick, type}) => {

    const modificator = type ? `Button_${type}` : '';
    const className = `btn ${modificator}`;

    return (
        <button className={className} onClick={onClick}>{name}</button>
    );
};
