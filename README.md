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
REACT_APP_DOPPLER_DASHBOARD_URL=https://doppler.circulo.dev/apps/Circulator-Latest
```

- `BASE_API_DOMAIN`: Used to establish endpoint for API calls, e.g. `dev-you.circulo.dev`
- `COGNITO_REGION`: The region that your Cognito User Pool is in, e.g. `us-east-2`
- `COGNITO_USER_POOL_ID`: The Cognito User Pool ID for `internals`, e.g `us-east-2_ksdfjLHDjhS`
- `COGNITO_USER_POOL_WEB_CLIENT_ID`: The User Pool Web Client ID for `internals`, e.g. `kmsdaaKHGsd8i6S6SDta9j4u`
- `COGNITO_REDIRECT_SIGNIN`: The redirect URL on sign in, e.g. `http://localhost:8080/dashboard/app`
  - NOTE: redirect signin URL must match the callback URL set on your `internals` user pool client
- `COGNITO_REDIRECT_SIGNOUT`: The redirect URL on sign out, e.g. `http://localhost:8080`
- `COGNITO_DOMAIN`: The domain of your Cognito `internals` User Pool App Integration, e.g. `sonar-dev-you-internals-web-app.auth.us-east-2.amazoncognito.com`
- `DOPPLER_DASHBOARD_URL`: This URL will point to our latest version of the UI in our test Retool environment. Replace what's after apps/ with your own app if you create one.

3. Start the application

```
yarn start
```

4. Done!

## Testing

Our tests are currently created using [React Testing Library](https://testing-library.com/docs/), [Mirage](https://miragejs.com/), and Jest.

Command to run tests:
`yarn run test`

First, setup your tests rendering the component you want to test and the selections you would like to use when asserting.

```
const setup = () => {
  const mockedFunction = jest.fn();

  render(
    <ComponentToTest onChange={mockedFunction} />
  );

  // When testing for a text match use the regex format: "/text/i"
  const helperText = screen.getByText(/example/i);

  return {
    helperText,
    mockedFunction,
    ...screen
  };
};
```

Then you can start asserting:

```
test('Descriptive title', () => {
  const { helperText } = setup();
  expect(helperText).toBeInTheDocument();
});
```

You can simulate a user's behavior by using [fireEvent](https://testing-library.com/docs/guide-events/), React Testing Library's built-in method, which should be sufficient in most cases. Alternatively, you can use [userEvent](https://testing-library.com/docs/ecosystem-user-event/), which provides a more advanced simulation of browser interactions.

Example:

```
test('Function prop is called on input', async () => {
  const { input, mockedFunction } = setup();
  userEvent.type(input, 'test');
  expect(mockedFunction).toHaveBeenCalled();
});
```

On the example above, we chose to use `userEvent` because the `type` call, will trigger `keyDown`, `keyPress`, and `keyUp` events for each character as well. It's much closer to the user's actual interactions. As stated in the article [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) by Kent C. Dodds.

To mock api calls, create a new Mirage server instance:

```
import { makeServer } from '../../server';

let server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

```

And add the necessary routes to the server (under `src/server.js`):

```
export function makeServer({ environment = 'test' } = {}) {
  ...

  routes() {
      this.get('/forms', (schema) => {
        return schema.forms.all();
      });

      ...
  }
}

```

## Analyzing Bundle Size

According to this [blog post](https://www.emgoto.com/react-bundles-and-code-splitting/) there are 2 simple packages to visualize bundle size:

1. `source-map-explorer` (official support for create-react-app, but not recommended by the author)
2. `webpack-bundle-analyzer` (recommended by the author and easy enough to get working)

To add support for `webpack-bundle-analyzer` the steps were to:

1. `yarn add -D webpack-bundle-analyzer`
2. `yarn add -D progress-bar-webpack-plugin`
3. Add file `/scripts/analyze.js` based on this [blog post](https://medium.com/@romanonthego/webpack-bundle-analyzer-for-create-react-app-9aebb0d01084)
4. Add `"analyze": "node scripts/analyze.js"` to scripts in `package.json`
5. Run the analysis: `yarn analyze`

After analysis, a server should start on localhost for viewing a visual representation of the bundle size.

To run the analysis at any point, simply run `yarn analyze` again.
