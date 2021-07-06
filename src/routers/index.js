import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {ROUTER_MAP} from './config';

export default function App() {
    return (
        <Switch>{ROUTER_MAP.map(renderRoute)}</Switch>
    )
}
function renderRoute({ path, Component, exact, noAuth, children }, index) {
    return children ? (
        children.map(renderRoute)
    ) : (
        <Route key={index} exact={exact} path={path}>
            <Component />
        </Route>
    );
}