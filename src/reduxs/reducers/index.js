import {combineReducers} from 'redux';
import home from './home';
import lng from './lng';
import profile from './profile';

const appReducer = combineReducers({
  home,
  lng,
  profile,
})
const rootReducer = (state, action) => appReducer(state, action);
export default rootReducer;
