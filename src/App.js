import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import socket from './services/socket';

import Avatar from './components/Avatar';
import Main from './containers/Main';
import Home from './pages/Home';
import Chatroom from './pages/Chatroom';
import UserSelection from './pages/UserSelection';

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

			console.log(chatHistory);

			return onEnterSuccess(chatHistory);
		});
	};

	onLeaveChatroom = (chatroomName, onLeaveSuccess) => {
		this.state.client.leave(chatroomName, (err) => {
			if (err) {
				return console.error(err);
			}
			console.log('left chatroom');
			return onLeaveSuccess();
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
				return (
					<Route
						key={r.name}
						path={`/${r.name}`}
						component={(props) => (
							<Chatroom
								user={this.state.user}
								chatroom={r}
								onExitPage={() => this.onLeaveChatroom(r.name, () => true)}
								onLeave={() => this.props.history.push('/')}
								registerHandler={this.state.client.registerHandler}
								unregisterHandler={this.state.client.unregisterHandler}
								onSendMessage={(message, cb) => this.state.client.message(r.name, message, cb)}
								{...props}
							/>
						)}
					/>
				);
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
