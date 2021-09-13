import { useDispatch, useSelector } from 'react-redux';
// redux
import { RootState } from '../redux/store';
import { login, logout } from '../redux/slices/authJwt';

export default function useAuth() {
  // JWT Auth
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.authJwt
  );

  return {
    user,
    isLoading,
    isAuthenticated,

    login: () => dispatch(login()),

    logout: () => dispatch(logout()),

    updateProfile: (data: any) => {}
  };
}
