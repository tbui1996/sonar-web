import { useDispatch, useSelector } from 'react-redux';
// redux
import { RootState } from '../redux/store';
import { login, logout, token } from '../redux/slices/authJwt';

export function useAuth() {
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

    token: () => token(),

    updateProfile: (data: any) => {}
  };
}
