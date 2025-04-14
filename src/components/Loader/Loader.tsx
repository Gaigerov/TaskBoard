import {FC} from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
    open: boolean;
}

export const Loader: FC<Props> = ({open}) => (
    <div className="loader">
        <Backdrop
            sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
            open={open}
        >
            <div className='loader__animation'>
                <CircularProgress color="inherit" />
                <p>Loading...</p>
            </div>
        </Backdrop>
    </div>
);
