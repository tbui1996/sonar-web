# Sonar Internal Web

## Getting Started

1. Install the necessary dependencies

```
yarn install
```

2. Create a `.env` file with the following variables:

The Cognito environment variables can be obtained after successfully deploying `sonar-backend`.

```dotenv
REACT_APP_BASE_API_DOMAIN=<NAME>.circulo.dev
REACT_APP_COGNITO_REGION=us-east-2
REACT_APP_COGNITO_USER_POOL_ID=<INTERNAL_USER_POOL>
REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID=<INTERNAL_USER_POOL_WEB_CLIENT_ID>
REACT_APP_COGNITO_REDIRECT_SIGNIN=http://localhost:8080/dashboard/app
REACT_APP_COGNITO_REDIRECT_SIGNOUT=http://localhost:8080
REACT_APP_COGNITO_DOMAIN=sonar-<NAME>-internals-web-app.auth.us-east-2.amazoncognito.com
```

- `BASE_API_DOMAIN`: Used to establish endpoint for API calls, e.g. `dev-you.circulo.dev`
- `COGNITO_REGION`: The region that your Cognito User Pool is in, e.g. `us-east-2`
- `COGNITO_USER_POOL_ID`: The Cognito User Pool ID for `internals`, e.g `us-east-2_ksdfjLHDjhS`
- `COGNITO_USER_POOL_WEB_CLIENT_ID`: The User Pool Web Client ID for `internals`, e.g. `kmsdaaKHGsd8i6S6SDta9j4u`
- `COGNITO_REDIRECT_SIGNIN`: The redirect URL on sign in, e.g. `http://localhost:8080/dashboard/app`
  - NOTE: redirect signin URL must match the callback URL set on your `internals` user pool client
- `COGNITO_REDIRECT_SIGNOUT`: The redirect URL on sign out, e.g. `http://localhost:8080`
- `COGNITO_DOMAIN`: The domain of your Cognito `internals` User Pool App Integration, e.g. `sonar-dev-you-internals-web-app.auth.us-east-2.amazoncognito.com`

3. Start the application

```
yarn start
```

4. Done!
