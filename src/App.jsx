import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import {GlobalStoreController} from './GlobalStoreContext';

import './config/App.css';
import {ErrorPage} from "./ErrorPage";
import {TaskBoard} from './TaskBoard';

const router = createHashRouter([
    {
        path: "/:mode?",
        element: <TaskBoard />,
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GlobalStoreController>
        <RouterProvider router={router} />
        </GlobalStoreController>
    </React.StrictMode>
);
