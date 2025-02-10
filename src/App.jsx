import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import {GlobalStoreController} from './GlobalStoreContext';
import {AppLifecycleProvider} from './AppLifeCycleContext';
import {NotificationProvider} from './components/Notification/NotificationContext';

import './config/App.css';
import {MainPage} from './MainPage';

const router = createHashRouter([
    {
        path: "/:mode?",
        element: <MainPage />,
    },
]);

const App = () => (
    <AppLifecycleProvider>
        <GlobalStoreController>
            <NotificationProvider>
                <RouterProvider router={router} />
            </NotificationProvider>
        </GlobalStoreController>
    </AppLifecycleProvider>
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
