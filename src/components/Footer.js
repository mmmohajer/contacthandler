import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {
	return (
		<footer className="border-top text-center small text-muted py-3">
      		<p>
      			<Link to="/" className="mx-1">Home</Link> 
      			|
      			<Link className="mx-1" to="/about-app">About App</Link> 
      			| 
      			<Link className="mx-1" to="/thanks">Thank You Page</Link>
      		</p>
      		<p className="m-0">Copyright &copy; 2020 <a href="/" className="text-muted">Powered by Mohammad Mohajer</a>. All rights reserved.</p>
    	</footer>
	)
}

export default Footer