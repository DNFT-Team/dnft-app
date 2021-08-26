import {combineReducers} from 'redux';
import home from './home';
import lng from './lng';
import profile from './profile';
import market from './market';

const appReducer = combineReducers({
  home,
  lng,
  profile,
  market,
})
const rootReducer = (state, action) => appReducer(state, action);
export default rootReducer;
