import AxiosMockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// ----------------------------------------------------------------------

// don't use the main axios instance for mock, routes all requests to localhost
const axiosMockAdapter = new AxiosMockAdapter(axios.create(), {
  delayResponse: 0
});

export default axiosMockAdapter;
