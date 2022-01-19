import { useQuery, UseQueryOptions } from 'react-query';
import Auth from '@aws-amplify/auth';
import { CognitoUser } from '../@types/cognito';

const useGetCognitoUser = (options: UseQueryOptions<CognitoUser> = {}) =>
  useQuery<CognitoUser>(
    'cognito-user',
    () => Auth.currentUserPoolUser(),
    options
  );

export default useGetCognitoUser;
