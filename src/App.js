import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';

import socket from './services/socket';

class App extends Component {
	state = {
		user: null,
		isRegisterInProces: false,
		client: socket(),
		chatrooms: null,
	};

	render() {
		return (
			<>
				<Switch></Switch>
			</>
		);
	}
}

export default hot(App);
