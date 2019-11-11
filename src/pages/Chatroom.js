import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

const ChatWindow = styled.div`
	width: 40vw;
	min-width: 200px;
	max-width: 800px;
	background-color: rgb(255, 255, 255);
	padding: 20px;
	border-radius: 18px;
	height: 60vh;
	min-height: 500px;
`;

const ChatHeader = styled.div`
	height: 5%;
	width: 100%;
	font-size: 1.5em;
	padding: 5px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const InputWrapper = styled.div`
	display: flex;
	margin-top: 3%;
`;

class Chatroom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chatHistory: [],
			input: '',
			user: null,
		};

		this.chatEndRef = React.createRef();
	}

	componentDidMount() {
		this.props.registerHandler(this.onMessageReceived);
		this.setState({
			user: this.props.user,
			chatHistory: this.state.chatHistory.concat(this.props.location.state.chatHistory),
		});
	}

	componentDidUpdate() {
		this.scrollToChatEnd();
	}

	componentWillUnmount() {
		this.props.unregisterHandler();
		this.props.onExitPage();
	}

	handleChange = (event) => {
		this.setState({ input: event.target.value });
	};

	updateChatHistory = (entry) => {
		this.setState({ chatHistory: this.state.chatHistory.concat(entry) });
	};

	onMessageReceived = (entry) => {
		this.updateChatHistory(entry);
	};

	onSendMessage = () => {
		if (!this.state.input) {
			return;
		}

		this.props.onSendMessage(this.state.input, (err) => {
			if (err) {
				console.error(err);
			}
		});

		return this.setState({ input: '' });
	};

	onLeaveChatroom = () => {
		this.props.onLeave();
	};

	scrollToChatEnd() {
		this.chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	render() {
		const renderActivity =
			this.state.chatHistory.length === 0
				? null
				: this.state.chatHistory.map((event, idx) => {
						let listText = null;

						if (event.event) {
							listText = <ListItemText secondary={`${event.user.username} ${event.event}`} />;
						} else {
							listText = <ListItemText primary={event.message} />;
						}

						if (event.user.username === this.state.user.username) {
							return (
								<ListItem key={idx} style={{ textAlign: 'right' }}>
									{listText}
									<ListItemAvatar style={{ marginLeft: '10px' }}>
										<Avatar src={event.user.image} />
									</ListItemAvatar>
								</ListItem>
							);
						} else {
							return (
								<ListItem key={idx}>
									<ListItemAvatar>
										<Avatar src={event.user.image} />
									</ListItemAvatar>
									{listText}
								</ListItem>
							);
						}
				  });

		return (
			<React.Fragment>
				{!this.props.user ? <Redirect to="/" /> : null}
				<ChatWindow>
					<ChatHeader>
						{this.props.chatroom.name}
						<IconButton color="secondary" onClick={this.onLeaveChatroom}>
							<CloseIcon />
						</IconButton>
					</ChatHeader>
					<div
						style={{
							backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url("${this.props.chatroom.image}")`,
							backgroundSize: 'cover',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center',
							height: '75%',
							borderRadius: '6px',
							marginTop: '10px',
						}}
					>
						<List
							style={{
								height: '100%',
								padding: '10px',
								overflow: 'auto',
								backgroundColor: 'rgba(255, 255, 255, .7)',
							}}
						>
							{renderActivity}
							<div ref={this.chatEndRef} />
						</List>
					</div>

					<InputWrapper>
						<TextField
							onChange={this.handleChange}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									return this.onSendMessage();
								}
							}}
							style={{ width: '100%', paddingRight: '5px' }}
							rows="1"
							variant="outlined"
							value={this.state.input}
							multiline
						/>
						<Button variant="contained" color="primary" onClick={this.onSendMessage}>
							Send
						</Button>
					</InputWrapper>
				</ChatWindow>
			</React.Fragment>
		);
	}
}

export default Chatroom;
