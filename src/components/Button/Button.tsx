import {FC} from 'react';

type Props = {
    name: string;
    onClick: () => void;
    type: string;
}

export const Button: FC<Props> = ({name, onClick, type}) => {

    const modificator = type ? `Button__${type}` : '';
    const className = `Button ${modificator}`;

    return (
        <button className={className} onClick={onClick}>{name}</button>
    );
};
