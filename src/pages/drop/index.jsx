import React from 'react'
import { Link } from 'react-router-dom'

export default function DropPage() {
	return (
		<div>
			<h1>Drop Page</h1>
			<Link to="/drop/mystery">Mystery</Link>
			<br />
			<Link to="/drop/auction">Auction</Link>
		</div>
	)
}
