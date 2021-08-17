import axios from 'axios';

axios.defaults.baseURL = 'http://92.205.29.153:8000/';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000 * 3;

export default axios;
