import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import {GlobalStoreController} from './GlobalStoreContext';
import {AppLifecycleProvider} from './AppLifeCycleContext';
import {NotificationProvider} from './components/Notification/NotificationContext';
import {Provider} from 'react-redux';
import store from './redux/globalStore';

import './config/App.css';
import {TaskBoard} from './TaskBoard';

const router = createHashRouter([
    {
        path: "/:mode?",
        element: <TaskBoard />,
    },
]);

const App = () => (
    <AppLifecycleProvider>
        <GlobalStoreController>
            <NotificationProvider>
                <RouterProvider router={router} />
        </NotificationProvider>
    </GlobalStoreController>
    </AppLifecycleProvider >
);

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
} else {
    console.error("Root element not found");
}
