import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux';
import {AppDispatch, RootState} from './redux/globalStore';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;