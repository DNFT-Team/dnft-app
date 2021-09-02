import axios from 'axios';
import globalConf from 'config/index';

axios.defaults.baseURL =  globalConf.baseUrl + '/';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000 * 3;

export default axios;
