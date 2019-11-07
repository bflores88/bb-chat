import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import socket from './services/socket';

import Avatar from './components/Avatar';
import Main from './containers/Main';
import Home from './components/Home';
import Chatroom from './containers/Chatroom';
import UserSelection from './containers/UserSelection';

class App extends Component {
	state = {
		user: null,
		isRegisterInProcess: false,
		client: socket(),
		chatrooms: null,
	};

	getChatrooms = () => {
		this.state.client.getChatrooms((err, chatrooms) => {
			this.setState({ chatrooms });
		});
	};

	onEnterChatroom = (chatroomName, onNoUserSelected, onEnterSuccess) => {
		if (this.state.user === null) {
			return onNoUserSelected();
		}

		return this.state.client.join(chatroomName, (err, chatHistory) => {
			if (err) {
				return console.error(err);
			}

			return onEnterSuccess(chatHistory);
		});
	};

	register = (name) => {
		const onRegisterResponse = (user) => this.setState({ isRegisterInProcess: false, user });
		this.setState({ isRegisterInProcess: true });
		this.state.client.register(name, (err, user) => {
			if (err) {
				return onRegisterResponse(null);
			}
			return onRegisterResponse(user);
		});
	};

	componentDidMount() {
		this.getChatrooms();
	}

	render() {
		let chatroomRoutes = null;
		console.log(this.state);
		if (this.state.chatrooms) {
			chatroomRoutes = this.state.chatrooms.map((r) => {
				return <Route key={r.name} path={`/${r.name}`} component={() => <Chatroom user={this.state.user} />} />;
			});
		}

		const routes = (
			<Switch>
				<Route
					path="/"
					exact
					component={() => (
						<Home
							chatrooms={this.state.chatrooms}
							onEnterChatroom={(chatroomName) =>
								this.onEnterChatroom(
									chatroomName,
									() => this.props.history.push('/user'),
									(chatHistory) =>
										this.props.history.push({ pathname: chatroomName, state: { chatHistory: chatHistory } }),
								)
							}
						/>
					)}
				/>
				<Route
					path="/user"
					component={() => (
						<UserSelection
							getAvailableUsers={this.state.client.getAvailableUsers}
							user={this.state.user}
							register={this.register}
						/>
					)}
				/>
				{chatroomRoutes}
			</Switch>
		);

		return (
			<Main>
				<Avatar user={this.state.user} />
				{routes}
			</Main>
		);
	}
}

export default hot(withRouter(App));
