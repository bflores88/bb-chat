import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import socket from './services/socket';

import Main from './containers/Main';
import Home from './components/Home';

class App extends Component {
	state = {
		user: null,
		isRegisterInProces: false,
		client: socket(),
		chatrooms: null,
	};

	getChatrooms = () => {
		this.state.client.getChatrooms((err, chatrooms) => {
			this.setState({ chatrooms });
		});
	};

	componentDidMount() {
		this.getChatrooms();
	}

	render() {
		let chatroomRoutes = null;

		if (this.state.chatrooms) {
			chatroomRoutes = this.state.chatrooms.map((r) => {
				return <Route key={r.name} path={`/${r.name}`} />;
			});
		}

		const routes = (
			<Switch>
				<Route path="/" exact component={() => <Home chatrooms={this.state.chatrooms} />} />
				<Route path="/user" />
				{chatroomRoutes}
			</Switch>
		);

		return <Main>{routes}</Main>;
	}
}

export default hot(App);
