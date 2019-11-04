import React, { Component } from 'react';
// import classes from './Home.module.scss';
import Login from '../../components/Login/Login';

class Home extends Component {
	state = {};

	render() {
		return (
			<React.Fragment>
				Welcome to Jabdam!
				<Login />
			</React.Fragment>
		);
	}
}

export default Home;
