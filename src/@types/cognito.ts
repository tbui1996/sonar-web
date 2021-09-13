export interface CognitoUser {
  username: string;
  pool: Pool;
  Session?: null;
  client: Client;
  signInUserSession: CognitoUserSession;
  authenticationFlowType: string;
  storage: Storage;
  keyPrefix: string;
  userDataKey: string;
}

export interface Pool {
  userPoolId: string;
  clientId: string;
  client: Client;
  advancedSecurityDataCollectionFlag: boolean;
  storage: Storage;
}

export interface Client {
  endpoint: string;
}

export interface CognitoUserSession {
  idToken: IdToken;
  refreshToken: RefreshToken;
  accessToken: AccessToken;
  clockDrift: number;
}

export interface IdToken {
  jwtToken: string;
  payload: IdTokenPayload;
}

export interface IdTokenPayload {
  at_hash: string;
  sub: string;
  'cognito:groups'?: string[] | null;
  email_verified: boolean;
  iss: string;
  'cognito:username': string;
  origin_jti: string;
  aud: string;
  identities?: IdentitiesEntity[] | null;
  token_use: string;
  auth_time: number;
  name: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
}

export interface IdentitiesEntity {
  userId: string;
  providerName: string;
  providerType: string;
  issuer?: null;
  primary: string;
  dateCreated: string;
}

export interface RefreshToken {
  token: string;
}

export interface AccessToken {
  jwtToken: string;
  payload: AccessTokenPayload;
}

export interface AccessTokenPayload {
  sub: string;
  'cognito:groups'?: string[] | null;
  iss: string;
  version: number;
  client_id: string;
  origin_jti: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}
