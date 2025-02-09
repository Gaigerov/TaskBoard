import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import {GlobalStoreController} from './GlobalStoreContext';
import {AppLifeCycleProvider} from './AppLifeCycleContext';
import {NotificationProvider} from './components/Notification/NotificationContext';

import './config/App.css';
import {TaskBoard} from './TaskBoard';

const router = createHashRouter([
    {
        path: "/:mode?",
        element: <TaskBoard />,
    },
]);

const App = () => (
    <AppLifeCycleProvider>
        <GlobalStoreController>
            <NotificationProvider>
                <RouterProvider router={router} />
            </NotificationProvider>
        </GlobalStoreController>
    </AppLifeCycleProvider>
);

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Root element not found");
}
