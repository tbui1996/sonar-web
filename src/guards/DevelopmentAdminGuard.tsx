import React from 'react';
import { Redirect } from 'react-router-dom';
import useGetCognitoUser from '../hooks/useGetCognitoUser';
import LoadingScreen from '../components/LoadingScreen';
import { PATH_PAGE } from '../routes/paths';
import CognitoGroups from '../constants/cognitoGroups';

const DevelopmentAdminGuard: React.FC = ({ children }) => {
  const { data: cognitoUser, isLoading } = useGetCognitoUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (
    !cognitoUser?.signInUserSession.accessToken.payload[
      'cognito:groups'
    ]?.includes(CognitoGroups.DEVELOPMENT_ADMIN)
  ) {
    return <Redirect to={PATH_PAGE.page404} />;
  }

  return <>{children}</>;
};

export default DevelopmentAdminGuard;
