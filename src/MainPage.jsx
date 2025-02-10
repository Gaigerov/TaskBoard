import React from 'react';
import {APP_LIFECYCLE_STATUS} from './constant';
import {useAppLifecycleStatus} from './AppLifeCycleContext';
import {TaskBoard} from './TaskBoard';

export const MainPage = () => {
    const lifecycleStatus = useAppLifecycleStatus();
    return (
<>
{lifecycleStatus === APP_LIFECYCLE_STATUS.INITIALIZATION && <div style={{backgroundColor: 'red'}}>LOADING...</div>}
{lifecycleStatus === APP_LIFECYCLE_STATUS.READY && <TaskBoard />}
</>
);
};
