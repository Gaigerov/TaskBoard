import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import {AppLifecycleProvider} from './_AppLifeCycleContext';
import {NotificationProvider} from './components/Notification/_NotificationContext';
import {Provider} from 'react-redux';
import store from './redux/globalStore';

import './config/App.css';
import {AuthPage} from './_AuthPage';

const router = createHashRouter([
    {
        path: "/:mode?",
        element: <AuthPage />,
    },
]);

const App = () => (
    <AppLifecycleProvider>
        <NotificationProvider>
            <RouterProvider router={router} />
        </NotificationProvider>
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
