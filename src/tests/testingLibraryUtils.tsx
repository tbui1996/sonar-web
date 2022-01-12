import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { HelmetProvider } from 'react-helmet-async';
import { persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../redux/store';
import supportReducer from '../redux/slices/support';
import { rootPersistConfig } from '../redux/rootReducer';
import authJwtReducer, {
  initialState as authJwtState
} from '../redux/slices/authJwt';
import settingsReducer, {
  initialState as settingsState
} from '../redux/slices/settings';
import { initialState as supportState } from '../redux/slices/support/slice';

const middleware = [thunk];
const history = createMemoryHistory();

const rootReducer = combineReducers({
  support: supportReducer,
  settings: settingsReducer,
  authJwt: authJwtReducer
});

const initialStateDefault = {
  support: supportState,
  authJwt: authJwtState,
  settings: settingsState
};

export const createStoreWithMiddlewares = (initialState: any): Store => {
  const store = createStore(
    persistReducer(rootPersistConfig, rootReducer),
    initialState,
    applyMiddleware(...middleware)
  );
  return store;
};

export interface ExtendedRenderOptions extends RenderOptions {
  initialState: any;
  store?: Store;
}

const render = (
  component: React.ReactElement,
  {
    initialState = initialStateDefault,
    ...renderOptions
  }: ExtendedRenderOptions
) => {
  function TestWrapper({
    children
  }: {
    children?: React.ReactNode;
  }): React.ReactElement {
    const store = createStoreWithMiddlewares(initialState);
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <HelmetProvider>
            <Router history={history}>{children}</Router>
          </HelmetProvider>
        </PersistGate>
      </Provider>
    );
  }

  return rtlRender(component, {
    wrapper: TestWrapper,
    ...renderOptions
  });
};

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
