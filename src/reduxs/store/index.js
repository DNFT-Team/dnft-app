import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducers'
import { persistStore } from 'redux-persist';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = process.env.NODE_ENV !== 'production' ? [thunk, logger] : [thunk];
const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);
const persistor = persistStore(store);

export {
    store,
    persistor
}