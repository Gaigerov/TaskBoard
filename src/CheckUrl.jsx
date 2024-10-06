import React from 'react';
import {
    Link,
    useLocation,
} from "react-router-dom";

export const CheckUrl = () => {
    const location = useLocation();

    const isValidUrl = (url) => {
        const validUrls = ['/create', '/view', '/edit', '/remove']; // Пример валидных URL
        return validUrls.includes(url);
    };
    if (!isValidUrl(location.pathname)) {
        return <Link to="/" />;
    }

    return (
        <div>
            <h1>{location.pathname}</h1>
        </div>
    );
};
