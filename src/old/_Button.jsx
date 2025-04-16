import React from 'react';

export const Button = ({name, onClick, type}) => {

    const modificator = type ? `Button_${type}` : '';
    const className = `btn ${modificator}`;

    return (
        <button className={className} onClick={onClick}>{name}</button>
    );
};
