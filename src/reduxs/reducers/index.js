import {combineReducers} from 'redux';
import home from './home';
import lng from './lng';

const appReducer = combineReducers({
  home,
  lng,
})
const rootReducer = (state, action) => appReducer(state, action);
export default rootReducer;
