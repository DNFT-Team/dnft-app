import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ROUTER_MAP } from './config'
import ScrollToTop from './scrollToTop'
import SoonModal from '../components/SoonModal'

export default function App() {
	return (
		<ScrollToTop>
			<Suspense fallback={null}>
				<Switch>{ROUTER_MAP.map(renderRoute)}</Switch>
			</Suspense>
		</ScrollToTop>
	)
}
function renderRoute({ path, Component, exact, noAuth, children, reqComing }, index) {
	return children ? (
		children.map(renderRoute)
	) : (
		<Route key={index} exact={exact} path={path}>
			{reqComing ? <SoonModal /> : ''}
			<Component />
		</Route>
	)
}
