import {useDispatch} from 'react-redux';
import {AppDispatch} from './redux/globalStore';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()