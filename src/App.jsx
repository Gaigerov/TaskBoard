import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import {AppLifecycleProvider} from './AppLifeCycleContext';
import {NotificationProvider} from './components/Notification/NotificationContext';
import {Provider} from 'react-redux';
import store from './redux/globalStore';

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
        <NotificationProvider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </NotificationProvider>
    </AppLifecycleProvider >
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
