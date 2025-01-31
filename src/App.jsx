import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import {GlobalStoreController} from './GlobalStoreContext';
import {NotificationProvider} from './components/Notification/NotificationContext';

import './config/App.css';
import {TaskBoard} from './TaskBoard';

const router = createHashRouter([
    {
        path: "/:mode?",
        element: <TaskBoard />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GlobalStoreController>
            <NotificationProvider>
                <RouterProvider router={router} />
            </NotificationProvider>
        </GlobalStoreController>
    </React.StrictMode>
);
