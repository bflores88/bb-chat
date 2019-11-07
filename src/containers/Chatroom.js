import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Chatroom extends Component {
	state = {
		chatHistory: [],
		input: '',
	};

	render() {
		console.log('chat history', this.props);
		console.log(this.state);

		return (
			<React.Fragment>
				{/* {!this.props.user ? <Redirect to="/" /> : null} */}
				<h1>Chatroom</h1>
			</React.Fragment>
		);
	}
}

export default Chatroom;
