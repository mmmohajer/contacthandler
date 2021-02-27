import React from 'react'

import Page from './Page'

const About = () => {
	return (
		<Page title = "About App">
			<h2>About App</h2>
			<p className="lead text-muted">
				This is a single page application (SPA) created to let admin user manage
				his contac lists. Subscribers can register to this app to add their 
				contact information visible in public. Moreover, Subscribers 
				can Update/Delete their created contact informations
			</p>
			<h2>Technical Aspects</h2>
			<p>
				React, one of the most popular libraries of Java Script is used to develop
				the front end of this application, while StormAPI is usedfor the 
				purpose of back end development. Some important features of this app
				are written as follows:
			</p>
			<ol className = "aboutList">
				<li>
					It has client-side layer of security, not only to ignore special
					characters in our forms, but also to prevent users register with 
					a unique username and email.
				</li>
				<li>
					It has a beautifully designed flash messages informing users if there
					are some problems in their input values.
				</li>
				<li>
					This app is fully responsive and is well designed to be viewed 
					by different devices.
				</li>
				<li>
					Subscribed users have ability to perform CRUD operations about their 
					contact information. Moreover, they can view/print other user's 
					contact information.
				</li>
				<li>
					The code is written in a very clean and clear way. All components are
					written using function based react components and React useContex 
					Hooks is used to manage states.
				</li>
				<li>
					use-immer package is used to have better and more organised way for 
					managing react states.
				</li>
			</ol>
    	</Page>
	)
}

export default About